// UI for "شحناتي" — Hazem Halan merchant app with Shopify integration.
const ICON = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  whatsapp: '<path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  logout: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h11"/>',
  sync: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M20 4v5h-5M4 20v-5h5"/>',
  truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  chev: '<path d="m9 6 6 6-6 6"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  wallet: '<path d="M4 7h15a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M4 7V6a2 2 0 0 1 2-2h11v3"/><path d="M15 13.5h2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
};
const ic = (n, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${ICON[n]}</svg>`;

const BADGE = { active: 'info', delivered: 'success', returned: 'critical', cancelled: '', postponed: 'warning' };
const CAT_COLOR = { active: '#4b8fd6', delivered: '#29845a', returned: '#d72c0d', postponed: '#e0a800', cancelled: '#b5b5b5' };

const state = {
  tab: 'home', period: '30', shipFilter: 'all', shipments: [], shipQuery: '',
  shopTab: 'confirm', orders: [], selected: new Set(), overrides: {}, sectors: null, addBase: null,
  sentMap: {}, sent: [], shopCount: null,
};

// ---------- Boot ----------
(async function boot() {
  await Sync.init();
  state.sentMap = await Store.get('sent_map', {});
  state.overrides = await Store.get('overrides', {});
  await Shopify.load();
  const creds = await Store.get('creds');
  if (!creds) return renderLogin();
  Hazem.creds = creds;
  renderShell();
  askNotifyPermission();
})();

// ---------- Login ----------
function renderLogin(err = '') {
  $('#app').innerHTML = `
  <div class="login">
    <div class="brand"><div class="logo">${ic('truck')}</div><div><h1>شحناتي</h1><div class="muted small">متابعة شحنات حازم حلان وربطها بمتجرك</div></div></div>
    <div class="card card-pad">
      ${err ? `<div class="banner critical">${ic('alert', 'width="18"')}<div>${esc(err)}</div></div>` : ''}
      <form id="loginForm">
        <div class="field"><label>رقم الموبايل أو البريد الإلكتروني</label><input name="email" inputmode="tel" autocomplete="username" required class="ltr" style="text-align:right"></div>
        <div class="field"><label>كلمة المرور</label><input name="password" type="password" autocomplete="current-password" required></div>
        <button class="btn primary block" id="loginBtn">تسجيل الدخول</button>
      </form>
    </div>
    <p class="tiny" style="text-align:center">نفس بيانات الدخول على موقع hazem-halan.com — بتتحفظ على موبايلك بس.</p>
  </div>`;
  $('#loginForm').onsubmit = async e => {
    e.preventDefault();
    const fd = new FormData(e.target), btn = $('#loginBtn');
    btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
    try {
      await Hazem.login(clean(fd.get('email')), fd.get('password'));
      await Store.set('creds', Hazem.creds);
      renderShell();
      askNotifyPermission();
    } catch (er) { renderLogin(er.message); }
  };
}

// ---------- Shell ----------
const TABS = [['home', 'الرئيسية', 'home'], ['ships', 'الشحنات', 'box'], ['shop', 'الأوردرات', 'bag'], ['money', 'الحسابات', 'wallet'], ['more', 'المزيد', 'more']];
function renderShell() {
  $('#app').innerHTML = `
    <header class="topbar"><h1 id="title"></h1><div id="topActions" class="row"></div><button class="icon-btn bell" id="bellBtn" aria-label="التنبيهات">${ic('bell')}<b id="bellDot" class="bell-dot" hidden></b></button></header>
    <main class="view" id="view"></main>
    <nav class="tabbar">${TABS.map(([k, l, i]) => `<button data-tab="${k}">${ic(i)}<span>${l}</span>${k === 'shop' ? '<b class="dot" id="shopDot" hidden></b>' : ''}</button>`).join('')}</nav>`;
  $$('.tabbar button').forEach(b => b.onclick = () => go(b.dataset.tab));
  $('#bellBtn').onclick = openAlertCenter;
  setTimeout(checkOpenAlerts, 300);
  go(state.tab);
}
function go(tab) {
  state.tab = tab;
  state.selMode = false; state.sel = new Set(); $('#selBar')?.remove();
  state.opSel = null; $('#opBar')?.remove();
  $$('.tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  $('#topActions').innerHTML = ''; window.scrollTo(0, 0);
  ({ home: viewHome, ships: viewShipments, shop: viewShop, money: viewMoney, more: viewMore })[tab]();
}
function setTitle(t, actions = []) {
  $('#title').textContent = t;
  const box = $('#topActions'); box.innerHTML = '';
  for (const [icon, fn] of actions) { const b = document.createElement('button'); b.className = 'icon-btn'; b.innerHTML = ic(icon); b.onclick = fn; box.appendChild(b); }
}
function handleErr(e) {
  console.error(e);
  if (e.message === 'SESSION') { toast('انتهت الجلسة، سجّل دخول تاني', 'err'); Store.del('creds'); return renderLogin(); }
  toast(/Failed to fetch|Network|timeout/i.test(e.message) ? 'مفيش اتصال بالإنترنت' : e.message, 'err');
}
const loading = () => '<div class="spinner"></div>';

// ---------- Home ----------
function periodRange(p) {
  const to = new Date(), from = new Date();
  if (p === 'today') return { from: ymd(to), to: ymd(to) };
  from.setDate(from.getDate() - (Number(p) - 1));
  return { from: ymd(from), to: ymd(to) };
}
async function viewHome() {
  setTitle('الرئيسية');
  const v = $('#view');
  v.innerHTML = `
    <div class="chips">${[['today', 'اليوم'], ['7', 'آخر 7 أيام'], ['30', 'آخر 30 يوم'], ['90', 'آخر 3 شهور']].map(([k, l]) => `<button class="chip ${state.period === k ? 'on' : ''}" data-p="${k}">${l}</button>`).join('')}</div>
    <div class="tiny" id="updatedAt" style="margin:-4px 4px 8px">بيحدّث من موقع حازم…</div>
    <div id="shopCard"></div>
    <div class="stats" id="stats">${['', '', '', '', ''].map((_, i) => `<div class="stat ${i === 0 ? 'wide' : ''}"><div class="skeleton" style="width:60%"></div><div class="skeleton" style="width:40%;height:22px;margin-top:8px"></div></div>`).join('')}</div>
    <div id="postCard"></div>
    <div id="payAlerts"></div>
    <div class="section-title">المرتجعات والرفض</div>
    <div class="card card-pad" id="retCard"><div class="skeleton" style="width:70%"></div><div class="skeleton" style="width:50%;margin-top:8px"></div></div>
    <div class="section-title">إجراءات سريعة</div>
    <div class="card card-pad"><div class="actions">
      <button class="action" data-a="add">${ic('plus')}شحنة جديدة</button>
      <button class="action" data-a="upload">${ic('upload')}رفع إكسيل</button>
      <button class="action" data-a="export">${ic('download')}تنزيل إكسيل</button>
      <button class="action" data-a="wao">${ic('whatsapp')}أوردر واتساب</button>
    </div></div>
    <div class="section-title">آخر التحديثات</div>
    <div id="recent">${loading()}</div>`;
  $$('.chip', v).forEach(c => c.onclick = () => { state.period = c.dataset.p; viewHome(); });
  $$('.action', v).forEach(a => a.onclick = () => ({ add: () => openAdd(), upload: openUpload, export: () => { go('ships'); }, shop: () => go('shop'), wao: openWaOrders })[a.dataset.a]());
  loadShopBadge();
  const range = periodRange(state.period);
  try {
    const cats = ['active', 'delivered', 'returned', 'postponed'];
    // What happened in the period = shipments whose status changed in it (not when they were created).
    const sr = { sfrom: range.from, sto: range.to };
    const [all, created, ...res] = await Promise.all([Hazem.count(sr), Hazem.count({ ...range }), ...cats.map(c => Hazem.count({ ...sr, status: STATUS[c] }))]);
    const c = Object.fromEntries(cats.map((k, i) => [k, res[i]]));
    const closed = c.delivered.count + c.returned.count;
    const rate = closed ? Math.round(c.delivered.count / closed * 100) : 0;
    const now = new Date();
    $('#updatedAt') && ($('#updatedAt').textContent = `آخر تحديث من موقع حازم: ${pad(now.getHours() % 12 || 12)}:${pad(now.getMinutes())} ${now.getHours() < 12 ? 'ص' : 'م'}`);
    $('#stats').innerHTML = `
      <div class="stat wide" style="display:block">
        <div class="row between"><div><div class="lbl">شحنات اتحدّثت حالتها</div><div class="num">${all.count.toLocaleString('en')}</div><div class="sub">اتعمل في الفترة: ${created.count.toLocaleString('en')} شحنة جديدة</div></div>
        <div style="text-align:left"><div class="lbl" style="justify-content:flex-end">نسبة التسليم</div><div class="num" style="color:${CAT_COLOR.delivered}">${rate}%</div></div></div>
        <div class="rate-bar">${cats.map(k => `<span style="width:${all.count ? c[k].count / all.count * 100 : 0}%;background:${CAT_COLOR[k]}"></span>`).join('')}</div>
      </div>
      ${cats.map(k => `<button class="stat" data-cat="${k}"><div class="lbl"><i style="background:${CAT_COLOR[k]}"></i>${CATEGORY_LABEL[k]}</div><div class="num">${c[k].count.toLocaleString('en')}</div><div class="sub">${money(c[k].total)} ج.م</div></button>`).join('')}`;
    $$('#stats [data-cat]').forEach(b => b.onclick = () => { state.shipFilter = b.dataset.cat; go('ships'); });
  } catch (e) { $('#stats').innerHTML = ''; handleErr(e); }
  loadReturnsCard(range);
  loadPostponedCard();
  loadPayAlerts();
  try {
    const rows = await Hazem.shipments({ items: 20 });
    rows.sort((a, b) => (b.last_change || '').localeCompare(a.last_change || ''));
    $('#recent').innerHTML = shipList(rows.slice(0, 8));
    bindShipList($('#recent'), rows);
  } catch (e) { $('#recent').innerHTML = ''; }
}
// ---------- Under-payment alerts ----------
const LN = () => window.Capacitor?.Plugins?.LocalNotifications;
async function askNotifyPermission() {
  try { const p = await LN()?.checkPermissions(); if (p && p.display !== 'granted') await LN().requestPermissions(); } catch {}
}
// Expected amount per waybill: the Shopify order total we sent, else the shipment's COD.
function expectedMap(rows) {
  const m = {};
  for (const r of rows) if (r.waybill) m[r.waybill] = num(r.cod);
  for (const v of Object.values(state.sentMap || {})) if (v.waybill && v.price) m[v.waybill] = num(v.price);
  return m;
}
function underPayments(ops, expected) {
  const out = [];
  for (const o of ops) {
    if (!o.waybill) continue;
    if (o.isReturn) { if (o.paid < o.fee) out.push({ op: o, kind: 'ship', short: o.fee - o.paid, text: o.paid <= 0 ? `مرتجع ومدفعش شحن (${money(o.fee)} ج.م)` : `دفع شحن ${money(o.paid)} من ${money(o.fee)} · ناقص ${money(o.fee - o.paid)}` }); continue; }
    const exp = expected[o.waybill];
    if (!o.isPayout && o.fee > 0 && o.value > 0 && o.value < o.fee) out.push({ op: o, kind: 'ship', short: o.fee - o.value, text: `${esc(o.type)} · اتحصّل ${money(o.value)} والشحن ${money(o.fee)} · ناقص ${money(o.fee - o.value)}` });
    else if (exp && o.value + 0.5 < exp) out.push({ op: o, kind: 'total', short: exp - o.value, text: `اتحصّل ${money(o.value)} بدل ${money(exp)} · ناقص ${money(exp - o.value)}` });
    else if (/جزئي/.test(o.type)) out.push({ op: o, kind: 'partial', short: 0, text: `تسليم جزئي · اتحصّل ${money(o.value)}` });
  }
  return out;
}
async function loadPayAlerts() {
  const box = $('#payAlerts'); if (!box) return;
  if (!(await notifyPrefs()).underpay) return;
  try {
    const from = new Date(); from.setDate(from.getDate() - 60);
    const [bal, rows] = await Promise.all([Hazem.balance({ items: 300 }), Hazem.shipments({ items: 1000, from: ymd(from), to: ymd(new Date()) })]);
    const list = underPayments(bal.ops, expectedMap(rows));
    // Sound + notification for ones not announced yet (shared with the background checker).
    const seenArr = await Store.get('pay_seen', null);
    const seen = new Set(seenArr || []);
    const fresh = seenArr ? list.filter(a => a.op.id && !seen.has(a.op.id)) : [];
    bal.ops.forEach(o => o.id && seen.add(o.id));
    await Store.set('pay_seen', [...seen]);
    if (fresh.length) {
      try { await LN()?.schedule({ notifications: fresh.slice(0, 10).map((a, i) => ({ id: Date.now() % 100000 + i, title: '⚠️ دفع أقل — ' + a.op.waybill, body: a.text, channelId: 'payment_alerts' })) }); } catch {}
      try { navigator.vibrate?.([0, 400, 250, 400]); } catch {}
    }
    if (!list.length || !$('#payAlerts')) return;
    const recent = list.slice(0, 6);
    $('#payAlerts').innerHTML = `
      <div class="section-title">⚠️ تنبيهات الدفع</div>
      <div class="card alert-card"><div class="card-pad row between"><b>${list.length} عملية العميل دفع فيها أقل</b><span class="badge canary">ناقص ${money(list.reduce((a, x) => a + x.short, 0))} ج.م</span></div>
      <div class="list" style="box-shadow:none;margin:0">${recent.map((a, i) => `<button class="item ${a.kind === 'ship' && a.op.paid > 0 ? 'canary-row' : ''}" data-pa="${i}"><div class="grow"><div class="row between"><span class="title ltr">${esc(a.op.waybill)}</span><span class="tiny">${esc(a.op.date)}</span></div><div class="small" style="font-weight:600;color:${a.kind === 'ship' && a.op.paid <= 0 ? 'var(--critical)' : 'var(--warning)'}">${esc(a.text)}</div></div></button>`).join('')}</div>
      ${list.length > recent.length ? `<button class="btn sm" style="margin:10px" id="allPay">عرض الكل في الحسابات</button>` : ''}</div>`;
    $$('#payAlerts [data-pa]').forEach(b => b.onclick = async () => { const o = recent[b.dataset.pa].op; try { const r = (await Hazem.search(o.waybill)).find(x => x.waybill === o.waybill); if (r) openShipment(r); } catch (e) { handleErr(e); } });
    if ($('#allPay')) $('#allPay').onclick = () => { state.moneyFilter = 'short'; go('money'); };
  } catch {}
}

// Shipments postponed / not answered today, with the courier's reason.
async function loadPostponedCard() {
  const box = $('#postCard'); if (!box) return;
  try {
    const today = ymd(new Date());
    const rows = await Hazem.shipments({ sfrom: today, sto: today, status: NEEDS_REASON, items: 200 });
    const list = rows.filter(isPostponed);
    if (!list.length || !$('#postCard')) return;
    box.innerHTML = `<div class="section-title">📅 اتأجلت / مردّتش النهارده (${list.length})</div><div class="list" id="postList">${list.slice(0, 8).map((s, i) => `
      <button class="item" data-pi="${i}"><div class="grow">
        <div class="row between"><span class="title ellipsis">${esc(s.consignee)}</span><span class="badge warning">${esc(s.status)}</span></div>
        <div class="meta row between"><span class="ltr">${esc(s.waybill)}</span><span>${esc(s.area)}</span></div>
        <div class="fail-line" data-x="${esc(s.id)}"></div>
      </div></button>`).join('')}</div>`;
    $$('#postList [data-pi]').forEach(b => b.onclick = () => openShipment(list[b.dataset.pi]));
    const put = (id, html) => { const el = box.querySelector(`.fail-line[data-x="${CSS.escape(id)}"]`); if (el) el.innerHTML += html; };
    await pool(list.slice(0, 8), 3, async s => {
      const r = await reasonFor(s);
      const why = r.lastReason || r.lastNote || r.reason || r.note;
      put(s.id, why ? `<div class="reason postpone">📅 ${esc(why)}</div>` : '<div class="tiny">مش مكتوب سبب</div>');
      if (r.postponedTo && !/^[-_—\s]+$/.test(r.postponedTo)) put(s.id, `<div class="tiny">موعد جديد: ${esc(r.postponedTo)}</div>`);
    });
  } catch {}
}
async function loadReturnsCard(range) {
  const card = $('#retCard'); if (!card) return;
  try {
    const [bal, rows] = await Promise.all([Hazem.balance({ ...range, items: 1000 }), Hazem.shipments({ ...range, status: STATUS.returned.concat([13]), items: 250 })]);
    const rets = bal.ops.filter(o => o.isReturn);
    const fee = rets.reduce((a, o) => a + o.fee, 0), paid = rets.reduce((a, o) => a + o.paid, 0);
    const short = rets.filter(o => o.paid > 0 && o.paid < o.fee).length, none = rets.filter(o => o.paid <= 0).length;
    const failed = rows.filter(isFailed);
    card.innerHTML = `
      <div class="row between"><div><div class="lbl small muted">مرتجعات في الفترة</div><div class="num" style="font-size:22px;font-weight:700">${rets.length}</div></div>
      <div style="text-align:left"><div class="small muted">شحن اتدفع / المفروض</div><div style="font-weight:700">${money(paid)} / ${money(fee)} ج.م</div></div></div>
      <div class="row wrap" style="gap:6px;margin-top:8px">${short ? `<span class="badge canary">${short} دفعوا أقل من الشحن</span>` : ''}${none ? `<span class="badge critical">${none} مدفعوش شحن</span>` : ''}${fee - paid > 0 ? `<span class="badge">خسارة شحن ${money(fee - paid)} ج.م</span>` : ''}</div>
      <div id="topReasons" style="margin-top:10px"><div class="tiny">بحمّل أسباب الرفض…</div></div>`;
    card.onclick = () => { state.shipFilter = 'returned'; state.shipRange = range; go('ships'); };
    const counts = {};
    await pool(failed.slice(0, 40), 3, async s => { const r = await reasonFor(s); const k = r.reason || 'بدون سبب مكتوب'; counts[k] = (counts[k] || 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const el = $('#topReasons'); if (!el) return;
    const max = top[0]?.[1] || 1;
    el.innerHTML = top.length ? `<div class="small" style="font-weight:700;margin-bottom:6px">أكتر أسباب الرفض</div>` + top.map(([k, n]) => `<div class="reason-bar"><span class="grow ellipsis">${esc(k)}</span><b>${n}</b><i style="width:${n / max * 100}%"></i></div>`).join('') : '<div class="tiny">مفيش رفض في الفترة دي 🎉</div>';
  } catch (e) { card.innerHTML = '<div class="small muted">تعذر تحميل المرتجعات</div>'; }
}
async function loadShopBadge() {
  if (!Shopify.ready) {
    $('#shopCard') && ($('#shopCard').innerHTML = `<button class="banner info" style="width:100%;border:0;text-align:start" onclick="openShopSettings()">${ic('bag', 'width="20"')}<div class="grow"><b>اربط متجر شوبيفاي</b><div class="small">عشان أوردرات المتجر تتحول لشحنات بضغطة واحدة</div></div></button>`);
    return;
  }
  try {
    const n = (await Shopify.toShip()).length;
    state.shopCount = n;
    const dot = $('#shopDot'); if (dot) { dot.hidden = !n; dot.textContent = n; }
    if ($('#shopCard') && n) $('#shopCard').innerHTML = `<button class="banner warning" style="width:100%;border:0;text-align:start" onclick="go('shop')">${ic('bag', 'width="20"')}<div class="grow"><b>${n} أوردر جديد على المتجر مستني الشحن</b><div class="small">راجعهم وابعتهم لحازم حلان</div></div>${ic('chev', 'class="chev"')}</button>`;
  } catch {}
}

// ---------- WhatsApp ----------
// Each template holds several versions separated by a line "---"; one is picked at random
// each time, and [a|b|c] picks a random word, so no two messages are identical
// (reduces the risk of WhatsApp flagging the number for spam).
const WA_DEFAULTS = {
  confirm: { name: 'تأكيد الأوردر', text: [
    '[أهلاً|أهلاً وسهلاً|مساء الخير|يا هلا] يا {الاسم} [👋|🌸|😊]\nمعاك [فريق|خدمة عملاء] {المتجر}، [بنأكد مع حضرتك|حابين نأكد مع حضرتك] [أوردر|طلب] رقم {رقم_الأوردر}:\n{المنتجات}\n💰 الإجمالي: {المبلغ} ج.م [الدفع عند الاستلام|كاش عند الاستلام]\n📍 العنوان: {العنوان}\n\n[لو كله تمام|لو البيانات مظبوطة] [ابعتلنا|رد علينا بـ] *تمام* ✅ [عشان نشحنه فورًا|ونشحنهولك على طول] [🙏|❤️]',
    '[مرحباً|أهلاً] {الاسم} [🌷|✨|😊]\n[شكراً على طلبك من|نورتنا في] {المتجر}!\n[قبل ما نشحن|عشان نجهز الشحنة] [محتاجين نأكد|بنراجع] مع حضرتك:\n🛍️ {المنتجات}\n💵 المبلغ: {المبلغ} ج.م (عند الاستلام)\n🏠 {العنوان}\n\n[تمام كده؟|البيانات صح؟] [رد بـ|ابعت] *تمام* [ولو فيه تعديل قولنا|ولو حابب تغيّر حاجة عرفنا] [🙏|💐]',
    '[صباح الفل|يا مساء الورد|أهلاً] يا {الاسم} [☀️|🌸|👋]\n[طلبك|أوردرك] رقم {رقم_الأوردر} من {المتجر} [وصلنا|اتسجل عندنا] [وجاهز للتجهيز|ومستني تأكيدك] 📦\n{المنتجات}\nالإجمالي {المبلغ} ج.م [بتدفعهم للمندوب|عند الاستلام]\n[العنوان|التوصيل على]: {العنوان}\n\n[ممكن تأكدلنا|محتاجين تأكيد بسيط] [بكلمة|برد] *تمام* [عشان نبعته النهارده|ونشحنه على طول]؟ [شكراً ليك|متشكرين جداً] [❤️|🙏]',
  ].join('\n---\n') },
  shipped: { name: 'تم الشحن', text: [
    '[أهلاً|أهلاً وسهلاً] {الاسم} [🚚|📦]\n[أوردرك|طلبك] رقم {رقم_الأوردر} [اتشحن|خرج للشحن] [النهارده|خلاص] ✅\nرقم البوليصة: {البوليصة}\n[المندوب هيكلم حضرتك|هيتواصل معاك المندوب] قبل التوصيل، والمبلغ المطلوب {المبلغ} ج.م.\n[شكراً لثقتك في|نورتنا يا {الاسم} في] {المتجر} [❤️|🌸]',
    '[خبر حلو|أخبار حلوة] يا {الاسم} [🎉|😍]\n[شحنتك|طلبك] من {المتجر} [في الطريق ليك|اتسلم لشركة الشحن] 🚚\nبوليصة رقم {البوليصة}\n[جهّز|خلي معاك] {المبلغ} ج.م [للمندوب|عند الاستلام]، و[خليك متاح على الموبايل|ياريت ترد على المندوب] [🙏|📱]',
  ].join('\n---\n') },
  remind: { name: 'تذكير قبل التوصيل', text: [
    '[أهلاً|صباح الخير] {الاسم} [😊|☀️]\n[أوردرك|طلبك] من {المتجر} [خرج مع المندوب النهارده|هيوصلك النهارده إن شاء الله] 🚚\n[ياريت تكون متاح|خليك قريب من] الموبايل [عشان المندوب يوصلك|لأن المندوب هيكلمك]، والمبلغ {المبلغ} ج.م. [شكراً ليك|متشكرين]!',
    '[تذكير صغير|معلش للإزعاج] يا {الاسم} [🌸|🙏]\n[المندوب في الطريق ليك|شحنتك مع المندوب النهارده] بـ[طلبك|أوردرك] من {المتجر}.\nالمبلغ المطلوب {المبلغ} ج.م — [ياريت ترد على المندوب|خلي الموبايل جنبك] [📱|😊]',
  ].join('\n---\n') },
  failed: { name: 'متابعة بعد الرفض', text: [
    '[أهلاً|مساء الخير] {الاسم}، معاك {المتجر} [🙏|🌸]\n[المندوب حاول يوصلك|المندوب كان عندك بـ] [أوردر|طلب] رقم {رقم_الأوردر} [ومقدرش يسلّمه|بس ملحقش يسلمه].\n[ممكن نعرف ميعاد يناسبك|قولنا الوقت المناسب ليك] [ونرجع نبعته تاني|ونبعتهولك تاني]؟',
    '[أهلاً|يا هلا] يا {الاسم} [😊|👋]\n[حصل ظرف|شكله في حاجة حصلت] ومقدرناش نسلّمك [طلبك|أوردرك] من {المتجر} 📦\n[لسه حابب تستلمه؟|محتاجه لسه؟] [رد علينا|عرّفنا] و[نحدد ميعاد جديد|نرتب التوصيل تاني] [🙏|❤️]',
  ].join('\n---\n') },
};
const WA = {
  async cfg() { const c = await Store.get('wa_cfg', {}); return { app: c.app || 'ask', store: c.store || '', templates: { ...WA_DEFAULTS, ...(c.templates || {}) } }; },
  async save(c) { await Store.set('wa_cfg', c); },
  phone: p => { const x = findPhones(p)[0]; return x ? '2' + x : ''; },
  _last: {},
  // Pick one version (never the same one twice in a row), spin [a|b] choices, fill {fields}.
  fill(text, d, key = '') {
    const versions = text.split(/\n\s*---\s*\n/).map(t => t.trim()).filter(Boolean);
    let i = Math.floor(Math.random() * versions.length);
    if (versions.length > 1 && i === this._last[key]) i = (i + 1) % versions.length;
    this._last[key] = i;
    const pick = a => a[Math.floor(Math.random() * a.length)];
    return versions[i].replace(/\[([^\[\]]+)\]/g, (m, opts) => opts.includes('|') ? pick(opts.split('|')) : m)
      .replace(/\{([^}]+)\}/g, (m, k) => (d[k] ?? m)).replace(/\n{3,}/g, '\n\n');
  },
  async send(phone, text) {
    const c = await this.cfg(), ph = this.phone(phone);
    if (!ph) return toast('مفيش رقم موبايل صحيح', 'err');
    const P = window.Capacitor?.Plugins?.WhatsApp;
    try {
      if (P) await P.open({ phone: ph, text, app: c.app });
      else window.open(`https://api.whatsapp.com/send?phone=${ph}&text=${encodeURIComponent(text)}`, '_blank');
    } catch (e) { toast(e.message || 'تعذر فتح واتساب', 'err'); }
  },
};
// Fields for templates, from a Shopify order or a Hazem shipment.
// First name for greetings; keeps "ام سالم" / "ابو احمد" / short names whole.
function firstName(full) {
  const w = clean(full).split(' ').filter(Boolean);
  if (!w.length) return '';
  return (w.length > 1 && (w[0].length <= 3 || /^(ام|أم|ابو|أبو|مدام|استاذ|أستاذ|دكتور|د|م|عبد)$/.test(w[0]))) ? w.slice(0, 2).join(' ') : w[0];
}
async function shopName() {
  if (state.shopName) return state.shopName;
  if (!Shopify.ready) return '';
  try { state.shopName = (await Shopify.test()).name.trim(); } catch {}
  return state.shopName || '';
}
async function waData({ order, ship }) {
  const c = await WA.cfg();
  const store = c.store || await shopName() || 'متجرنا';
  if (order) {
    const a = order.shippingAddress || {}, s = orderToShipment(order, state.sectors || []);
    return { 'الاسم': firstName(a.name || [a.firstName, a.lastName].filter(Boolean).join(' ')), 'المتجر': store, 'رقم_الأوردر': order.name,
      'المنتجات': order.lineItems.nodes.map(i => `• ${i.title}${i.variantTitle ? ' (' + i.variantTitle + ')' : ''} × ${i.quantity}`).join('\n'),
      'المبلغ': money(s.price), 'العنوان': s.address, 'البوليصة': state.sentMap?.[order.name]?.waybill || '', phone: s.phone_1 };
  }
  return { 'الاسم': firstName(ship.consignee), 'المتجر': store, 'رقم_الأوردر': ship.order_id ? '#' + ship.order_id : ship.waybill,
    'المنتجات': ship.product || '', 'المبلغ': money(ship.cod), 'العنوان': ship.address || '', 'البوليصة': ship.waybill, phone: ship.phone1 };
}
// Pick a template, preview/edit it, then open WhatsApp.
async function waCompose(src, preferred = 'confirm', onSent = null) {
  const c = await WA.cfg(), d = await waData(src);
  let key = preferred;
  const sh = sheet('رسالة واتساب', `
    <div class="chips" id="waT">${Object.entries(c.templates).map(([k, t]) => `<button class="chip ${k === key ? 'on' : ''}" data-k="${k}">${esc(t.name)}</button>`).join('')}</div>
    <div class="card card-pad"><div class="small muted" style="margin-bottom:6px">لـ <b class="ltr">${esc(d.phone || '—')}</b> · تقدر تعدّل الرسالة قبل الإرسال</div>
    <div class="field" style="margin:0"><textarea id="waMsg" style="min-height:230px;line-height:1.7"></textarea></div>
    <button class="btn sm" id="waShuffle" style="margin-top:8px">🔀 صيغة تانية</button></div>`,
    [['إلغاء', () => sh.close()], [`${ic('whatsapp')} افتح واتساب`, async () => { await WA.send(d.phone, $('#waMsg', sh.el).value); sh.close(); onSent && onSent(key); }, 'wa']]);
  const fill = () => { $('#waMsg', sh.el).value = WA.fill(c.templates[key].text, d, key); };
  $('#waShuffle', sh.el).onclick = fill;
  $$('#waT .chip', sh.el).forEach(b => b.onclick = () => { key = b.dataset.k; $$('#waT .chip', sh.el).forEach(x => x.classList.toggle('on', x === b)); fill(); });
  fill();
}
async function markWa(orderName, key) {
  state.waLog = state.waLog || await Store.get('wa_log', {});
  state.waLog[orderName] = { t: Date.now(), key }; await Store.set('wa_log', state.waLog);
}
function waBadge(orderName) {
  const x = state.waLog?.[orderName]; if (!x) return '';
  const mins = Math.round((Date.now() - x.t) / 60000);
  const when = mins < 1 ? "دلوقتي" : mins < 60 ? `من ${mins} د` : mins < 1440 ? `من ${Math.round(mins / 60)} س` : `من ${Math.round(mins / 1440)} يوم`;
  return `<span class="badge info">✓ اتبعتله واتساب ${when}</span>`;
}
async function openWaSettings() {
  const c = await WA.cfg();
  let inst = { whatsapp: true, business: true };
  try { inst = await window.Capacitor?.Plugins?.WhatsApp?.installed() || inst; } catch {}
  const opt = (v, l, ok) => `<button data-app="${v}" class="${c.app === v ? 'on' : ''}" ${ok === false ? 'disabled' : ''}>${l}${ok === false ? ' (مش متسطّب)' : ''}</button>`;
  const sh = sheet('إعدادات واتساب', `
    <div class="card card-pad">
      <div class="field"><label>ابعت الرسايل من</label></div>
      <div class="seg" id="waApp">${opt('whatsapp', 'واتساب', inst.whatsapp)}${opt('business', 'واتساب بيزنس', inst.business)}${opt('ask', 'اسألني كل مرة')}</div>
      <div class="tiny" style="margin:-4px 2px 12px">لو عندك واتساب فرعي (نسخة مستنسخة)، اختار <b>اسألني كل مرة</b> والموبايل هيسألك تبعت من أنهي واحد.</div>
      <div class="field"><label>اسم المتجر في الرسايل</label><input id="waStore" value="${esc(c.store || await shopName())}" placeholder="مثلاً: ALIA FASHION"></div>
    </div>
    <div class="section-title">الرسايل الجاهزة</div>
    <div class="banner info small" style="display:block">
      • الكلمات دي بتتغير لوحدها: <b>{الاسم} {رقم_الأوردر} {المنتجات} {المبلغ} {العنوان} {البوليصة} {المتجر}</b><br>
      • <b>[أهلاً|مرحباً|مساء الخير]</b> = التطبيق يختار كلمة منهم عشوائي كل مرة.<br>
      • سطر فيه <b>---</b> لوحده بيفصل بين صيغ مختلفة للرسالة، وكل مرة تتبعت صيغة مختلفة.<br>
      كده كل رسالة بتطلع مختلفة عن اللي قبلها، وده بيقلل فرصة حظر الواتساب.</div>
    ${Object.entries(c.templates).map(([k, t]) => `<div class="card card-pad"><div class="field"><label>${esc(t.name)}</label><textarea data-tpl="${k}" style="min-height:150px;line-height:1.7">${esc(t.text)}</textarea></div><button class="btn sm" data-reset="${k}">رجّع الرسالة الأصلية</button></div>`).join('')}`,
    [['حفظ', save, 'primary']]);
  let app = c.app;
  $$('#waApp button', sh.el).forEach(b => b.onclick = () => { app = b.dataset.app; $$('#waApp button', sh.el).forEach(x => x.classList.toggle('on', x === b)); });
  $$('[data-reset]', sh.el).forEach(b => b.onclick = () => { $(`[data-tpl="${b.dataset.reset}"]`, sh.el).value = WA_DEFAULTS[b.dataset.reset].text; });
  async function save() {
    const templates = {};
    $$('[data-tpl]', sh.el).forEach(t => templates[t.dataset.tpl] = { name: (WA_DEFAULTS[t.dataset.tpl] || {}).name || t.dataset.tpl, text: t.value });
    await WA.save({ app, store: $('#waStore', sh.el).value.trim(), templates });
    toast('اتحفظ', 'ok'); sh.close();
  }
}

// ---------- Returns: reason + shipping actually paid ----------
// Badge for the shipping the customer paid on a returned shipment.
function feeBadge(op) {
  if (!op) return '';
  if (op.paid <= 0) return `<span class="badge critical">مدفعش شحن (${money(op.fee)})</span>`;
  if (op.paid < op.fee) return `<span class="badge canary">دفع ${money(op.paid)} من ${money(op.fee)} · ناقص ${money(op.fee - op.paid)}</span>`;
  return `<span class="badge success">دفع الشحن ${money(op.paid)}</span>`;
}
const isFailed = s => s.category === 'returned' || [13, 25, 31].includes(Number(s.statusId));
// Statuses where the courier writes why: failed/returned, postponed, couldn't reach the customer, wrong address.
const NEEDS_REASON = [6, 37, 38, 33, 34, 35, 121, 150];
const hasReason = s => isFailed(s) || NEEDS_REASON.includes(Number(s.statusId)) || s.category === 'postponed';
const isPostponed = s => !isFailed(s) && hasReason(s);
// Reasons are cached per shipment id and refreshed whenever the status or its time changes.
async function reasonFor(s) {
  state.reasons = state.reasons || await Store.get('reasons', {});
  const c = state.reasons[s.id];
  if (c && c.status === s.statusId && c.at === s.last_change && 'lastStatus' in c) return c;
  const f = await Hazem.editForm(s.id);
  const info = { ...failureInfo(f.history), status: s.statusId, at: s.last_change };
  state.reasons[s.id] = info; Store.set('reasons', state.reasons);
  return info;
}
async function pool(items, n, fn) {
  let i = 0; const run = async () => { while (i < items.length) { const it = items[i++]; try { await fn(it); } catch {} } };
  await Promise.all(Array.from({ length: n }, run));
}

// ---------- Shipment list ----------
function statusBadge(s) { return `<span class="badge ${BADGE[s.category]}">${esc(s.status || CATEGORY_LABEL[s.category])}</span>`; }
// Same phone more than once among shipments still with us/in progress -> likely entered twice.
function dupPhones(rows) {
  const n = {};
  for (const r of rows) if (r.phone1 && ['active', 'postponed'].includes(r.category)) n[r.phone1] = (n[r.phone1] || 0) + 1;
  return n;
}
// The extra copies only: for each phone, every open shipment after the first-entered one (lowest code).
function dupExtras(rows) {
  const g = {}, extra = new Map();
  for (const r of rows) if (r.phone1 && ['active', 'postponed'].includes(r.category)) (g[r.phone1] = g[r.phone1] || []).push(r);
  for (const list of Object.values(g)) if (list.length > 1) {
    list.sort((a, b) => wbKey(a.waybill) - wbKey(b.waybill));
    list.slice(1).forEach(r => extra.set(r.id, list[0].waybill));
  }
  return extra;
}
function shipList(rows) {
  if (!rows.length) return `<div class="card empty">${ic('box')}<div>مفيش شحنات</div></div>`;
  const extra = state.shipFilter === 'dups' && state.dupMap ? state.dupMap : dupExtras(rows);
  return `<div class="list">${rows.map((s, i) => `
    <button class="item ${state.sel?.has(s.id) ? 'selected' : ''}" data-i="${i}">
      ${state.selMode ? `<span class="check ${state.sel.has(s.id) ? 'on' : ''}"></span>` : ''}
      <div class="grow">
        <div class="row between"><span class="title ellipsis">${esc(s.consignee || '—')}</span><span class="amount">${money(s.cod)} <span class="tiny">ج.م</span></span></div>
        <div class="meta row between" style="margin-top:2px"><span class="ltr">${esc(s.waybill)}</span><span>${esc(s.area)}</span></div>
        <div class="row between wrap" style="margin-top:6px;gap:6px"><span class="row" style="gap:6px">${statusBadge(s)}${extra.has(s.id) ? `<span class="badge canary">⚠️ مكرر من ${esc(extra.get(s.id).replace(/^[A-Z]+/, ''))}</span>` : ''}</span><span class="tiny">${esc((s.last_change || s.date).slice(0, 16))}</span></div>
        ${hasReason(s) ? `<div class="fail-line" data-x="${esc(s.id)}"></div>` : ''}
      </div>
    </button>`).join('')}</div>`;
}
// Tap opens a shipment; a long press starts selecting (then taps add/remove).
function bindShipList(root, rows) {
  $$('.item[data-i]', root).forEach(b => {
    const s = rows[b.dataset.i];
    let t = null, long = false;
    const start = () => { long = false; t = setTimeout(() => { long = true; navigator.vibrate?.(30); startSelect(s); }, 480); };
    const cancel = () => clearTimeout(t);
    b.addEventListener('touchstart', start, { passive: true }); b.addEventListener('touchend', cancel); b.addEventListener('touchmove', cancel, { passive: true });
    b.addEventListener('contextmenu', e => { e.preventDefault(); if (!long) startSelect(s); long = true; });
    b.onclick = () => { if (long) { long = false; return; } state.selMode ? toggleSel(s) : openShipment(s); };
  });
}

// ---------- Multi-select on the shipments list ----------
function startSelect(s) {
  if (!state.selMode) { state.selMode = true; state.sel = new Set(); }
  toggleSel(s, true);
}
function toggleSel(s, on) {
  const want = on ?? !state.sel.has(s.id);
  want ? state.sel.add(s.id) : state.sel.delete(s.id);
  if (!state.sel.size) return endSelect();
  renderShipRows(state.shipments, '', true); renderSelBar();
}
function endSelect() { state.selMode = false; state.sel = new Set(); $('#selBar')?.remove(); renderShipRows(state.shipments, '', true); }
function renderSelBar() {
  let bar = $('#selBar');
  if (!bar) { bar = document.createElement('div'); bar.id = 'selBar'; bar.className = 'sel-bar'; document.body.appendChild(bar); }
  const picked = state.shipments.filter(r => state.sel.has(r.id));
  const n = picked.length, deletable = picked.filter(r => r.canDelete).length;
  bar.innerHTML = `
    <div class="row between" style="margin-bottom:8px"><b>تم تحديد ${n}</b><span class="row" style="gap:6px"><button class="btn sm" id="selDupB">⚠️ حدد المكرر</button><button class="btn sm" id="selAllB">${n === state.shipments.length ? 'إلغاء الكل' : 'تحديد الكل'}</button><button class="icon-btn" id="selX">${ic('close')}</button></span></div>
    <div class="row" style="gap:8px">
      <button class="btn grow" id="selEdit" ${n === 1 ? '' : 'disabled'}>${ic('edit')} تعديل</button>
      <button class="btn grow" id="selWa" ${n === 1 ? '' : 'disabled'}>${ic('whatsapp')} واتساب</button>
      <button class="btn grow" id="selXl">${ic('download')} إكسيل</button>
      <button class="btn danger grow" id="selDel" ${deletable ? '' : 'disabled'}>${ic('close')} حذف ${deletable && deletable !== n ? deletable : ''}</button>
    </div>
    ${deletable < n ? `<div class="tiny" style="margin-top:6px">الحذف متاح بس للشحنات اللي لسه المندوب مستلمهاش (${deletable} من ${n})</div>` : ''}`;
  $('#selX').onclick = endSelect;
  $('#selXl').onclick = exportExcel;
  $('#selDupB').onclick = selectDuplicates;
  $('#selAllB').onclick = () => { if (n === state.shipments.length) return endSelect(); state.shipments.forEach(r => state.sel.add(r.id)); renderShipRows(state.shipments, '', true); renderSelBar(); };
  $('#selEdit').onclick = () => { const s = picked[0]; endSelect(); openEdit(s); };
  $('#selWa').onclick = () => { const s = picked[0]; endSelect(); waCompose({ ship: s }, 'remind'); };
  $('#selDel').onclick = () => deleteSelected(picked.filter(r => r.canDelete));
}
async function deleteSelected(list) {
  const sh = sheet(`حذف ${list.length} شحنة؟`, `
    <div class="banner critical">الشحنات دي هتتحذف من حازم حلان ومش هيجيلها مندوب. مينفعش ترجع في الخطوة دي.</div>
    <div class="list">${list.map(s => `<div class="item"><div class="grow"><div class="row between"><b>${esc(s.consignee)}</b><b>${money(s.cod)}</b></div><div class="meta ltr" style="text-align:right">${esc(s.waybill)} · ${esc(s.phone1)}</div></div></div>`).join('')}</div>`,
    [['رجوع', () => sh.close()], [`احذف ${list.length}`, go, 'danger-solid']]);
  async function go(btn) {
    btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
    try {
      const r = await Hazem.deleteShipments(list.map(s => s.id));
      sh.close(); endSelect();
      await loadShipments();
      const still = list.filter(s => state.shipments.some(x => x.id === s.id && x.statusId === s.statusId));
      if (still.length) toast(r.alert || `${still.length} شحنة مااتحذفتش — جرّب من الموقع`, 'err');
      else toast(`اتحذف ${list.length} ✓`, 'ok');
    } catch (e) { btn.disabled = false; btn.textContent = `احذف ${list.length}`; handleErr(e); }
  }
}

const SHIP_FILTERS = [['all', 'الكل'], ['pickup', '📦 بيك أب'], ['dups', '⚠️ المكرر'], ['active', '🚚 قيد التشغيل'], ['delivered', '✅ تم التسليم'], ['returned', '↩️ مرفوض / مرتجع'], ['shortship', '💸 دفع شحن أقل'], ['postponed', '📅 مؤجل'], ['cancelled', '✕ ملغي']];
// Search by: [key, label, placeholder, row fields used for the instant on-screen filter]
const SEARCH_BY = [
  ['auto', 'كل الحقول', 'بوليصة، رقم طلب، اسم، موبايل…', r => [r.waybill, r.consignee, r.phone1, r.phone2, r.order_id, r.area, r.address, r.product, r.client_code]],
  ['waybill', 'رقم البوليصة', 'مثال: HZM9827493', r => [r.waybill]],
  ['order_id', 'رقم الطلب / أوردر شوبيفاي', 'مثال: 1190', r => [r.order_id]],
  ['consignee', 'اسم العميل', 'اكتب اسم العميل', r => [r.consignee]],
  ['phone', 'رقم الموبايل', '01xxxxxxxxx', r => [r.phone1, r.phone2]],
  ['product_name', 'المنتج / الكود', 'مثال: 5289 أو Z408', r => [r.product]],
];
// Sort by: [key, label, compare]
const txtCmp = (a, b) => String(a || '').localeCompare(String(b || ''), 'ar');
const SORTS = [
  ['', 'الافتراضي (زي الموقع)', null],
  ['wb_asc', 'رقم البوليصة ↑', (a, b) => wbKey(a.waybill) - wbKey(b.waybill)],
  ['wb_desc', 'رقم البوليصة ↓', (a, b) => wbKey(b.waybill) - wbKey(a.waybill)],
  ['ord_asc', 'رقم الطلب / شوبيفاي ↑', (a, b) => (Number(a.order_id) || 1e12) - (Number(b.order_id) || 1e12)],
  ['ord_desc', 'رقم الطلب / شوبيفاي ↓', (a, b) => (Number(b.order_id) || -1) - (Number(a.order_id) || -1)],
  ['name', 'اسم العميل (أ ← ي)', (a, b) => txtCmp(a.consignee, b.consignee)],
  ['phone', 'رقم الموبايل', (a, b) => txtCmp(a.phone1, b.phone1)],
  ['area', 'المنطقة (أ ← ي)', (a, b) => txtCmp(a.area, b.area)],
  ['cod_desc', 'المبلغ: الأعلى الأول', (a, b) => num(b.cod) - num(a.cod)],
  ['cod_asc', 'المبلغ: الأقل الأول', (a, b) => num(a.cod) - num(b.cod)],
  ['upd', 'آخر تحديث: الأحدث الأول', (a, b) => dtVal(b.last_change || b.date) - dtVal(a.last_change || a.date)],
  ['created', 'تاريخ الإنشاء: الأحدث الأول', (a, b) => dtVal(b.date) - dtVal(a.date)],
];
// A small dropdown that opens under its button ("لسان ينسدل").
function dropdown(anchor, items, current, onPick, title = '') {
  $('.dd-wrap')?.remove();
  const wrap = document.createElement('div'); wrap.className = 'dd-wrap';
  wrap.innerHTML = `<div class="dd">${title ? `<div class="dd-t">${esc(title)}</div>` : ''}${items.map(([k, l, , extra]) => `<button class="dd-i ${k === current ? 'on' : ''}" data-k="${esc(k)}"><span class="grow">${esc(l)}</span>${extra != null && typeof extra !== 'function' ? `<span class="tiny">${esc(extra)}</span>` : ''}${k === current ? ic('check', 'width="18"') : ''}</button>`).join('')}</div>`;
  document.body.appendChild(wrap);
  const r = anchor.getBoundingClientRect(), dd = $('.dd', wrap);
  dd.style.top = Math.min(r.bottom + 6, innerHeight - dd.offsetHeight - 70) + 'px';
  dd.style.right = Math.max(8, innerWidth - r.right) + 'px';
  requestAnimationFrame(() => wrap.classList.add('show'));
  wrap.onclick = e => { const b = e.target.closest('[data-k]'); wrap.remove(); if (b) onPick(b.dataset.k); };
}
async function viewShipments() {
  setTitle('الشحنات', [['download', exportExcel]]);
  const sb = SEARCH_BY.find(x => x[0] === (state.searchBy || 'auto')) || SEARCH_BY[0];
  const flt = SHIP_FILTERS.find(x => x[0] === state.shipFilter) || SHIP_FILTERS[0];
  const srt = SORTS.find(x => x[0] === (state.shipSort || '')) || SORTS[0];
  $('#view').innerHTML = `
    <form class="searchbox sb2" id="sForm">${ic('search')}<input class="input" id="sQ" type="search" placeholder="${esc(sb[2])}" value="${esc(state.shipQuery)}"><button type="button" class="sb-by" id="sBy">${esc(sb[1])} ▾</button></form>
    <div class="toolbar">
      <button class="tb ${state.shipFilter !== 'all' ? 'on' : ''}" id="fltBtn"><span class="tiny">عرض</span><b>${esc(flt[1])}</b> ▾</button>
      <button class="tb ${state.shipSort ? 'on' : ''}" id="sortBtn"><span class="tiny">ترتيب</span><b>${esc(srt[0] ? srt[1] : 'الافتراضي')}</b> ▾</button>
      <button class="tb ${state.shipRange ? 'on' : ''}" id="dateBtn"><span class="tiny">الفترة</span><b>${esc(rangeLabel(state.shipRange))}</b> ▾</button>
    </div>
    <div class="small muted" id="sCount" style="margin:0 4px 8px"></div>
    <div id="dupBar"></div>
    <div id="sList">${loading()}</div>`;
  $('#fltBtn').onclick = e => dropdown(e.currentTarget, SHIP_FILTERS, state.shipFilter, k => { state.shipFilter = k; state.shipQuery = ''; viewShipments(); }, 'اعرض');
  $('#sortBtn').onclick = e => dropdown(e.currentTarget, SORTS, state.shipSort || '', k => { state.shipSort = k; viewShipments(); }, 'رتّب حسب');
  $('#sBy').onclick = e => dropdown(e.currentTarget, SEARCH_BY, sb[0], k => { state.searchBy = k; const q = $('#sQ').value; viewShipments(); setTimeout(() => { $('#sQ').value = q; $('#sQ').focus(); }, 50); }, 'ابحث بـ');
  $('#sForm').onsubmit = e => { e.preventDefault(); $('#sQ').blur(); state.shipQuery = $('#sQ').value.trim(); loadShipments(); };
  // Instant filter over what's already loaded (in the chosen field); Enter searches the whole portal.
  $('#sQ').oninput = e => {
    const q = normAr(e.target.value);
    if (!q) { if (state.shipQuery) { state.shipQuery = ''; loadShipments(); } else renderShipRows(state.baseRows || []); return; }
    const rows = (state.baseRows || []).filter(r => normAr(sb[3](r).join(' ')).includes(q));
    renderShipRows(rows, rows.length ? '' : 'مش موجودة في القايمة الحالية — دوس 🔍 (إدخال) عشان أدوّر في كل الشحنات');
  };
  $('#dateBtn').onclick = pickDates;
  loadShipments();
}
// Numeric part of a waybill: HZM9827493 -> 9827493 (suffixes like -R / -P sort right after).
const wbKey = w => { const m = String(w || '').match(/(\d+)(?:-(\w+))?/); return m ? Number(m[1]) + (m[2] ? 0.1 : 0) : 0; };
function sortRows(rows) {
  const s = SORTS.find(x => x[0] === (state.shipSort || ''));
  return s && s[2] ? [...rows].sort(s[2]) : rows;
}
// For each phone with several open shipments, select all but the first-entered one (lowest code).
function selectDuplicates() {
  const extra = state.shipFilter === 'dups' && state.dupMap ? state.dupMap : dupExtras(state.shipments);
  state.selMode = true; state.sel = new Set(state.shipments.filter(r => extra.has(r.id)).map(r => r.id));
  if (!state.sel.size) { toast('مفيش شحنات مكررة في القايمة دي'); return endSelect(); }
  renderShipRows(state.shipments, '', true); renderSelBar();
  toast(`اتحدد ${state.sel.size} نسخة زيادة — راجعهم قبل الحذف`);
}
async function loadShipments() {
  const box = $('#sList'); if (!box) return;
  box.innerHTML = loading();
  try {
    let rows;
    if (state.shipQuery) {
      rows = await Hazem.search(state.shipQuery, state.searchBy);
      rows = rows.filter(r => state.shipFilter === 'shortship' || inFilter(r, state.shipFilter));
      return renderShipRows(rows, rows.length ? '' : `مفيش شحنات فيها "${state.shipQuery}"`);
    }
    if (state.shipFilter === 'dups') {
      // Only the extra copies among open shipments (the first-entered copy is kept out of the list).
      const all = await Hazem.shipments({ items: 1000, ...(state.shipRange || {}), status: STATUS.active.concat(STATUS.postponed) });
      state.dupMap = dupExtras(all);
      rows = all.filter(r => state.dupMap.has(r.id));
      state.baseRows = rows;
      return renderShipRows(rows, 'مفيش شحنات مكررة 👌');
    }
    if (state.shipFilter === 'shortship') {
      // Failed shipments whose return operation shows the customer paid less than the shipping fee.
      const all = (await Hazem.shipments({ items: 1000, ...(state.shipRange || {}), status: [...new Set(STATUS.returned.concat([13, 25, 31]))] })).filter(isFailed);
      const fees = await Hazem.returnFees(all.map(x => x.waybill).filter(Boolean));
      rows = all.filter(x => { const op = fees[x.waybill]; return op && op.paid > 0 && op.paid < op.fee; });
      state.baseRows = rows;
      return renderShipRows(rows, 'مفيش شحنات العميل دفع فيها شحن أقل 👌');
    }
    const f = { items: 250, ...(state.shipRange || {}) };
    if (state.shipFilter !== 'all') f.status = STATUS[state.shipFilter];
    rows = await Hazem.shipments(f);
    rows = rows.filter(r => inFilter(r, state.shipFilter));
    state.baseRows = rows;
    renderShipRows(rows);
  } catch (e) { box.innerHTML = ''; handleErr(e); }
}
function renderShipRows(rows, emptyMsg = '', selOnly = false) {
  const box = $('#sList'); if (!box) return;
  rows = sortRows(rows);
  state.shipments = rows;
  const dupN = state.shipFilter === 'dups' ? rows.length : dupExtras(rows).size;
  const db = $('#dupBar');
  if (db) {
    db.innerHTML = dupN && !state.selMode ? `<div class="banner warning" style="align-items:center"><div class="grow small"><b>${dupN} شحنة مكررة</b> (نفس رقم الموبايل أكتر من مرة)</div><button class="btn sm" id="dupSel">حدد المكرر</button></div>` : '';
    if ($('#dupSel')) $('#dupSel').onclick = selectDuplicates;
  }
  const total = rows.reduce((s, r) => s + (Number(String(r.cod).replace(/[^\d.-]/g, '')) || 0), 0);
  $('#sCount').textContent = `${rows.length} شحنة · ${money(total)} ج.م`;
  box.innerHTML = !rows.length && emptyMsg ? `<div class="card empty">${ic('search')}<div>${esc(emptyMsg)}</div></div>` : shipList(rows);
  bindShipList(box, rows);
  if (!selOnly) fillFailLines(box, rows);
  else for (const [id, html] of Object.entries(state.failHtml || {})) { const el = box.querySelector(`.fail-line[data-x="${CSS.escape(id)}"]`); if (el) el.innerHTML = html; }
  box.style.paddingBottom = state.selMode ? '150px' : '';
}
// Fill reason + paid-fee under each failed shipment in a rendered list.
async function fillFailLines(box, rows) {
  const failed = rows.filter(isFailed), withReason = rows.filter(hasReason);
  if (!withReason.length) return;
  state.failHtml = {};
  const put = (id, html) => { state.failHtml[id] = (state.failHtml[id] || '') + html; const el = $('#sList')?.querySelector(`.fail-line[data-x="${CSS.escape(id)}"]`); if (el) el.innerHTML += html; };
  if (failed.length) try {
    const fees = await Hazem.returnFees(failed.map(s => s.waybill).filter(Boolean));
    failed.forEach(s => { s.feeOp = fees[s.waybill]; if (s.feeOp) put(s.id, feeBadge(s.feeOp)); });
  } catch {}
  await pool(withReason.slice(0, 80), 3, async s => {
    const r = await reasonFor(s); s.reasonInfo = r;
    if (isPostponed(s)) {
      // Postponed / no answer: the latest status row's own reason and new date.
      const why = r.lastReason || r.lastNote || r.reason || r.note;
      if (why) put(s.id, `<div class="reason postpone">📅 ${esc(why)}</div>`);
      if (r.postponedTo && !/^[-_—\s]+$/.test(r.postponedTo)) put(s.id, `<div class="tiny">موعد جديد: ${esc(r.postponedTo)}</div>`);
    } else if (r.reason || r.note) put(s.id, `<div class="reason">${ic('alert', 'width="14"')}${esc(r.reason || r.note)}</div>`);
  });
}
function rangeLabel(r) {
  if (!r) return 'كل التواريخ';
  const names = { today: 'اليوم', 7: 'آخر 7 أيام', 30: 'آخر 30 يوم', 90: 'آخر 3 شهور' };
  for (const k in names) { const p = periodRange(k); if (p.from === r.from && p.to === r.to) return names[k]; }
  return r.from === r.to ? r.from : `${r.from} ← ${r.to}`;
}
function pickDates() {
  const r = state.shipRange || periodRange('30');
  const s = sheet('فترة الشحنات', `
    <div class="card card-pad">
      <div class="chips">${[['today', 'اليوم'], ['7', '7 أيام'], ['30', '30 يوم'], ['90', '3 شهور']].map(([k, l]) => { const p = periodRange(k); const on = state.shipRange && state.shipRange.from === p.from && state.shipRange.to === p.to; return `<button class="chip ${on ? 'on' : ''}" data-p="${k}">${l}</button>`; }).join('')}</div>
      <div class="field"><label>من</label><input type="date" id="dFrom" value="${r.from}"></div>
      <div class="field"><label>إلى</label><input type="date" id="dTo" value="${r.to}"></div>
    </div>`, [['كل التواريخ', () => { state.shipRange = null; s.close(); viewShipments(); }], ['تطبيق', () => { state.shipRange = { from: $('#dFrom').value, to: $('#dTo').value }; s.close(); viewShipments(); }, 'primary']]);
  // A period button applies right away.
  $$('.chip[data-p]', s.el).forEach(c => c.onclick = () => {
    $$('.chip[data-p]', s.el).forEach(x => x.classList.toggle('on', x === c));
    state.shipRange = periodRange(c.dataset.p); setTimeout(() => { s.close(); viewShipments(); }, 150);
  });
}

// ---------- Shipment details ----------
function openShipment(s) {
  const sh = sheet(s.waybill, `
    <div class="card card-pad">
      <div class="row between"><div><div class="h2">${esc(s.consignee)}</div><div class="small muted">${esc(s.area)}</div></div>${statusBadge(s)}</div>
      <div class="actions" style="margin-top:12px">
        <a class="action" href="tel:${esc(s.phone1)}">${ic('phone')}اتصال</a>
        <button class="action" id="waBtn">${ic('whatsapp')}واتساب</button>
        <button class="action" id="editBtn">${ic('edit')}تعديل</button>
        <a class="action" href="${HH_REAL}/admin-area/shippings.php?action=edit&id=${encodeURIComponent(s.id)}" target="_blank">${ic('web')}في الموقع</a>
      </div>
    </div>
    ${isFailed(s) ? `<div class="card card-pad fail-card" id="failCard"><div class="h2">${ic('alert', 'width="18"')} ليه الشحنة رجعت؟</div><div id="failBody">${loading()}</div></div>`
      : hasReason(s) ? `<div class="card card-pad fail-card postpone-card" id="failCard"><div class="h2">📅 ليه الشحنة اتأجلت؟</div><div id="failBody">${loading()}</div></div>` : ''}
    <div class="card"><dl class="kv">
      <dt>مبلغ التحصيل</dt><dd>${money(s.cod)} ج.م</dd>
      <dt>موبايل</dt><dd class="ltr" style="text-align:right">${esc([s.phone1, s.phone2].filter(Boolean).join(' / '))}</dd>
      <dt>العنوان</dt><dd>${esc(s.address)}</dd>
      ${s.product ? `<dt>المنتج</dt><dd>${esc(s.product)}</dd>` : ''}
      ${s.order_id ? `<dt>رقم الطلب</dt><dd>${Shopify.ready ? `<button class="ord-link" id="ordBtn">#${esc(s.order_id)} ↗ افتح في شوبيفاي</button>` : esc(s.order_id)}</dd>` : ''}
      <dt>نوع الخدمة</dt><dd>${esc(s.service)}</dd>
      <dt>تاريخ الإنشاء</dt><dd>${esc(s.date)}</dd>
      <dt>آخر تحديث</dt><dd>${esc(s.last_change)}</dd>
      ${s.postponed ? `<dt>موعد التأجيل</dt><dd>${esc(s.postponed)}</dd>` : ''}
      ${s.notes ? `<dt>ملاحظات</dt><dd>${esc(s.notes)}</dd>` : ''}
    </dl></div>
    <div class="section-title">مسار الشحنة</div><div class="card" id="hist">${loading()}</div>`);
  $('#editBtn', sh.el).onclick = () => { sh.close(); openEdit(s); };
  if ($('#ordBtn', sh.el)) $('#ordBtn', sh.el).onclick = async e => {
    const b = e.currentTarget, old = b.innerHTML; b.disabled = true; b.textContent = 'بدوّر على الأوردر…';
    try {
      const o = await Shopify.findOrder(s.order_id, s.waybill);
      if (!o) toast('الأوردر مش لاقيه على شوبيفاي', 'err'); else window.open(Shopify.adminUrl(o.id), '_blank');
    } catch (err) { handleErr(err); }
    b.disabled = false; b.innerHTML = old;
  };
  $('#waBtn', sh.el).onclick = () => waCompose({ ship: s }, isFailed(s) ? 'failed' : s.category === 'active' ? 'remind' : 'shipped');
  const okTxt = x => x && !/^[-_—\s]+$/.test(x);
  Hazem.editForm(s.id).then(f => {
    const h = $('#hist', sh.el); if (!h) return;
    h.innerHTML = f.history.length ? `<ul class="timeline">${f.history.map(x => `<li><b>${esc(x.status.replace(/^\d+\s*-\s*/, ''))}</b><div class="tiny">${esc(x.date)}</div>${okTxt(x.reason) ? `<div class="reason">${esc(x.reason)}</div>` : ''}${okTxt(x.note) ? `<div class="small muted">📝 ${esc(x.note)}</div>` : ''}</li>`).join('')}</ul>` : '<div class="empty small">مفيش سجل</div>';
    if (isPostponed(s)) {
      const r = failureInfo(f.history);
      const why = r.lastReason || r.lastNote || r.reason || r.note;
      $('#failBody', sh.el).innerHTML = `
        <dl class="kv" style="padding:8px 0 0">
          <dt>الحالة</dt><dd>${esc(r.lastStatus || s.status)}</dd>
          <dt>السبب</dt><dd>${esc(why || 'مش مكتوب سبب')}</dd>
          ${r.lastNote && r.lastNote !== why ? `<dt>ملاحظة المندوب</dt><dd>${esc(r.lastNote)}</dd>` : ''}
          ${r.postponedTo && !/^[-_—\s]+$/.test(r.postponedTo) ? `<dt>الموعد الجديد</dt><dd>${esc(r.postponedTo)}</dd>` : ''}
          ${r.lastDate ? `<dt>اتسجل</dt><dd>${esc(r.lastDate)}${r.lastBy ? ' · ' + esc(r.lastBy) : ''}</dd>` : ''}
        </dl>`;
    }
    if (isFailed(s)) {
      const r = failureInfo(f.history);
      $('#failBody', sh.el).innerHTML = `
        <dl class="kv" style="padding:8px 0 0">
          <dt>سبب عدم الاستلام</dt><dd>${esc(r.reason || 'مش مكتوب سبب')}</dd>
          ${r.note ? `<dt>ملاحظة المندوب</dt><dd>${esc(r.note)}</dd>` : ''}
          ${r.reasonDate ? `<dt>التاريخ</dt><dd>${esc(r.reasonDate)}</dd>` : ''}
          <dt>الشحن المدفوع</dt><dd id="feeDD">${loading().replace('spinner', 'spinner sm')}</dd>
        </dl>`;
      Hazem.returnFees([s.waybill]).then(m => {
        const op = m[s.waybill]; const dd = $('#feeDD', sh.el); if (!dd) return;
        dd.innerHTML = op ? `${feeBadge(op)}<div class="tiny" style="margin-top:4px">تكلفة الشحن المحددة ${money(op.fee)} ج.م · المدفوع ${money(op.paid)} ج.م</div>` : '<span class="muted small">لسه مفيش عملية ارتجاع في الحسابات</span>';
      }).catch(() => { const dd = $('#feeDD', sh.el); if (dd) dd.textContent = '—'; });
    }
  }).catch(() => { const h = $('#hist', sh.el); if (h) h.innerHTML = '<div class="empty small">تعذر تحميل المسار</div>'; const fb = $('#failBody', sh.el); if (fb) fb.innerHTML = '<div class="small muted">تعذر التحميل</div>'; });
}

// Generic edit: render the site's own edit form natively.
async function openEdit(s) {
  const sh = sheet('تعديل ' + s.waybill, loading(), [['إلغاء', () => sh.close()], ['حفظ التعديلات', save, 'primary']]);
  let form;
  try { form = await Hazem.editForm(s.id); } catch (e) { sh.close(); return handleErr(e); }
  const visible = form.fields.filter(f => f.name && f.type !== 'hidden' && f.type !== 'file' && f.type !== 'submit' && f.type !== 'button' && !/print_type|^item_|stock/.test(f.name));
  const initial = {}; form.fields.forEach(f => { if (f.name) initial[f.name] = f.value; });
  const canShop = Shopify.ready && !!s.order_id;
  $('.sheet-b', sh.el).innerHTML = `<div class="card card-pad">${visible.map(fieldHTML).join('')}</div>
    ${canShop ? `<label class="card card-pad row" style="gap:10px;align-items:center"><input type="checkbox" id="shopSync" class="switch" checked><span class="grow"><b>عدّل أوردر شوبيفاي #${esc(s.order_id)} كمان</b><div class="tiny">الاسم والموبايل والعنوان والمنطقة لو اتغيّروا</div></span></label>` : ''}`;
  async function save(btn) {
    const values = {};
    $$('[data-name]', sh.el).forEach(el => { values[el.dataset.name] = el.type === 'checkbox' ? el.checked : el.value; });
    // The portal's required (red-star) fields.
    const req = [['sector_id', 'المنطقة'], ['client_name', 'اسم المرسل إليه'], ['phone_1', 'موبايل 1'], ['address', 'العنوان']];
    const empty = (k, v) => !String(v ?? '').trim() || (k === 'sector_id' && /^0?$/.test(String(v).trim()));
    const missing = req.filter(([k]) => k in values && empty(k, values[k]));
    const msgs = missing.map(([, l]) => l);
    if ('phone_1' in values && !empty('phone_1', values.phone_1) && !validPhone(values.phone_1)) { msgs.push('موبايل 1 مش رقم صحيح'); missing.push(['phone_1']); }
    $$('.field.err', sh.el).forEach(el => el.classList.remove('err'));
    if (msgs.length) {
      missing.forEach(([k]) => $(`[data-name="${k}"]`, sh.el)?.closest('.field')?.classList.add('err'));
      return toast('ناقص: ' + msgs.join('، '), 'err');
    }
    btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
    try {
      const r = await Hazem.submitForm(form, values);
      if (r.alert && /خطأ|error|لا يمكن|غير/i.test(r.alert)) throw new Error(r.alert);
      let shopMsg = '';
      if (canShop && $('#shopSync', sh.el)?.checked) {
        const patch = {};
        if ('client_name' in values && values.client_name !== initial.client_name) patch.name = values.client_name;
        if ('phone_1' in values && values.phone_1 !== initial.phone_1) patch.phone = values.phone_1;
        if ('address' in values && values.address !== initial.address) patch.address = values.address;
        if ('sector_id' in values && values.sector_id !== initial.sector_id) { const o = $('[data-name="sector_id"]', sh.el)?.selectedOptions?.[0]; if (o) patch.city = clean(o.textContent).split(' - ')[0]; }
        if (Object.keys(patch).length) {
          try {
            const o = await Shopify.findOrder(s.order_id, s.waybill);
            if (!o) shopMsg = ' — بس الأوردر مش لاقيه على شوبيفاي';
            else { await Shopify.updateShipping(o, patch); shopMsg = ' وفي شوبيفاي ✓'; }
          } catch (e2) { shopMsg = ' — بس شوبيفاي رفض: ' + String(e2.message).slice(0, 80); }
        }
      }
      toast('تم حفظ التعديلات' + shopMsg, shopMsg.includes('بس') ? '' : 'ok'); sh.close(); loadShipments();
    } catch (e) { btn.disabled = false; btn.textContent = 'حفظ التعديلات'; handleErr(e); }
  }
}
function fieldHTML(f) {
  const lbl = esc(f.label || f.name);
  const dis = (f.disabled || f.readonly) ? 'readonly' : '';
  if (f.type === 'select') return `<div class="field"><label>${lbl}</label><select data-name="${esc(f.name)}" ${f.disabled ? 'disabled' : ''}>${f.options.map(o => `<option value="${esc(o.value)}" ${o.value === f.value ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select></div>`;
  if (f.type === 'textarea') return `<div class="field"><label>${lbl}</label><textarea data-name="${esc(f.name)}" ${dis}>${esc(f.value)}</textarea></div>`;
  if (f.type === 'checkbox') return `<div class="field row"><input type="checkbox" style="width:auto;min-height:0" data-name="${esc(f.name)}" ${f.checked ? 'checked' : ''}><label style="margin:0">${lbl}</label></div>`;
  const t = f.type === 'number' ? 'inputmode="decimal"' : /phone|mobile/i.test(f.name) ? 'inputmode="tel"' : '';
  return `<div class="field"><label>${lbl}</label><input data-name="${esc(f.name)}" value="${esc(f.value)}" ${t} ${dis}></div>`;
}

// ---------- Excel ----------
async function saveAndShare(wb, name) {
  const b64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
  const P = window.Capacitor?.Plugins;
  if (P?.Filesystem && P?.Share) {
    const w = await P.Filesystem.writeFile({ path: name, data: b64, directory: 'CACHE' });
    await P.Share.share({ title: name, files: [w.uri] });
  } else XLSX.writeFile(wb, name);
}
async function exportExcel() {
  const picked = state.selMode && state.sel?.size ? state.shipments.filter(r => state.sel.has(r.id)) : null;
  const rows = picked || state.shipments;
  if (!rows.length) return toast('مفيش شحنات في القائمة دي');
  toast(picked ? `بنزّل ${rows.length} شحنة محددة بس` : `بنزّل كل القايمة (${rows.length} شحنة)`);
  const data = rows.map(s => ({
    'رقم البوليصة': s.waybill, 'التاريخ': s.date, 'المرسل اليه': s.consignee, 'موبايل 1': s.phone1, 'موبايل 2': s.phone2,
    'المنطقة': s.area, 'العنوان': s.address, 'اسم المنتج': s.product, 'رقم الطلب': s.order_id, 'مبلغ التحصيل': Number(String(s.cod).replace(/[^\d.-]/g, '')) || 0,
    'حالة الشحنة': s.status, 'نوع الخدمة': s.service, 'اخر تغيير بالحالة': s.last_change, 'موعد التأجيل': s.postponed, 'الملاحظات': s.notes,
  }));
  const ws = XLSX.utils.json_to_sheet(data); ws['!cols'] = Object.keys(data[0]).map(k => ({ wch: Math.max(10, k.length + 4) }));
  ws['!views'] = [{ RTL: true }];
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'الشحنات'); wb.Workbook = { Views: [{ RTL: true }] };
  try { await saveAndShare(wb, `shipments-${ymd(new Date())}.xlsx`); } catch (e) { if (!/cancel/i.test(e.message)) handleErr(e); }
}
function openUpload() {
  const sh = sheet('رفع شيت إكسيل', `
    <div class="banner info">${ic('file', 'width="20"')}<div>استخدم فورم الإكسيل الرسمي بتاع الشركة. كل صف = شحنة.</div></div>
    <div class="card card-pad">
      <label class="btn block" style="border:1.5px dashed var(--border-strong);box-shadow:none;min-height:90px;flex-direction:column">${ic('upload')}<span id="fName">اختار ملف الإكسيل</span>
        <input type="file" id="xFile" accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" hidden></label>
      <a class="btn sm" style="margin-top:10px" href="${HH_REAL}/templates/default/uploads/excel/6f66f21d98.xlsx" target="_blank">${ic('download')}تنزيل الفورم الفاضي</a>
    </div><div id="upRes"></div>`, [['رفع', upload, 'primary']]);
  let file = null;
  $('#xFile', sh.el).onchange = e => { file = e.target.files[0]; $('#fName', sh.el).textContent = file ? file.name : 'اختار ملف الإكسيل'; };
  // Before uploading: check every row (required fields, valid mobile, area from the portal's list),
  // fix small mistakes, and warn about duplicates. Rows with errors are never uploaded.
  async function upload(btn) {
    if (!file) return toast('اختار الملف الأول');
    btn.disabled = true; btn.innerHTML = '<div class="spinner"></div> بيراجع الشيت…';
    try {
      const buf = await file.arrayBuffer();
      const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', buf))].map(b => b.toString(16).padStart(2, '0')).join('');
      const hashes = await Store.get('upload_hashes', {});
      const wb = XLSX.read(buf, { type: 'array' }), ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      const hi = rows.findIndex(r => r.some(c => /phone_?1|موبايل/i.test(String(c))));
      if (hi < 0) throw new Error('مش لاقي عمود الموبايل — استخدم فورم الإكسيل الرسمي');
      const col = sheetColumns(rows[hi]);
      const data = rows.slice(hi + 1).filter(r => r.some(c => String(c).trim()));
      if (!data.length) throw new Error('الشيت فاضي');
      state.custHist = null;
      const [areas] = await Promise.all([templateAreas().catch(() => null), loadCustomerHistory()]);
      const seenInFile = new Set(), checked = [];
      for (const r of data) {
        const c = checkSheetRow(r, col, areas);
        const p = findPhones(String(c.fixed[col.phone1] ?? ''))[0];
        const open = p && openShipmentFor(p), twice = p && seenInFile.has(p); if (p) seenInFile.add(p);
        checked.push({ ...c, r, p, name: clean(String(r[col.name] ?? '')), dup: open ? `متسجل بالفعل ${open}` : twice ? 'مكرر جوه الشيت' : '' });
      }
      const bad = checked.filter(x => x.errors.length), dups = checked.filter(x => !x.errors.length && x.dup);
      const fixedN = checked.filter(x => x.fixes.length && !x.errors.length).length, prev = hashes[hash];
      const okRows = checked.filter(x => !x.errors.length && !x.dup), okWithDup = checked.filter(x => !x.errors.length);
      const build = list => {
        const nwb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(nwb, XLSX.utils.aoa_to_sheet(rows.slice(0, hi + 1).concat(list.map(x => x.fixed))), wb.SheetNames[0]);
        wb.SheetNames.slice(1).forEach(n => XLSX.utils.book_append_sheet(nwb, wb.Sheets[n], n));
        return new File([XLSX.write(nwb, { bookType: 'xlsx', type: 'array' })], file.name.replace(/\.\w+$/, '') + '-checked.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      };
      if (!bad.length && !dups.length && !prev && !fixedN) return await doUpload(file, btn, hash);
      btn.disabled = false; btn.textContent = 'رفع';
      const rowCard = (x, color, lines) => `<div class="item"><div class="grow"><div class="row between"><b>${esc(x.name || 'بدون اسم')}</b><span class="ltr small">${esc(x.p || '')}</span></div>${lines.map(l => `<div class="small" style="color:${color}">• ${esc(l)}</div>`).join('')}</div></div>`;
      $('#upRes', sh.el).innerHTML = `
        <div class="card card-pad">
          <div class="h2" style="margin-bottom:8px">مراجعة الشيت: ${data.length} شحنة</div>
          <div class="row wrap" style="gap:6px">
            <span class="badge success">✓ ${okRows.length} سليمة</span>
            ${bad.length ? `<span class="badge critical">✕ ${bad.length} فيها أخطاء</span>` : ''}
            ${dups.length ? `<span class="badge canary">⚠️ ${dups.length} مكررة</span>` : ''}
            ${fixedN ? `<span class="badge info">🔧 ${fixedN} اتصلحت تلقائي</span>` : ''}
          </div>
          ${prev ? `<div class="banner warning" style="margin:10px 0 0"><b>⚠️ الملف ده نفسه اترفع قبل كده</b> (${esc(prev)})</div>` : ''}
          ${!areas ? `<div class="tiny" style="margin-top:8px">ملحوظة: مقدرتش أجيب قايمة المناطق من الموقع، فاتأكدت إن المنطقة مش فاضية بس.</div>` : ''}
        </div>
        ${bad.length ? `<div class="section-title" style="color:var(--critical)">✕ فيها أخطاء — مش هتترفع، صلّحها في الشيت وارفعها تاني</div><div class="list">${bad.map(x => rowCard(x, 'var(--critical)', x.errors)).join('')}</div>` : ''}
        ${dups.length ? `<div class="section-title" style="color:var(--warning)">⚠️ مكررة</div><div class="list">${dups.map(x => rowCard(x, 'var(--warning)', [x.dup])).join('')}</div>` : ''}
        ${fixedN ? `<div class="section-title" style="color:var(--info)">🔧 اتصلحت تلقائي (عشان تطابق الموقع)</div><div class="list">${checked.filter(x => x.fixes.length && !x.errors.length).map(x => rowCard(x, 'var(--info)', x.fixes)).join('')}</div>` : ''}
        <div class="row" style="gap:8px">
          ${okRows.length ? `<button class="btn primary grow" id="upOk">ارفع السليم (${okRows.length})</button>` : ''}
          ${dups.length ? `<button class="btn grow" id="upDup">ارفع مع المكرر (${okWithDup.length})</button>` : ''}
        </div>
        ${!okWithDup.length ? '<div class="banner critical" style="margin-top:8px">مفيش ولا صف سليم يترفع — صلّح الأخطاء في الشيت.</div>' : ''}`;
      if ($('#upOk', sh.el)) $('#upOk', sh.el).onclick = () => doUpload(build(okRows), $('#upOk', sh.el), hash);
      if ($('#upDup', sh.el)) $('#upDup', sh.el).onclick = () => { if (confirm('متأكد؟ الشحنات المكررة هتتسجل تاني.')) doUpload(build(okWithDup), $('#upDup', sh.el), hash); };
      $('#upRes', sh.el).scrollIntoView({ behavior: 'smooth' });
    } catch (e) { handleErr(e); btn.disabled = false; btn.textContent = 'رفع'; }
  }
  async function doUpload(f, btn, hash) {
    const label = btn.textContent;
    btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
    try {
      const r = await Hazem.uploadExcel(f);
      const hashes = await Store.get('upload_hashes', {}); hashes[hash] = new Date().toLocaleString('ar-EG-u-nu-latn', { dateStyle: 'medium', timeStyle: 'short' }); await Store.set('upload_hashes', hashes);
      state.custHist = null;
      $('#upRes', sh.el).innerHTML = `
        ${r.alert ? `<div class="banner ${/خطأ|error/i.test(r.alert) ? 'critical' : 'success'}">${esc(r.alert)}</div>` : ''}
        <div class="section-title">${r.rows.length} شحنة في الشيت</div>
        <div class="list">${r.rows.map(x => `<div class="item"><div class="grow"><div class="row between"><b>${esc(x['المرسل اليه'] || '')}</b><b>${money(x['مبلغ التحصيل'])}</b></div><div class="meta row between"><span class="ltr">${esc(x['رقم البوليصة'] || '')}</span><span>${esc(x['المنطقة'] || '')}</span></div></div></div>`).join('')}</div>`;
      toast(r.rows.length ? 'تم رفع الشيت' : 'اترفع، راجع النتيجة', 'ok');
    } catch (e) { handleErr(e); }
    btn.disabled = false; btn.textContent = label;
  }
}

// ---------- Add shipment (manual or from Shopify review) ----------
async function ensureSectors() {
  if (state.sectors) return state.sectors;
  const r = await Hazem.addForm();
  state.sectors = r.sectors; state.services = r.services; state.addBase = r.form;
  return state.sectors;
}
function sectorPicker(current, onPick) {
  const sh = sheet('اختار المنطقة', `<div class="searchbox">${ic('search')}<input class="input" id="secQ" placeholder="ابحث بالمنطقة أو المحافظة" autofocus></div><div class="list" id="secL"></div>`);
  const render = q => {
    const n = normAr(q);
    const list = state.sectors.filter(s => !n || normAr(s.label).includes(n)).slice(0, 80);
    $('#secL', sh.el).innerHTML = list.map(s => `<button class="item" data-id="${s.id}"><div class="grow"><b>${esc(s.area)}</b><div class="meta">${esc(s.gov)}</div></div>${s.id === current ? ic('check', 'width="20"') : ''}</button>`).join('') || '<div class="empty small">مفيش نتايج</div>';
    $$('#secL .item', sh.el).forEach(b => b.onclick = () => { onPick(state.sectors.find(s => s.id === b.dataset.id)); sh.close(); });
  };
  $('#secQ', sh.el).oninput = e => render(e.target.value); render('');
}
async function openAdd(prefill = null, onDone = null) {
  const sh = sheet(prefill?.order_id ? 'مراجعة أوردر #' + prefill.order_id : 'شحنة جديدة', loading(), [['إلغاء', () => sh.close()], [onDone ? 'حفظ' : 'إضافة الشحنة', submit, 'primary']]);
  try { await ensureSectors(); } catch (e) { sh.close(); return handleErr(e); }
  const v = { service_type: '1', quantity: '1', ...(prefill || {}) };
  const sec = state.sectors.find(s => s.id === v.sector_id);
  $('.sheet-b', sh.el).innerHTML = `
    <div class="card card-pad">
      <div class="h2" style="margin-bottom:10px">بيانات العميل</div>
      <div class="field"><label>اسم العميل *</label><input data-k="client_name" value="${esc(v.client_name)}"></div>
      <div class="row"><div class="field grow"><label>موبايل 1 *</label><input data-k="phone_1" inputmode="tel" class="ltr" value="${esc(v.phone_1)}"></div>
      <div class="field grow"><label>موبايل 2</label><input data-k="phone_2" inputmode="tel" class="ltr" value="${esc(v.phone_2)}"></div></div>
      <div class="field"><label>المنطقة *</label><button class="input pick" id="secBtn" type="button"><span>${sec ? esc(sec.area + ' - ' + sec.gov) : '<span class="muted">اختار المنطقة</span>'}</span>${ic('chev', 'class="chev" style="transform:rotate(90deg)"')}</button><input type="hidden" data-k="sector_id" value="${esc(v.sector_id || '')}"></div>
      <div class="field"><label>العنوان *</label><textarea data-k="address">${esc(v.address)}</textarea></div>
    </div>
    <div class="card card-pad">
      <div class="h2" style="margin-bottom:10px">بيانات الشحنة</div>
      <div class="field"><label>اسم المنتج</label><textarea data-k="product_name" style="min-height:52px">${esc(v.product_name)}</textarea></div>
      <div class="row"><div class="field grow"><label>مبلغ التحصيل (شامل الشحن) *</label><input data-k="price" inputmode="decimal" value="${esc(v.price)}"></div>
      <div class="field" style="width:90px"><label>العدد</label><input data-k="quantity" inputmode="numeric" value="${esc(v.quantity)}"></div></div>
      <div class="row"><div class="field grow"><label>نوع الخدمة</label><select data-k="service_type">${state.services.map(s => `<option value="${s.id}" ${s.id === v.service_type ? 'selected' : ''}>${esc(s.label)}</option>`).join('')}</select></div>
      <div class="field" style="width:110px"><label>رقم الطلب</label><input data-k="order_id" value="${esc(v.order_id)}"></div></div>
      <div class="field"><label>ملاحظات</label><textarea data-k="notes" style="min-height:52px">${esc(v.notes)}</textarea></div>
    </div>`;
  $('#secBtn', sh.el).onclick = () => sectorPicker($('[data-k=sector_id]', sh.el).value, s => {
    $('[data-k=sector_id]', sh.el).value = s.id; $('#secBtn span', sh.el).textContent = s.area + ' - ' + s.gov;
  });
  async function submit(btn) {
    const vals = {}; $$('[data-k]', sh.el).forEach(el => vals[el.dataset.k] = el.value.trim());
    vals.product_desc = v.product_desc || '';
    const miss = [['client_name', 'اسم العميل'], ['phone_1', 'الموبايل'], ['sector_id', 'المنطقة'], ['address', 'العنوان'], ['price', 'مبلغ التحصيل']].find(([k]) => !vals[k]);
    if (miss) return toast('ناقص: ' + miss[1], 'err');
    if (!/^01[0125]\d{8}$/.test(vals.phone_1)) return toast('رقم الموبايل لازم يكون 11 رقم ويبدأ بـ 01', 'err');
    if (onDone) { onDone(vals); sh.close(); return; }
    btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
    try { await Hazem.addShipment(vals, state.addBase); toast('تمت إضافة الشحنة', 'ok'); sh.close(); }
    catch (e) { btn.disabled = false; btn.textContent = 'إضافة الشحنة'; handleErr(e); }
  }
}

// ---------- Shopify ----------
async function viewShop() {
  setTitle('الأوردرات', [['gear', openShopSettings]]);
  const v = $('#view');
  // Two sources, each with the same three stages.
  state.orderSrc = state.orderSrc || 'shopify';
  await waLoad();
  const waCount = st => state.waDrafts.filter(d => d.stage === st).length;
  v.innerHTML = `
    <div class="src-tabs">
      <button data-src="shopify" class="${state.orderSrc === 'shopify' ? 'on' : ''}">🛍️ شوبيفاي${state.shopCount ? ` <span class="dot-n">${state.shopCount}</span>` : ''}</button>
      <button data-src="wa" class="${state.orderSrc === 'wa' ? 'on' : ''}">💬 واتساب وماسنجر${waCount('confirm') + waCount('ready') ? ` <span class="dot-n">${waCount('confirm') + waCount('ready')}</span>` : ''}</button>
    </div>
    <div class="seg">${[['confirm', 'محتاج تأكيد'], ['ready', 'جاهز للشحن'], ['sent', 'اتبعت للشحن']].map(([k, l]) => `<button data-t="${k}" class="${state.shopTab === k ? 'on' : ''}">${l}${state.orderSrc === 'wa' && k !== 'sent' && waCount(k) ? ` (${waCount(k)})` : ''}</button>`).join('')}</div>
    <div id="shopBody">${loading()}</div>`;
  $$('.seg button', v).forEach(b => b.onclick = () => { state.shopTab = b.dataset.t; viewShop(); });
  $$('.src-tabs button', v).forEach(b => b.onclick = () => { state.orderSrc = b.dataset.src; viewShop(); });
  try {
    state.waLog = state.waLog || await Store.get('wa_log', {});
    if (state.orderSrc === 'wa') return await renderWaSection($('#shopBody'));
    if (!Shopify.ready) {
      $('#shopBody').innerHTML = `<div class="card empty">${ic('bag')}<div class="h2" style="margin:6px 0">اربط متجر شوبيفاي</div><div class="small" style="margin-bottom:14px">بعد الربط هتشوف الأوردرات الجديدة هنا وتبعتها لحازم حلان بضغطة.</div><button class="btn primary" onclick="openShopSettings()">ربط المتجر</button></div>`;
      return;
    }
    if (state.shopTab === 'confirm') await renderConfirm(); else if (state.shopTab === 'ready') await renderReady(); else await renderSent();
  } catch (e) { $('#shopBody').innerHTML = `<div class="banner critical">${esc(e.message)}</div>`; }
}

async function renderReady() {
  let [orders] = await Promise.all([Shopify.toShip(state.fulfWindow ?? 2), ensureSectors().catch(() => []), loadCustomerHistory()]);
  // Only orders marked Fulfilled recently: older fulfilled orders were shipped the old way.
  const fw = state.fulfWindow ?? 2;
  if (Shopify.readyMode === 'fulfilled' && fw) {
    const since = new Date(); since.setHours(0, 0, 0, 0); since.setDate(since.getDate() - (fw - 1));
    orders = orders.filter(o => { const f = (o.fulfillments || []).map(x => x.createdAt).sort().pop(); return f && new Date(f) >= since; });
  }
  state.orders = orders.map(o => {
    const base = orderToShipment(o, state.sectors || []);
    const ov = state.overrides[o.name];
    return { o, s: ov ? { ...base, ...ov, _confident: true } : base, edited: !!ov };
  });
  state.selected = new Set([...state.selected].filter(n => state.orders.some(x => x.o.name === n)));
  const dot = $('#shopDot'); if (dot) { dot.hidden = !orders.length; dot.textContent = orders.length; }
  const body = $('#shopBody');
  if (!state.orders.length) {
    body.innerHTML = `${Shopify.readyMode === 'fulfilled' ? `<div class="chips">${[[1, 'اتعملت Fulfilled النهارده'], [2, 'آخر يومين'], [7, 'آخر أسبوع'], [0, 'الكل']].map(([k, l]) => `<button class="chip ${(state.fulfWindow ?? 2) === k ? 'on' : ''}" data-fw="${k}">${l}</button>`).join('')}</div>` : ''}<div class="card empty">${ic('check')}<div>مفيش أوردرات مستنية الشحن 🎉</div>${Shopify.readyMode === 'fulfilled' ? '<div class="small" style="margin-top:6px">الأوردرات بتظهر هنا لما تعملها <b>Fulfilled</b> على شوبيفاي</div>' : ''}</div>`;
    $$('[data-fw]', body).forEach(b => b.onclick = () => { state.fulfWindow = Number(b.dataset.fw); $('#shopBody').innerHTML = loading(); renderReady(); });
    return;
  }
  const allSel = state.orders.length === state.selected.size;
  body.innerHTML = `
    ${Shopify.readyMode === 'fulfilled' ? `<div class="chips">${[[1, 'اتعملت Fulfilled النهارده'], [2, 'آخر يومين'], [7, 'آخر أسبوع'], [0, 'الكل']].map(([k, l]) => `<button class="chip ${(state.fulfWindow ?? 2) === k ? 'on' : ''}" data-fw="${k}">${l}</button>`).join('')}</div>` : ''}
    <div class="row between" style="margin:0 4px 8px"><span class="small muted">${state.orders.length} أوردر · ${money(state.orders.reduce((a, x) => a + num(x.s.price), 0))} ج.م · ${Shopify.readyMode === 'fulfilled' ? 'متأكد (Fulfilled) ومستني يتسجل على حازم حلان' : 'مستني الشحن'}</span><button class="btn sm" id="selAll">${allSel ? 'إلغاء التحديد' : 'تحديد الكل'}</button></div>
    <div class="list">${state.orders.map(({ o, s }, i) => {
      const areaBadge = !s.sector_id ? '<span class="badge critical">اختار المنطقة</span>' : s._confident ? `<span class="badge success">${esc((state.sectors.find(x => x.id === s.sector_id) || {}).area || '')}</span>` : `<span class="badge attention">راجع: ${esc((state.sectors.find(x => x.id === s.sector_id) || {}).area || '')}</span>`;
      const phoneBadge = (s.phone_1 ? historyBadge(s.phone_1) : '<span class="badge critical">مفيش موبايل</span>') + waBadge(o.name);
      return `<div class="item ${state.selected.has(o.name) ? 'selected' : ''}" data-i="${i}">
        <span class="check ${state.selected.has(o.name) ? 'on' : ''}" data-sel="${i}"></span>
        <div class="grow" data-open="${i}">
          <div class="row between"><span class="title">${esc(o.name)} · ${esc(s.client_name)}</span><span class="amount">${money(s.price)} <span class="tiny">ج.م</span></span></div>
          <div class="meta ellipsis">${esc(s.product_name)}</div>
          <div class="row wrap" style="margin-top:6px;gap:6px">${areaBadge}${phoneBadge}${o.displayFinancialStatus === 'PAID' ? '<span class="badge info">مدفوع أونلاين</span>' : ''}<span class="tiny">${new Date(o.createdAt).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'short' })}</span></div>
        </div></div>`;
    }).join('')}</div>
    <div style="height:70px"></div>
    <div class="bottom-bar"><button class="btn accent" id="shipBtn" ${state.selected.size ? '' : 'disabled'}>${ic('truck')}ابعت ${state.selected.size || ''} لحازم حلان</button></div>`;
  $$('[data-fw]', body).forEach(b => b.onclick = () => { state.fulfWindow = Number(b.dataset.fw); state.selected = new Set(); $('#shopBody').innerHTML = loading(); renderReady(); });
  $('#selAll').onclick = () => { state.selected = allSel ? new Set() : new Set(state.orders.map(x => x.o.name)); renderReady(); };
  $$('[data-sel]', body).forEach(c => c.onclick = e => { e.stopPropagation(); const n = state.orders[c.dataset.sel].o.name; state.selected.has(n) ? state.selected.delete(n) : state.selected.add(n); renderReadyQuick(); });
  $$('[data-open]', body).forEach(c => c.onclick = () => {
    const x = state.orders[c.dataset.open];
    openAdd(x.s, async vals => { state.overrides[x.o.name] = vals; await Store.set('overrides', state.overrides); state.selected.add(x.o.name); renderReady(); });
  });
  $('#shipBtn').onclick = shipSelected;
}
function renderReadyQuick() {
  $$('#shopBody .item').forEach(it => { const n = state.orders[it.dataset.i].o.name; const on = state.selected.has(n); it.classList.toggle('selected', on); it.querySelector('.check').classList.toggle('on', on); });
  const b = $('#shipBtn'); b.disabled = !state.selected.size; b.innerHTML = `${ic('truck')}ابعت ${state.selected.size || ''} لحازم حلان`;
}

// Orders waiting for the customer's confirmation (not yet Fulfilled).
async function renderConfirm() {
  const [orders] = await Promise.all([Shopify.toConfirm(), ensureSectors().catch(() => []), loadCustomerHistory()]);
  const body = $('#shopBody');
  state.confirmOrders = orders;
  if (!orders.length) { body.innerHTML = `<div class="card empty">${ic('check')}<div>مفيش أوردرات مستنية تأكيد 🎉</div></div>`; return; }
  const pending = orders.filter(o => !state.waLog[o.name]);
  body.innerHTML = `
    <div class="row between" style="margin:0 4px 8px"><span class="small muted">${orders.length} أوردر · ${pending.length} لسه متبعتلهمش</span>${pending.length ? `<button class="btn sm wa" id="waQueue">${ic('whatsapp')} تأكيد سريع (${pending.length})</button>` : ''}</div>
    <div class="list">${orders.map((o, i) => {
      const s = orderToShipment(o, state.sectors || []);
      return `<div class="item" data-i="${i}"><div class="grow">
        <div class="row between"><span class="title">${esc(o.name)} · ${esc(s.client_name)}</span><span class="amount">${money(s.price)} <span class="tiny">ج.م</span></span></div>
        <div class="meta ellipsis">${esc(s.product_name)}</div>
        <div class="row wrap" style="margin-top:6px;gap:6px">${s.phone_1 ? historyBadge(s.phone_1) : '<span class="badge critical">مفيش موبايل</span>'}${waBadge(o.name)}<span class="tiny">${new Date(o.createdAt).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'short' })}</span></div>
        <div class="row" style="margin-top:10px;gap:8px"><button class="btn sm wa grow" data-wa="${i}">${ic('whatsapp')} ابعت تأكيد</button><button class="btn sm grow" data-ok="${i}">${ic('check')} العميل أكّد</button></div>
      </div></div>`;
    }).join('')}</div>`;
  $$('[data-wa]', body).forEach(b => b.onclick = () => { const o = orders[b.dataset.wa]; waCompose({ order: o }, 'confirm', async k => { await markWa(o.name, k); renderConfirm(); }); });
  $$('[data-ok]', body).forEach(b => b.onclick = () => confirmOrder(orders[b.dataset.ok], b));
  if ($('#waQueue')) $('#waQueue').onclick = () => waQueue(pending);
}
// Customer confirmed -> mark Fulfilled on Shopify so it moves to "ready to ship".
async function confirmOrder(o, btn) {
  if (!confirm(`العميل أكّد ${o.name}؟ هيتعمل Fulfilled على شوبيفاي وينتقل لـ"جاهز للشحن".`)) return;
  btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
  try { await Shopify.fulfill(o.id, null); toast(`${o.name} اتأكد ✓`, 'ok'); renderConfirm(); }
  catch (e) { btn.disabled = false; btn.textContent = 'العميل أكّد'; toast(/access|permission|scope/i.test(e.message) ? 'محتاج صلاحية write_merchant_managed_fulfillment_orders في تطبيق شوبيفاي' : e.message, 'err'); }
}
// Go through customers one by one: open WhatsApp, come back, next.
function waQueue(list) {
  let i = 0;
  const sh = sheet('تأكيد سريع', '<div id="qBody"></div>', [['إنهاء', () => { sh.close(); renderConfirm(); }], ['التالي ←', () => { i++; show(); }]]);
  const show = async () => {
    if (i >= list.length) { $('#qBody', sh.el).innerHTML = `<div class="card empty">${ic('check')}<div>خلصت الكل 👏</div></div>`; return; }
    const o = list[i], d = await waData({ order: o }), c = await WA.cfg();
    const text = WA.fill(c.templates.confirm.text, d, 'confirm');
    $('#qBody', sh.el).innerHTML = `
      <div class="small muted" style="margin:0 4px 8px">${i + 1} من ${list.length}</div>
      <div class="card card-pad"><div class="row between"><b>${esc(o.name)} · ${esc(o.shippingAddress?.name || '')}</b><b>${esc(d['المبلغ'])} ج.م</b></div>
      <div class="small muted ltr" style="text-align:right">${esc(d.phone || 'مفيش موبايل')}</div>
      <div class="field" style="margin:10px 0 0"><textarea id="qMsg" style="min-height:200px;line-height:1.7">${esc(text)}</textarea></div>
      <button class="btn wa block" id="qSend" style="margin-top:10px">${ic('whatsapp')} افتح واتساب وابعت</button></div>`;
    $('#qSend', sh.el).onclick = async () => {
      await WA.send(d.phone, $('#qMsg', sh.el).value); await markWa(o.name, 'confirm');
      // A random pause between messages so the number doesn't look like a bulk sender.
      let left = 25 + Math.floor(Math.random() * 20);
      const nextBtn = $('.sheet-f [data-b="1"]', sh.el); nextBtn.disabled = true;
      $('#qSend', sh.el).outerHTML = '<div class="banner success" id="qWait" style="margin-top:10px"></div>';
      const tick = () => { const w = $('#qWait', sh.el); if (!w) return;
        if (left <= 0) { w.innerHTML = 'اتبعت ✓ — دوس <b>التالي</b>'; nextBtn.disabled = false; return; }
        w.innerHTML = `اتبعت ✓ — استنى <b>${left}</b> ثانية قبل اللي بعده عشان الواتساب ميعتبرهاش رسايل جماعية`; left--; setTimeout(tick, 1000); };
      tick();
    };
  };
  show();
}

// Past deliveries/refusals per phone, from recent Hazem shipments (helps spot risky customers).
async function loadCustomerHistory() {
  if (state.custHist && Date.now() - state.custHist.t < 10 * 60e3) return;
  try {
    const from = new Date(); from.setDate(from.getDate() - 180);
    const rows = await Hazem.shipments({ items: 3000, from: ymd(from), to: ymd(new Date()) });
    const m = {};
    for (const r of rows) for (const p of findPhones(r.phone1, r.phone2)) {
      const x = m[p] || (m[p] = { delivered: 0, returned: 0, open: [] });
      if (r.category === 'delivered') x.delivered++; else if (isFailed(r)) x.returned++;
      else if (['active', 'postponed'].includes(r.category)) x.open.push(r.waybill);
    }
    state.custHist = { t: Date.now(), m };
  } catch { state.custHist = { t: Date.now(), m: {} }; }
}
function historyBadge(phone) {
  const h = state.custHist?.m[phone]; if (!h) return '';
  const open = h.open?.length ? `<span class="badge canary">📦 متسجل على حازم بالفعل (${esc(h.open[0])})</span>` : '';
  if (h.returned) return open + `<span class="badge critical">⚠️ رفض قبل كده ${h.returned} مرة</span>`;
  if (h.delivered) return open + `<span class="badge success">استلم قبل كده ${h.delivered}</span>`;
  return open;
}
// Phones that already have an open shipment on Hazem (to catch double entries).
const openShipmentFor = phone => state.custHist?.m[phone]?.open?.[0] || '';

async function shipSelected() {
  const list = state.orders.filter(x => state.selected.has(x.o.name));
  const bad = list.filter(x => !x.s.sector_id || !x.s.phone_1 || !x.s.address);
  if (bad.length) return toast(`راجع ${bad.map(x => x.o.name).join('، ')}: ناقص منطقة أو موبايل`, 'err');
  const already = list.filter(x => openShipmentFor(x.s.phone_1));
  if (already.length && !confirm(`⚠️ ${already.length} من الأوردرات دي ليهم شحنة مفتوحة على حازم بنفس رقم الموبايل:\n${already.map(x => `${x.o.name} ← ${openShipmentFor(x.s.phone_1)}`).join('\n')}\n\nلو دي نفس الأوردرات هتتسجل مرتين. تكمّل؟`)) return;
  const sh = sheet('جاري الإرسال', `<div class="card card-pad"><div class="progress"><span id="pg" style="width:0"></span></div><div class="log" id="plog" style="margin-top:10px"></div></div>`, [['تم', () => { sh.close(); viewShop(); }, 'primary']]);
  const log = (t, cls = '') => { $('#plog', sh.el).insertAdjacentHTML('beforeend', `<div class="${cls}">${t}</div>`); };
  let ok = 0;
  for (let i = 0; i < list.length; i++) {
    const { o, s } = list[i];
    try {
      const vals = Object.fromEntries(Object.entries(s).filter(([k]) => !k.startsWith('_')));
      // Avoid duplicates: if a shipment with this order number already exists, just link it.
      let found = (await Hazem.shipments({ order_id: vals.order_id, items: 20 })).find(r => r.order_id === vals.order_id);
      if (!found) {
        await Hazem.addShipment(vals, state.addBase);
        found = (await Hazem.shipments({ order_id: vals.order_id, items: 20 })).find(r => r.order_id === vals.order_id);
      }
      if (!found) throw new Error('الشحنة اتبعتت بس مش لاقي رقم البوليصة — راجع الموقع');
      await Shopify.tag(o.id, [TAG_SENT, 'HZM-' + found.waybill]);
      state.sentMap[o.name] = { waybill: found.waybill, id: found.id, price: vals.price };
      state.selected.delete(o.name); delete state.overrides[o.name];
      log(`✅ ${esc(o.name)} ← <span class="ltr">${esc(found.waybill)}</span>`); ok++;
    } catch (e) { log(`❌ ${esc(o.name)}: ${esc(e.message)}`, 'muted'); }
    $('#pg', sh.el).style.width = ((i + 1) / list.length * 100) + '%';
  }
  await Store.set('sent_map', state.sentMap); await Store.set('overrides', state.overrides);
  $('.sheet-h h3', sh.el).textContent = `تم إرسال ${ok} من ${list.length}`;
}

async function renderSent() {
  const orders = await Shopify.sent();
  const body = $('#shopBody');
  if (!orders.length) { body.innerHTML = `<div class="card empty">${ic('truck')}<div>مفيش أوردرات تحت المتابعة</div></div>`; return; }
  body.innerHTML = loading();
  const from = new Date(); from.setDate(from.getDate() - 75);
  const ships = await Hazem.shipments({ items: 1000, from: ymd(from), to: ymd(new Date()) });
  const byOrder = {}, byWaybill = {};
  ships.forEach(s => { if (s.order_id) byOrder[s.order_id] = s; byWaybill[s.waybill] = s; });
  state.sent = orders.map(o => {
    const wb = (o.tags.find(t => t.startsWith('HZM-')) || '').slice(4) || state.sentMap[o.name]?.waybill;
    return { o, ship: byOrder[o.name.replace('#', '')] || byWaybill[wb] || null, waybill: wb };
  });
  const toSync = state.sent.filter(x => x.ship && ['delivered', 'returned', 'cancelled'].includes(x.ship.category));
  body.innerHTML = `
    ${toSync.length ? `<div class="banner success">${ic('sync', 'width="20"')}<div class="grow"><b>${toSync.length} أوردر حالته اتحسمت</b><div class="small">حدّث المتجر: المسلّم يتعلّم "اتشحن ومدفوع"، والمرتجع يتعلّم بتاج.</div></div><button class="btn sm primary" id="syncBtn">تحديث</button></div>` : ''}
    <div class="list">${state.sent.map(({ o, ship, waybill }, i) => `
      <button class="item" data-i="${i}"><div class="grow">
        <div class="row between"><span class="title">${esc(o.name)} · ${esc(o.shippingAddress?.name || '')}</span><span class="amount">${money(o.totalOutstandingSet?.shopMoney?.amount)}</span></div>
        <div class="meta row between"><span class="ltr">${esc(waybill || '')}</span><span>${esc(ship?.area || '')}</span></div>
        <div style="margin-top:6px">${ship ? statusBadge(ship) : '<span class="badge">مش لاقي الشحنة</span>'}</div>
      </div></button>`).join('')}</div>`;
  $$('#shopBody .item').forEach(b => b.onclick = () => { const x = state.sent[b.dataset.i]; if (x.ship) openShipment(x.ship); });
  if ($('#syncBtn')) $('#syncBtn').onclick = () => syncShopify(toSync);
}
async function syncShopify(list) {
  const sh = sheet('تحديث المتجر', `<div class="card card-pad"><div class="progress"><span id="pg" style="width:0"></span></div><div class="log" id="plog" style="margin-top:10px"></div></div>`, [['تم', () => { sh.close(); viewShop(); }, 'primary']]);
  const log = t => $('#plog', sh.el).insertAdjacentHTML('beforeend', `<div>${t}</div>`);
  for (let i = 0; i < list.length; i++) {
    const { o, ship } = list[i];
    try {
      if (ship.category === 'delivered') {
        await Shopify.fulfill(o.id, ship.waybill);
        if (o.displayFinancialStatus !== 'PAID') await Shopify.markPaid(o.id);
        await Shopify.tag(o.id, [TAG_DELIVERED]);
        log(`✅ ${esc(o.name)}: اتسلّم — اتعلّم اتشحن ومدفوع`);
      } else {
        await Shopify.tag(o.id, [TAG_RETURNED]);
        log(`↩️ ${esc(o.name)}: ${esc(ship.status)} — اتعلّم مرتجع`);
      }
    } catch (e) { log(`❌ ${esc(o.name)}: ${esc(e.message)}`); }
    $('#pg', sh.el).style.width = ((i + 1) / list.length * 100) + '%';
  }
}

function openShopSettings() {
  const c = Shopify.cfg || { shop: '', mode: 'client' };
  const sh = sheet('ربط متجر شوبيفاي', `
    <div class="banner info"><div class="small">من <b>Shopify Dev Dashboard</b> اعمل تطبيق بالصلاحيات دي، واعمله <b>Install</b> على متجرك:<br><span class="ltr">read_orders, write_orders, read_merchant_managed_fulfillment_orders, write_merchant_managed_fulfillment_orders</span></div></div>
    <div class="card card-pad">
      <div class="field"><label>عنوان المتجر</label><input id="shShop" class="ltr" placeholder="xxxx.myshopify.com" value="${esc(c.shop)}"></div>
      <div class="seg" id="shMode"><button data-m="client" class="${c.mode !== 'token' ? 'on' : ''}">Client ID + Secret</button><button data-m="token" class="${c.mode === 'token' ? 'on' : ''}">Access Token</button></div>
      <div id="shClient" ${c.mode === 'token' ? 'hidden' : ''}>
        <div class="field"><label>Client ID</label><input id="shCid" class="ltr" value="${esc(c.clientId || '')}"></div>
        <div class="field"><label>Client Secret</label><input id="shSec" class="ltr" type="password" value="${esc(c.clientSecret || '')}"></div>
      </div>
      <div id="shTok" ${c.mode === 'token' ? '' : 'hidden'}><div class="field"><label>Admin API access token</label><input id="shToken" class="ltr" type="password" placeholder="shpat_..." value="${esc(c.token || '')}"></div></div>
      <div class="field" style="margin-top:6px"><label>إيه الأوردرات اللي تظهر في "جاهز للشحن"؟</label></div>
      <div class="seg" id="shReady"><button data-r="fulfilled" class="${(c.readyMode || 'fulfilled') === 'fulfilled' ? 'on' : ''}">اللي عملتها Fulfilled</button><button data-r="unfulfilled" class="${c.readyMode === 'unfulfilled' ? 'on' : ''}">كل الأوردرات الجديدة</button></div>
      <div id="shRes"></div>
    </div>`, [['حفظ واختبار', save, 'primary']]);
  let readyMode = c.readyMode || 'fulfilled';
  $$('#shReady button', sh.el).forEach(b => b.onclick = () => { readyMode = b.dataset.r; $$('#shReady button', sh.el).forEach(x => x.classList.toggle('on', x === b)); });
  let mode = c.mode === 'token' ? 'token' : 'client';
  $$('#shMode button', sh.el).forEach(b => b.onclick = () => { mode = b.dataset.m; $$('#shMode button', sh.el).forEach(x => x.classList.toggle('on', x === b)); $('#shClient', sh.el).hidden = mode !== 'client'; $('#shTok', sh.el).hidden = mode !== 'token'; });
  async function save(btn) {
    const cfg = { shop: $('#shShop', sh.el).value.trim(), mode, clientId: $('#shCid', sh.el).value.trim(), clientSecret: $('#shSec', sh.el).value.trim(), token: $('#shToken', sh.el).value.trim(), readyMode };
    btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
    await Shopify.save(cfg);
    try { const s = await Shopify.test(); state.shopName = s.name.trim(); $('#shRes', sh.el).innerHTML = `<div class="banner success">تم الربط بمتجر <b>${esc(s.name)}</b></div>`; setTimeout(() => { sh.close(); go(state.tab); }, 900); }
    catch (e) { $('#shRes', sh.el).innerHTML = `<div class="banner critical" style="white-space:pre-line">${esc(e.message)}</div>`; }
    btn.disabled = false; btn.textContent = 'حفظ واختبار';
  }
}

// ---------- Accounts (balance) ----------
async function viewMoney() {
  setTitle('الحسابات');
  state.moneyFilter = state.moneyFilter || 'all';
  const v = $('#view');
  v.innerHTML = loading();
  let bal;
  // All operations (the merchant has a few hundred); newest first after parsing.
  try { bal = await Hazem.balance({ items: 3000 }); } catch (e) { v.innerHTML = ''; return handleErr(e); }
  state.balance = bal;
  const latest = bal.ops.find(o => o.date), today = ymd(new Date());
  const todayN = bal.ops.filter(o => (o.date || '').startsWith(today)).length;
  const S = bal.summary, g = k => S[k];
  const pair = k => g(k) && typeof g(k) === 'object' ? g(k) : { count: 0, amount: 0 };
  const due = g('صافي المستحق') ?? g('الرصيد') ?? 0, payable = g('المبلغ القابل للتوريد');
  const rets = bal.ops.filter(o => o.isReturn);
  v.innerHTML = `
    <div class="card card-pad money-hero">
      <div class="small" style="opacity:.8">صافي المستحق ليك</div>
      <div style="font-size:30px;font-weight:700">${money(due)} <span style="font-size:15px">ج.م</span></div>
      ${payable != null ? `<div class="small" style="opacity:.9">القابل للتوريد دلوقتي: <b>${money(payable)} ج.م</b></div>` : ''}
      <div class="tiny" style="opacity:.85;margin-top:8px;border-top:1px solid rgba(255,255,255,.15);padding-top:8px">آخر عملية سجّلتها الشركة: <b>${esc(latest?.date || '—')}</b>${latest ? ` (${esc(latest.type)})` : ''} · النهارده: <b>${todayN}</b> عملية</div>
    </div>
    <div class="stats">
      <div class="stat"><div class="lbl"><i style="background:${CAT_COLOR.delivered}"></i>المبالغ المحصلة</div><div class="num">${money(pair('المبالغ المحصلة').amount)}</div><div class="sub">${pair('المبالغ المحصلة').count} شحنة</div></div>
      <div class="stat"><div class="lbl"><i style="background:#6d7175"></i>الدفعات اللي استلمتها</div><div class="num">${money(pair('الدفعات').amount)}</div><div class="sub">${pair('الدفعات').count} دفعة</div></div>
      <div class="stat"><div class="lbl"><i style="background:${CAT_COLOR.active}"></i>مصاريف شحن التسليم</div><div class="num">${money(pair('تسليم ناجح').amount)}</div><div class="sub">${pair('تسليم ناجح').count} شحنة</div></div>
      <div class="stat"><div class="lbl"><i style="background:${CAT_COLOR.returned}"></i>مصاريف المرتجعات</div><div class="num">${money(pair('مرتجعات').amount)}</div><div class="sub">${pair('مرتجعات').count} شحنة</div></div>
    </div>
    <div class="chips">${MONEY_FILTERS.map(([k, l, fn]) => { const n = bal.ops.filter(fn).length; return `<button class="chip ${state.moneyFilter === k ? 'on' : ''}" data-mf="${k}">${l} (${n})</button>`; }).join('')}</div>
    <div id="opsList"></div>
    <p class="tiny" style="text-align:center">كل العمليات (${bal.ops.length}) من صفحة الرصيد على حازم حلان · العملية بتنزل هنا لما الشركة تقفل حساب الشحنة</p>`;
  // Each category is independent: switching clears the selection.
  $$('[data-mf]', v).forEach(b => b.onclick = () => { state.moneyFilter = b.dataset.mf; state.opSel = null; $$('[data-mf]', v).forEach(x => x.classList.toggle('on', x === b)); renderOps(); });
  renderOps();
  syncRecentOps(bal, v);
}
// The balance page can lag behind the shipments: an operation for a shipment whose status
// changed in the last weeks may be missing from the plain list, or carry an older date.
// Ask the portal for the operations of those shipments directly, add the missing ones, and
// stamp each operation with its shipment's last status change so today's updates sort first.
async function syncRecentOps(bal, v) {
  try {
    const from = new Date(); from.setDate(from.getDate() - 30);
    const ships = (await Hazem.shipments({ sfrom: ymd(from), sto: ymd(new Date()), status: [...new Set(STATUS.returned.concat([13, 25, 31], STATUS.delivered))], items: 1000 })).filter(x => x.waybill);
    if (state.balance !== bal || !ships.length) return;
    const upd = {}; ships.forEach(x => upd[x.waybill] = x.last_change || x.date || '');
    const failed = ships.filter(isFailed).map(x => x.waybill);
    const extra = failed.length ? await Hazem.opsFor(failed) : [];
    if (state.balance !== bal) return;
    const key = o => o.id || `${o.waybill}|${o.type}|${o.date}`, have = new Set(bal.ops.map(key));
    for (const o of extra) if (!have.has(key(o))) { have.add(key(o)); bal.ops.push(o); }
    for (const o of bal.ops) if (o.waybill && upd[o.waybill]) o.shipDate = upd[o.waybill];
    bal.ops.sort((a, b) => opTime(b) - opTime(a));
    $$('[data-mf]', v).forEach(b => { const f = MONEY_FILTERS.find(x => x[0] === b.dataset.mf); if (f) b.textContent = `${f[1]} (${bal.ops.filter(f[2]).length})`; });
    if (!state.opSel?.size) renderOps();
  } catch {}
}
const opTime = o => Math.max(dtVal(o.date), dtVal(o.shipDate));
// How much of the shipping fee the customer did NOT pay, for any shipment operation:
// a return (paid part or nothing), or a delivery / partial delivery / exchange where the
// amount collected is below the shipping fee itself.
function shipShort(o) {
  if (!o.waybill || o.isPayout || !(o.fee > 0)) return 0;
  const paid = o.isReturn ? o.paid : o.value;
  return paid > 0 && paid < o.fee ? o.fee - paid : 0;
}
// Independent categories in the Accounts tab: [key, label, test].
const MONEY_FILTERS = [
  ['all', 'كل العمليات', () => true],
  ['payout', '💵 التوريدات', o => o.isPayout],
  ['nopay', 'مدفعش شحن', o => o.isReturn && o.paid <= 0],
  ['short', 'دفع شحن أقل', o => shipShort(o) > 0],
  ['under', 'تحصيل أقل من الأوردر', o => !o.isReturn && !/جزئي/.test(o.type) && isProblemOp(o)],
  ['partial', 'تسليم جزئي', o => /جزئي/.test(o.type)],
  ['return', 'كل المرتجعات', o => o.isReturn],
  ['deliver', 'تسليم', o => !o.isReturn && !o.isPayout && !!o.waybill],
];
function renderOps() {
  const cat = MONEY_FILTERS.find(x => x[0] === state.moneyFilter) || MONEY_FILTERS[0];
  const ops = state.balance.ops.filter(cat[2]);
  const box = $('#opsList'); if (!box) return;
  state.opsShown = ops;
  if (!ops.length) { box.innerHTML = `<div class="card empty">${ic('wallet')}<div>مفيش عمليات في «${esc(cat[1])}»</div></div>`; renderOpBar(); return; }
  const exportable = ops.filter(o => o.waybill).length;
  // Payouts tab: summary of the cash the courier handed over.
  const pay = cat[0] === 'payout' ? (() => {
    const tot = ops.reduce((a, o) => a + o.value, 0), lastP = ops[0];
    const S = state.balance.summary, payable = S['المبلغ القابل للتوريد'], all = S['الدفعات'];
    return `<div class="card card-pad payout-card">
      <div class="row between"><div><div class="small">استلمت في القايمة دي</div><div style="font-size:24px;font-weight:700">${money(tot)} <span class="small">ج.م</span></div><div class="tiny">${ops.length} توريد</div></div>
      <div style="text-align:left"><div class="small">آخر توريد</div><div style="font-weight:700">${money(lastP.value)} ج.م</div><div class="tiny">${esc(lastP.date)}</div></div></div>
      <div class="row between wrap" style="margin-top:10px;gap:6px">${all?.amount != null ? `<span class="badge payout">إجمالي كل التوريدات: ${money(all.amount)} (${all.count})</span>` : ''}${payable != null ? `<span class="badge">لسه ليك يتورّد: ${money(payable)} ج.م</span>` : ''}</div>
    </div>`;
  })() : '';
  box.innerHTML = `${pay}
    ${exportable && cat[0] !== 'payout' ? `<div class="banner warning" style="align-items:center"><div class="grow small"><b>${exportable} عملية في «${esc(cat[1])}»</b> — صدّرهم شيت لإدارة شركة الشحن</div><button class="btn sm" id="opsExportAll">📤 تصدير</button></div>` : ''}
    <div class="tiny" style="margin:0 4px 6px">${ops[0]?.date ? `آخر تحديث في «${esc(cat[1])}»: <b>${esc((dtVal(ops[0].shipDate) > dtVal(ops[0].date) ? ops[0].shipDate : ops[0].date).slice(0, 16))}</b>` : ''}${cat[0] === 'payout' ? '' : ' · ضغطة مطولة على أي عملية عشان تحدد وتصدّر'}</div>
    <div class="list">${ops.map((o, i) => `
    <button class="item ${o.isPayout ? 'payout-row' : shipShort(o) > 0 ? 'canary-row' : ''} ${state.opSel?.has(o) ? 'selected' : ''}" data-op="${i}">
      ${state.opSel ? `<span class="check ${state.opSel.has(o) ? 'on' : ''}"></span>` : ''}
      <div class="grow">
      <div class="row between"><span class="title">${esc(o.isPayout ? 'دفعة ' + (o.type || '') : o.type)}</span><span class="amount">${money(o.value)} <span class="tiny">ج.م</span></span></div>
      <div class="meta row between"><span class="ltr">${esc(o.waybill || o.from || '')}</span><span>${esc(o.area)}</span></div>
      <div class="row between wrap" style="margin-top:6px;gap:6px">${o.isPayout ? `<span class="badge payout">💵 توريد تحصيل${o.confirm === 'نعم' ? ' · اتأكد ✓' : o.confirm ? ' · لسه متأكدش' : ''}</span>` : o.isReturn ? feeBadge(o) : o.waybill ? (shipShort(o) > 0 ? `<span class="badge canary">${/جزئي|استبدال/.test(o.type) ? 'جزئي/استبدال · ' : ''}اتحصّل ${money(o.value)} والشحن ${money(o.fee)} · ناقص ${money(shipShort(o))}</span>` : `<span class="badge">شحن ${money(o.fee)}</span>`) : ''}<span class="tiny">${esc(o.date)}</span></div>
      ${o.shipDate && dtVal(o.shipDate) > dtVal(o.date) ? `<div class="tiny" style="margin-top:4px">آخر تحديث للشحنة: <b>${esc(o.shipDate.slice(0, 16))}</b></div>` : ''}
    </div></button>`).join('')}</div>
    <div style="height:${state.opSel ? 140 : 0}px"></div>`;
  if ($('#opsExportAll')) $('#opsExportAll').onclick = () => exportComplaint(ops.filter(o => o.waybill), cat[1]);
  $$('[data-op]', box).forEach(b => {
    const o = ops[b.dataset.op];
    let t = null, long = false;
    const start = () => { long = false; t = setTimeout(() => { long = true; navigator.vibrate?.(30); opToggle(o, true); }, 480); };
    const cancel = () => clearTimeout(t);
    b.addEventListener('touchstart', start, { passive: true }); b.addEventListener('touchend', cancel); b.addEventListener('touchmove', cancel, { passive: true });
    b.addEventListener('contextmenu', e => { e.preventDefault(); if (!long) opToggle(o, true); long = true; });
    b.onclick = async () => {
      if (long) { long = false; return; }
      if (state.opSel) return opToggle(o);
      if (!o.waybill) return;
      try { const r = (await Hazem.search(o.waybill)).find(x => x.waybill === o.waybill); if (r) openShipment(r); } catch (e) { handleErr(e); }
    };
  });
  renderOpBar();
}
function opToggle(o, on) {
  if (!o.waybill) return toast('دي دفعة مش شحنة');
  state.opSel = state.opSel || new Set();
  (on ?? !state.opSel.has(o)) ? state.opSel.add(o) : state.opSel.delete(o);
  if (!state.opSel.size) state.opSel = null;
  renderOps();
}
function renderOpBar() {
  $('#opBar')?.remove();
  if (!state.opSel || state.tab !== 'money') return;
  const bar = document.createElement('div'); bar.id = 'opBar'; bar.className = 'sel-bar'; document.body.appendChild(bar);
  const n = state.opSel.size;
  const cat = MONEY_FILTERS.find(x => x[0] === state.moneyFilter) || MONEY_FILTERS[0];
  const all = state.opsShown.filter(o => o.waybill);
  const allOn = all.length && all.every(o => state.opSel.has(o));
  bar.innerHTML = `
    <div class="row between" style="margin-bottom:8px"><b>تم تحديد ${n} من «${esc(cat[1])}»</b><span class="row" style="gap:6px"><button class="btn sm" id="opAll">${allOn ? 'إلغاء الكل' : `تحديد الكل (${all.length})`}</button><button class="icon-btn" id="opX">${ic('close')}</button></span></div>
    <button class="btn accent block" id="opExport">📤 تصدير شيت للشركة (${n})</button>`;
  $('#opX').onclick = () => { state.opSel = null; renderOps(); };
  $('#opAll').onclick = () => { state.opSel = allOn ? null : new Set(all); renderOps(); };
  $('#opExport').onclick = () => exportComplaint([...state.opSel], cat[1]);
}

// ---------- More ----------
function viewMore() {
  setTitle('المزيد');
  const user = Hazem.creds?.email || '';
  $('#view').innerHTML = `
    <div class="card card-pad row"><div class="brand" style="margin:0"><div class="logo" style="width:44px;height:44px">${ic('truck')}</div></div><div class="grow"><b>حسابي على حازم حلان</b><div class="small muted ltr" style="text-align:right">${esc(user)}</div></div></div>
    <div class="section-title">الشحنات</div>
    <div class="list menu">
      ${menuItem('plus', 'إضافة شحنة يدوي', 'add')}${menuItem('upload', 'رفع شيت إكسيل', 'upload')}${menuItem('download', 'تنزيل الشحنات إكسيل', 'export')}${menuItem('web', 'فتح الموقع', 'site')}
    </div>
    <div class="section-title">المتجر</div>
    <div class="list menu">${menuItem('bag', Shopify.ready ? 'إعدادات ربط شوبيفاي' : 'ربط متجر شوبيفاي', 'shop')}${menuItem('whatsapp', 'واتساب والرسايل الجاهزة', 'wa')}${menuItem('gear', 'ربط الذكاء الاصطناعي (Claude / Gemini)', 'ai')}</div>
    <div class="section-title">البيانات</div>
    <div class="list menu">${menuItem('refresh', 'المزامنة بين الموبايل والموقع', 'sync')}${menuItem('download', 'نسخ البيانات يدويًا', 'backup')}</div>
    <div class="section-title">التنبيهات</div>
    <div class="list menu">${menuItem('bell', 'مركز التنبيهات', 'center')}${menuItem('alert', 'إعدادات التنبيهات (مرتجع، تأجيل، دفع أقل، أوردرات…)', 'alerts')}</div>
    <div class="section-title">أوردرات واتساب وماسنجر</div>
    <div class="list menu"><label class="item" style="align-items:center"><span class="ico">${ic('bag')}</span><span class="grow"><b>سجّلها كأوردرات على شوبيفاي كمان</b><div class="tiny">عشان كل المبيعات والتقارير تبقى في مكان واحد</div></span><input type="checkbox" id="waShopToggle" class="switch"></label></div>
    <div class="list menu">${menuItem('logout', 'تسجيل الخروج', 'logout')}</div>
    <p class="tiny" style="text-align:center">شحناتي · الإصدار 3.12</p>`;
  const acts = { add: () => openAdd(), upload: openUpload, export: () => go('ships'), site: () => window.open(HH_REAL + '/admin-area/index.php', '_blank'), shop: openShopSettings, wa: openWaSettings, wao: openWaOrders, ai: () => openAiSettings(), backup: openBackup, sync: openSyncSetup, center: openAlertCenter, alerts: openAlertSettings,
    logout: async () => { if (!confirm('تسجيل الخروج؟')) return; await Hazem.logout(); await Store.del('creds'); renderLogin(); } };
  $$('.menu [data-m]').forEach(b => b.onclick = acts[b.dataset.m]);
  Store.get('wa_to_shopify', true).then(v => { const t = $('#waShopToggle'); if (!t) return; t.checked = v !== false; t.onchange = () => Store.set('wa_to_shopify', t.checked); });
}
const menuItem = (icon, label, k) => `<button class="item" data-m="${k}"><span class="ico">${ic(icon)}</span><span class="grow" style="font-weight:600">${label}</span>${ic('chev', 'class="chev"')}</button>`;

// ---------- Bottom sheet ----------
function sheet(title, html, buttons = []) {
  const wrap = document.createElement('div');
  wrap.className = 'sheet-wrap';
  wrap.innerHTML = `<div class="sheet"><div class="sheet-h"><h3>${esc(title)}</h3><button class="icon-btn" data-x>${ic('close')}</button></div><div class="sheet-b">${html}</div>${buttons.length ? `<div class="sheet-f">${buttons.map(([l, , cls], i) => `<button class="btn ${cls || ''}" data-b="${i}">${l}</button>`).join('')}</div>` : ''}</div>`;
  document.body.appendChild(wrap);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => wrap.classList.add('show'));
  const api = { el: wrap, close() { wrap.classList.remove('show'); setTimeout(() => { wrap.remove(); if (!$('.sheet-wrap')) document.body.style.overflow = ''; }, 200); sheetStack.splice(sheetStack.indexOf(api), 1); } };
  sheetStack.push(api);
  wrap.onclick = e => { if (e.target === wrap || e.target.closest('[data-x]')) api.close(); };
  $$('[data-b]', wrap).forEach(b => b.onclick = () => buttons[b.dataset.b][1](b));
  return api;
}
const sheetStack = [];

// ---------- Pull to refresh (drag down from the top of any tab) ----------
async function refreshTab() {
  const t = state.tab;
  if (t === 'home') return viewHome();
  if (t === 'ships') return loadShipments();
  if (t === 'shop') return viewShop();
  if (t === 'money') return viewMoney();
}
(function pullToRefresh() {
  const ind = document.createElement('div'); ind.className = 'ptr'; ind.innerHTML = `<div class="ptr-c">${ic('refresh')}</div>`;
  document.body.appendChild(ind);
  let y0 = null, d = 0, busy = false;
  const MAX = 90, GO = 64;
  const reset = () => { ind.style.transition = 'transform .25s, opacity .25s'; ind.style.transform = ''; ind.style.opacity = 0; ind.classList.remove('ready', 'loading'); };
  addEventListener('touchstart', e => {
    if (busy || scrollY > 2 || sheetStack.length || state.selMode || state.opSel || !$('#view') || $('.dd-wrap')) return;
    y0 = e.touches[0].clientY; d = 0; ind.style.transition = 'none';
  }, { passive: true });
  addEventListener('touchmove', e => {
    if (y0 == null) return;
    d = Math.min(MAX, Math.max(0, (e.touches[0].clientY - y0) * 0.5));
    if (scrollY > 2) { y0 = null; return reset(); }
    ind.style.transform = `translateY(${d}px)`; ind.style.opacity = Math.min(1, d / 40);
    ind.firstChild.style.transform = `rotate(${d * 4}deg)`;
    ind.classList.toggle('ready', d >= GO);
  }, { passive: true });
  addEventListener('touchend', async () => {
    if (y0 == null) return;
    y0 = null;
    if (d < GO) return reset();
    busy = true; navigator.vibrate?.(12);
    ind.style.transition = 'transform .2s'; ind.style.transform = `translateY(${GO}px)`; ind.classList.add('loading');
    try { await refreshTab(); } catch {} finally { busy = false; reset(); }
  });
})();
// Android back button closes the top sheet first.
document.addEventListener('backbutton', () => sheetStack.length ? sheetStack[sheetStack.length - 1].close() : null);
window.Capacitor?.Plugins?.App?.addListener?.('backButton', () => { if (sheetStack.length) sheetStack[sheetStack.length - 1].close(); else if (state.selMode) endSelect(); else if (state.tab !== 'home') go('home'); else window.Capacitor.Plugins.App.exitApp(); });
