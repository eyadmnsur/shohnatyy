// Client for the Hazem Halan merchant portal (Mega Technology platform).
// On the phone, Capacitor's native HTTP patches fetch() so cookies/sessions and
// cross-origin requests work. HH_BASE can be overridden for local testing.
const HH_ORIGIN = window.HH_ORIGIN || 'https://hazem-halan.com';
const HH_BASE = HH_ORIGIN + '/admin-area/';
const HH_REAL = 'https://hazem-halan.com'; // for links the user opens in a new tab

const STATUS = {
  delivered: [5, 18],
  returned: [7, 8, 13, 14, 20, 21, 22, 24, 25, 27, 30, 31, 105, 135, 150],
  cancelled: [19, 110],
  postponed: [6, 37, 38],
};
STATUS.active = [1, 2, 3, 4, 16, 17, 23, 26, 28, 29, 32, 33, 34, 35, 36, 100, 115, 120, 121, 122, 125, 330, 400, 450];
// Waiting for the courier to collect from the store: pickup requested / pickup assigned.
STATUS.pickup = [1, 36, 330];
const inFilter = (r, f) => f === 'all' || (STATUS[f] ? STATUS[f].includes(Number(r.statusId)) : r.category === f);

function statusCategory(id) {
  id = Number(id);
  for (const k of ['delivered', 'returned', 'cancelled', 'postponed']) if (STATUS[k].includes(id)) return k;
  return 'active';
}
const CATEGORY_LABEL = { active: 'قيد التشغيل', delivered: 'تم التسليم', returned: 'مرفوض / مرتجع', cancelled: 'ملغي', postponed: 'مؤجل' };

const Hazem = {
  creds: null,

  async request(path, { method = 'GET', form = null, formData = null, ajax = false } = {}) {
    const headers = {};
    let body;
    if (form) {
      const p = new URLSearchParams();
      for (const [k, v] of (Array.isArray(form) ? form : Object.entries(form))) p.append(k, v ?? '');
      body = p.toString();
      headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    } else if (formData) body = formData;
    if (ajax) headers['X-Requested-With'] = 'XMLHttpRequest';
    // Always fresh: a throw-away parameter defeats any HTTP cache on the phone or on the way.
    const url = HH_BASE + path + (method === 'GET' ? (path.includes('?') ? '&' : '?') + '_=' + Date.now() : '');
    headers['Cache-Control'] = 'no-cache';
    const res = await fetch(url, { method, headers, body, credentials: 'include', cache: 'no-store' });
    const text = await res.text();
    return { text, status: res.status, url: res.url };
  },

  isLoginPage: html => /id=["']login-form["']/.test(html),

  // GET/POST a page; if the session expired, log in again once and retry.
  async page(path, opts = {}) {
    let r = await this.request(path, opts);
    if (this.isLoginPage(r.text) && this.creds) {
      await this.login(this.creds.email, this.creds.password);
      r = await this.request(path, opts);
    }
    if (this.isLoginPage(r.text)) throw new Error('SESSION');
    return r.text;
  },

  async json(path, opts = {}) {
    const t = (await this.page(path, { ...opts, ajax: true })).replace(/^﻿/, '').trim();
    try { return JSON.parse(t); } catch { return null; }
  },

  async login(email, password) {
    const r = await this.request('login.php', {
      method: 'POST', ajax: true,
      form: { location: '', email, password, authorize: '1', ajax_login: '1' },
    });
    let data = null;
    try { data = JSON.parse(r.text.replace(/^﻿/, '').trim()); } catch {}
    if (!data) throw new Error('تعذر الاتصال بموقع الشحن');
    if (data.type === 'failed') throw new Error('رقم الموبايل أو كلمة المرور غير صحيحة');
    if (data.type === 'locked') throw new Error(data.message || 'الحساب مقفول مؤقتًا');
    if (data.type !== 'success') throw new Error('خطأ في تسجيل الدخول');
    // The site registers a device token after login (same as its web page does).
    try {
      const C = window.Capacitor?.Plugins?.CapacitorCookies;
      const cookies = C ? await C.getCookies({ url: HH_ORIGIN }) : {};
      const adminId = cookies.adminId || (document.cookie.match(/adminId=(\d+)/) || [])[1];
      let token = await Store.get('device_token');
      if (!token) { token = String(Date.now()) + Math.floor(Math.random() * 1e9); await Store.set('device_token', token); }
      if (adminId) await this.request('add_user_token.php', { method: 'POST', ajax: true, form: { adminId, token, device: 'android', location: '' } });
    } catch {}
    this.creds = { email, password };
    return true;
  },

  async logout() { try { await this.request('logout.php'); } catch {} this.creds = null; },

  // ---- Shipments list -------------------------------------------------
  filterQuery(f = {}) {
    const p = new URLSearchParams();
    const add = (k, v) => { if (v != null && String(v).trim() !== '') p.set(k, String(v).trim()); };
    add('waybill', f.waybill); add('order_id', f.order_id); add('phone', f.phone); add('consignee', f.consignee); add('product_name', f.product_name);
    if (f.status?.length) add('status', f.status.join(','));
    // Status-change date range (what happened in the period: delivered, returned, postponed...)
    if (f.sfrom) add('date_from_status', f.sfrom + ' 00:00');
    if (f.sto) add('date_to_status', f.sto + ' 23:59');
    if (f.from) add('date_from', f.from + ' 00:00');
    if (f.to) add('date_to', f.to + ' 23:59');
    add('items', f.items || 100);
    p.set('action', 'filter');
    return p.toString();
  },

  async shipments(f = {}) {
    const html = await this.page('shippings.php?' + this.filterQuery(f));
    return parseShipments(html);
  },

  // Search by waybill / phone / order number / name / product code, using the portal's own filters.
  // (The portal's quick search jumps straight to the shipment page for an exact waybill, so it
  // isn't a reliable list source; it's kept only as a last resort.)
  async search(q, by = 'auto') {
    q = clean(q).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    const digits = q.replace(/\D/g, '');
    const tries = [];
    // A specific field chosen by the user.
    if (by && by !== 'auto') {
      const v = by === 'phone' ? (digits.length >= 10 ? '0' + digits.slice(-10) : digits)
        : by === 'order_id' ? q.replace('#', '') : by === 'waybill' ? q.replace(/\s/g, '').toUpperCase() : q;
      return (await this.shipments({ [by]: v, items: 200 })).filter(r => by !== 'waybill' || r.waybill.includes(v) || !v);
    }
    if (/^[A-Za-z]{2,}\s?\d+/.test(q)) tries.push({ waybill: q.replace(/\s/g, '').toUpperCase() });
    else if (digits.length >= 10 && /^(?:\+?2)?0?1[0125]\d{8}$/.test(q.replace(/[\s-]/g, ''))) tries.push({ phone: '0' + digits.slice(-10) });
    else if (/^#?\d{1,8}$/.test(q)) tries.push({ order_id: digits }, { waybill: q.replace('#', '') }, { product_name: digits });
    else tries.push({ consignee: q }, { product_name: q }, { order_id: q });
    const seen = new Map();
    const lists = await Promise.all(tries.map(t => this.shipments({ ...t, items: 100 }).catch(() => [])));
    for (const r of lists.flat()) if (!seen.has(r.id)) seen.set(r.id, r);
    if (seen.size) return [...seen.values()];
    const html = await this.page('shippings.php?action=filter_search', { method: 'POST', form: { search: q } });
    const rows = parseShipments(html);
    if (rows.length) return rows;
    const one = parseShipmentPage(html);
    return one ? [one] : [];
  },

  async count(f = {}) {
    const q = this.filterQuery(f).replace(/(^|&)action=filter/, '');
    const r = await this.json('shippings.php?action=GetShippingsCountFilter&' + q + '&format=json');
    return { count: Number(r?.count || 0), total: Number(String(r?.all_price ?? 0).replace(/[^\d.-]/g, '')) || 0 };
  },

  // ---- Add shipment -----------------------------------------------------
  async addForm() {
    const html = await this.page('shippings.php?action=add_with_shipper');
    const doc = parseHTML(html);
    const form = doc.querySelector('#add_shipment_form');
    if (!form) throw new Error('لم يتم العثور على صفحة إضافة الشحنة');
    const sectors = $$('select[name="sector_id"] option', form).filter(o => o.value).map(o => {
      const label = clean(o.textContent);
      const parts = label.split(' - ');
      return { id: o.value, label, area: clean(parts[0]), gov: clean(parts[1] || ''), cost: o.dataset.delivery_cost || o.getAttribute('data-delivery_cost') || '' };
    }).filter(s => s.area);
    this._sectorCost = Object.fromEntries(sectors.map(s => [s.id, s.cost]));
    const services = $$('select[name="service_type"] option', form).filter(o => o.value).map(o => ({ id: o.value, label: clean(o.textContent) }));
    return { form: extractForm(form), sectors, services };
  },

  // values: {client_name, phone_1, phone_2, address, sector_id, price, product_name, product_desc,
  //          order_id, notes, weight, quantity, service_type}
  async addShipment(values, base) {
    base = base || (await this.addForm()).form;
    const fields = base.fields.filter(x => x.name && !['item_id[]', 'qty[]'].includes(x.name));
    const out = [];
    const seen = new Set();
    for (const fld of fields) {
      if (seen.has(fld.name) && !fld.name.endsWith('[]')) continue;
      seen.add(fld.name);
      let v = fld.name in values ? values[fld.name] : fld.value;
      if (fld.name === 'delivery_cost' && !values.delivery_cost) {
        v = (this._sectorCost || {})[values.sector_id] ?? fld.value;
      }
      out.push([fld.name, v ?? '']);
    }
    for (const [k, v] of Object.entries(values)) if (!seen.has(k)) out.push([k, v ?? '']);
    const html = await this.page(base.action || 'shippings.php?action=add_with_shipper', { method: 'POST', form: out });
    const err = pageAlert(html);
    if (err && /خطأ|error|مطلوب|يجب/i.test(err)) throw new Error(err);
    return html;
  },

  // ---- Edit shipment (generic) -------------------------------------------
  async editForm(id) {
    const html = await this.page(`shippings.php?action=edit&id=${encodeURIComponent(id)}`);
    const doc = parseHTML(html);
    const forms = $$('form', doc).filter(f => !/submit-lang|password-form|filter_search/.test(f.outerHTML.slice(0, 300)));
    const scored = forms.map(f => ({ f, n: $$('input[name],select[name],textarea[name]', f).filter(e => e.type !== 'hidden').length }))
      .sort((a, b) => b.n - a.n);
    // The shipment-details form (id "add-shipment"); the page also has a small status-change form
    // posting to the same URL, which must not be picked.
    const main = scored.find(x => x.f.id === 'add-shipment' || x.f.getAttribute('name') === 'adminForm')
      || scored.find(x => $$('[name="client_name"],[name="phone_1"]', x.f).length) || scored[0];
    if (!main || main.n < 2) throw new Error('صفحة تعديل الشحنة غير متاحة لهذه الشحنة');
    const form = extractForm(main.f);
    if (!main.f.getAttribute('action')) form.action = `shippings.php?action=edit&id=${encodeURIComponent(id)}`;
    return { ...form, history: parseHistory(doc) };
  },

  async submitForm(form, values) {
    const out = [];
    for (const f of form.fields) {
      if (!f.name || f.disabled || f.type === 'file' || f.type === 'submit' || f.type === 'button') continue;
      if ((f.type === 'checkbox' || f.type === 'radio')) {
        const on = f.name in values ? values[f.name] === f.value || values[f.name] === true : f.checked;
        if (on) out.push([f.name, f.value || 'on']);
        continue;
      }
      out.push([f.name, f.name in values ? values[f.name] : f.value]);
    }
    const html = await this.page(form.action, { method: 'POST', form: out });
    return { html, alert: pageAlert(html) };
  },

  // ---- Bulk delete (the portal's "حذف" action on selected shipments) -------
  async deleteShipments(ids) {
    const form = [['options', 'delete'], ...ids.map(id => ['shipping_id[]', id])];
    const html = await this.page('shippings.php?action=filter&items=50', { method: 'POST', form });
    return { alert: pageAlert(html) };
  },

  // ---- Balance (financial operations per waybill) -----------------------
  // f: {waybill, waybills:[], order_id, from, to, items}
  async balance(f = {}) {
    const p = new URLSearchParams({ action: 'items' });
    if (f.waybill) p.set('waybill', f.waybill);
    if (f.order_id) p.set('order_id', f.order_id);
    if (f.from) p.set('from', f.from);
    if (f.to) p.set('to', f.to);
    if (f.waybills?.length) p.set('checkShipments', f.waybills.join(','));
    p.set('items', f.items || 500);
    return parseBalance(await this.page('balance.php?' + p.toString()));
  },

  // Return-fee operations for many waybills at once -> {waybill: op}
  async returnFees(waybills) {
    const out = {};
    for (const op of await this.opsFor(waybills)) if (op.isReturn && op.waybill) out[op.waybill] = op;
    return out;
  },
  // Every balance operation recorded for the given waybills.
  async opsFor(waybills) {
    const out = [];
    for (let i = 0; i < waybills.length; i += 80) {
      const r = await this.balance({ waybills: waybills.slice(i, i + 80), items: 1000 });
      out.push(...r.ops);
    }
    return out;
  },

  // ---- Excel upload ------------------------------------------------------
  async uploadExcel(file) {
    const page = await this.page('excel_upload.php');
    const doc = parseHTML(page);
    const userId = doc.querySelector('#upload_form input[name="user_id"]')?.value || '';
    const fd = new FormData();
    fd.append('implodExcal', 'show');
    fd.append('user_id', userId);
    fd.append('excal', file, file.name);
    const html = await this.page('shippings.php', { method: 'POST', formData: fd });
    const res = parseHTML(html);
    return { alert: pageAlert(html), rows: parseSimpleTable(res), html };
  },
};

// ---------- Parsers --------------------------------------------------------
const num = v => Number(String(v ?? '').replace(/[^\d.-]/g, '')) || 0;

function parseBalance(html) {
  const doc = parseHTML(html);
  const summary = {};
  const head = $$('h4', doc).map(h => clean(h.textContent)).find(t => /^الرصيد\s*:/.test(t));
  if (head) summary['الرصيد'] = num(head.split(':')[1]);
  for (const d of $$('.row.big > div', doc)) {
    const t = clean(d.textContent); const i = t.indexOf(':'); if (i < 0) continue;
    const k = clean(t.slice(0, i)), v = clean(t.slice(i + 1));
    if (v.includes('/')) { const [c, a] = v.split('/'); summary[k] = { count: num(c), amount: num(a) }; }
    else summary[k] = num(v);
  }
  const table = $$('table', doc).find(t => { const h = clean(t.querySelector('tr')?.textContent); return h.includes('نوع العملية') && h.includes('رقم البوليصة'); });
  let ops = [];
  if (table) {
    const heads = $$('th', table).map(th => clean(th.textContent));
    const ix = n => heads.indexOf(n);
    const c = { id: ix('رقم'), type: ix('نوع العملية'), waybill: ix('رقم البوليصة'), order: ix('رقم الطلب'), area: ix('المنطقة'), fee: ix('تكلفة الشحن'), value: ix('قيمة'), confirm: ix('التأكيد'), notes: ix('الملاحظات'), date: ix('تاريخ الأضافة'), from: ix('من') };
    ops = $$('tr', table).map(tr => $$(':scope > td', tr)).filter(td => td.length > 10).map(td => {
      const g = k => c[k] >= 0 ? clean(td[c[k]]?.textContent) : '';
      const type = g('type'), fee = num(g('fee')), value = num(g('value'));
      const isReturn = /ارتجاع|مرتجع/.test(type);
      return { id: g('id'), type, waybill: g('waybill'), order_id: g('order'), area: g('area'), fee, value, confirm: g('confirm'), notes: g('notes'), date: g('date'), from: g('from'),
        isReturn, isPayout: !g('waybill') && /كاش|دفع|تحويل|توريد/.test(type),
        // For a return operation, "value" is the shipping the customer actually paid.
        paid: isReturn ? value : null, short: isReturn ? Math.max(0, fee - value) : 0 };
    });
  }
  // Newest first, whatever order the portal used.
  ops.sort((a, b) => dtVal(b.date) - dtVal(a.date));
  return { summary, ops };
}
// "2026-11-07 01:33 PM" -> sortable number
function dtVal(s) {
  const m = String(s || '').match(/(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{1,2}):(\d{2})\s*(AM|PM)?)?/i);
  if (!m) return 0;
  let h = Number(m[4] || 0); if (m[6]) { h %= 12; if (/PM/i.test(m[6])) h += 12; }
  return new Date(+m[1], +m[2] - 1, +m[3], h, Number(m[5] || 0)).getTime();
}

// A single shipment's edit page (where the portal's quick search lands) -> list row.
function parseShipmentPage(html) {
  const doc = parseHTML(html);
  const form = doc.querySelector('#add-shipment');
  if (!form) return null;
  const v = n => clean(form.querySelector(`[name="${n}"]`)?.value ?? form.querySelector(`[name="${n}"]`)?.textContent ?? '');
  const id = (html.match(/action=edit&(?:amp;)?id=(\d+)/) || [])[1];
  const waybill = (clean(doc.body.textContent).match(/\b[A-Z]{2,5}\d{5,}(?:-[A-Z])?\b/) || [])[0] || '';
  if (!id) return null;
  const hist = parseHistory(doc);
  const status = clean(v('status')) || (hist[0]?.status || '').replace(/^\d+\s*-\s*/, '');
  const statusId = Number(((hist[0]?.status || '').match(/^(\d+)/) || [])[1] || 0);
  const sector = form.querySelector('[name="sector_id"] option[selected]');
  return { id, waybill, statusId, category: statusCategory(statusId), status, statusColor: '', date: hist[hist.length - 1]?.date || '',
    consignee: v('client_name'), address: v('address'), product: v('product_name'), client_code: v('client_id'), order_id: v('order_id'),
    notes: v('notes'), area: sector ? clean(sector.textContent).split(' - ')[0] : '', cod: v('price'), phone1: v('phone_1'), phone2: v('phone_2') === '0' ? '' : v('phone_2'),
    service: '', last_change: hist[0]?.date || '', postponed: '', calls: '', branch: '' };
}

// Latest failure reason / courier note from a shipment's status history.
function failureInfo(history) {
  const bad = x => !x || /^[-_—\s]+$/.test(x);
  const withReason = history.find(h => !bad(h.reason));
  const withNote = history.find(h => !bad(h.note));
  // Who recorded the failure (or the latest status) — normally the courier.
  const by = (withReason || history[0])?.by || '';
  // The latest status row (newest first) — its own reason/note/postponed date describe what happened last.
  const last = history[0] || {};
  return { reason: withReason?.reason || '', reasonStatus: withReason?.status || '', reasonDate: withReason?.date || '', note: withNote?.note || '', by,
    lastStatus: (last.status || '').replace(/^\d+\s*-\s*/, ''), lastDate: last.date || '', lastBy: last.by || '',
    lastReason: !bad(last.reason) ? last.reason : '', lastNote: !bad(last.note) ? last.note : '',
    postponedTo: (history.find(h => !bad(h.postponed)) || {}).postponed || '' };
}
function pageAlert(html) {
  const doc = typeof html === 'string' ? parseHTML(html) : html;
  const el = doc.querySelector('.alert-danger, .alert-success, .alert-warning, .alert-info, .note-danger, .note-success');
  const txt = el ? clean(el.textContent) : '';
  const sw = (typeof html === 'string' ? html : '').match(/swal\.fire\([^)]*?(?:title|text)\s*:\s*['"]([^'"]{3,200})['"]/i)
    || (typeof html === 'string' ? html : '').match(/alert\(['"]([^'"]{3,200})['"]\)/);
  return txt || (sw ? sw[1] : '');
}

function parseShipments(html) {
  const doc = parseHTML(html);
  const table = $$('table', doc).find(t => {
    const h = t.querySelector('thead, tr')?.textContent || '';
    return h.includes('رقم البوليصة') && h.includes('حالة الشحنة');
  });
  if (!table) return [];
  const heads = $$('th', table).map(th => clean(th.textContent));
  const idx = name => heads.indexOf(name);
  const col = {
    waybill: idx('رقم البوليصة'), date: idx('التاريخ'), consignee: idx('المرسل اليه'), address: idx('العنوان'),
    product: idx('اسم المنتج'), client_code: idx('كود العميل'), order_id: idx('رقم الطلب'), notes: idx('الملاحظات'),
    area: idx('المنطقة'), cod: idx('مبلغ التحصيل'), phone1: idx('موبايل 1'), phone2: idx('موبايل 2'),
    status: idx('حالة الشحنة'), service: idx('نوع الخدمة'), last_change: idx('اخر تغيير بالحالة'), postponed: idx('موعد التأجيل'),
    calls: idx('عدد مرات الاتصال'), branch: idx('فرع'),
  };
  return $$('tr', table).filter(tr => tr.querySelector('input.check-ids, input[name="shipping_id[]"]')).map(tr => {
    const tds = $$(':scope > td', tr);
    const cb = tr.querySelector('input.check-ids, input[name="shipping_id[]"]');
    const cell = k => (col[k] >= 0 && tds[col[k]]) ? tds[col[k]] : null;
    const txt = k => {
      const c = cell(k); if (!c) return '';
      const p = c.querySelector('.show-print'); const a = c.querySelector('a');
      return clean((a || p || c).textContent);
    };
    const st = cell('status');
    const stP = st?.querySelector('p, span') || st;
    const color = (stP?.getAttribute('style') || '').match(/background-color:\s*([^;]+)/)?.[1] || '';
    const statusId = Number(cb.dataset.status_id || cb.getAttribute('data-status_id') || 0);
    return {
      id: cb.value,
      // The merchant may delete a shipment until the courier has collected it.
      // (The portal renders every checkbox disabled and enables them all by script, so that attribute means nothing.)
      canDelete: STATUS.pickup.includes(Number(cb.dataset.status_id || cb.getAttribute('data-status_id') || 0)),
      waybill: clean(cb.dataset.waybill || cb.getAttribute('data-waybill') || txt('waybill')),
      statusId, category: statusCategory(statusId),
      status: clean(stP?.textContent), statusColor: color.trim(),
      date: txt('date'), consignee: txt('consignee'), address: txt('address'), product: txt('product'),
      client_code: txt('client_code'), order_id: txt('order_id'), notes: txt('notes'), area: txt('area'),
      cod: txt('cod'), phone1: txt('phone1') || clean(cb.dataset.phone), phone2: txt('phone2'),
      service: txt('service'), last_change: txt('last_change'), postponed: txt('postponed'), calls: txt('calls'),
      branch: txt('branch'),
    };
  });
}

function parseSimpleTable(doc) {
  const t = $$('table', doc).find(t => $$('th', t).some(th => clean(th.textContent) === 'رقم البوليصة'));
  if (!t) return [];
  const heads = $$('th', t).map(th => clean(th.textContent));
  return $$('tbody tr', t).map(tr => {
    const tds = $$('td', tr); if (tds.length < 2) return null;
    const o = {}; heads.forEach((h, i) => { if (h && tds[i]) o[h] = clean(tds[i].textContent); }); return o;
  }).filter(Boolean);
}

function parseHistory(doc) {
  const t = $$('table', doc).find(t => { const h = clean(t.querySelector('tr')?.textContent); return h.includes('حالة الشحنة') && h.includes('تاريخ الحالة'); });
  if (!t) return [];
  const heads = $$('th', t).map(th => clean(th.textContent));
  const iS = heads.indexOf('حالة الشحنة'), iD = heads.indexOf('تاريخ الحالة'), iR = heads.indexOf('سبب فشل التسليم'), iN = heads.indexOf('الملاحظات'), iA = heads.indexOf('الأدمن'), iP = heads.indexOf('موعد التأجيل');
  return $$('tbody tr', t).map(tr => { const td = $$('td', tr); return { status: clean(td[iS]?.textContent), date: clean(td[iD]?.textContent), reason: clean(td[iR]?.textContent), note: clean(td[iN]?.textContent), by: iA >= 0 ? clean(td[iA]?.textContent) : '', postponed: iP >= 0 ? clean(td[iP]?.textContent) : '' }; })
    .filter(r => r.status);
}

// Turn any HTML <form> into a plain description we can re-render natively.
function extractForm(form) {
  const action = (form.getAttribute('action') || '').replace(/^https?:\/\/[^/]+\/admin-area\//, '').replace(/&amp;/g, '&');
  const fields = $$('input, select, textarea', form).map(el => {
    const tag = el.tagName.toLowerCase();
    const type = tag === 'input' ? (el.getAttribute('type') || 'text').toLowerCase() : tag;
    const f = { tag, type, name: el.getAttribute('name') || '', id: el.id || '', disabled: el.hasAttribute('disabled'), readonly: el.hasAttribute('readonly'), required: el.hasAttribute('required') };
    if (tag === 'select') {
      f.options = $$('option', el).map(o => ({ value: o.getAttribute('value') ?? clean(o.textContent), label: clean(o.textContent) }));
      const sel = $$('option', el).find(o => o.hasAttribute('selected'));
      f.value = sel ? (sel.getAttribute('value') ?? clean(sel.textContent)) : (f.options[0]?.value ?? '');
      f.multiple = el.hasAttribute('multiple');
    } else if (tag === 'textarea') f.value = el.textContent;
    else { f.value = el.getAttribute('value') ?? ''; f.checked = el.hasAttribute('checked'); }
    f.label = fieldLabel(el) || el.getAttribute('placeholder') || '';
    return f;
  });
  return { action: action || 'shippings.php', method: (form.getAttribute('method') || 'post').toLowerCase(), fields };
}

function fieldLabel(el) {
  if (el.id) {
    const l = el.ownerDocument.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    if (l) return clean(l.textContent);
  }
  let n = el.parentElement;
  for (let i = 0; i < 4 && n; i++, n = n.parentElement) {
    const labels = $$('label', n).filter(l => !l.contains(el));
    if (labels.length === 1 || (labels.length && $$('input,select,textarea', n).filter(x => x.type !== 'hidden').length === 1))
      return clean(labels[labels.length - 1].textContent).replace(/\*$/, '').trim();
    if (labels.length > 1) break;
  }
  return '';
}
