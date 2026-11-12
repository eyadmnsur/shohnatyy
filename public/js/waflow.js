// Orders that come from WhatsApp / Messenger chats, with the same three stages as Shopify:
// محتاج تأكيد (stage 'confirm') -> جاهز للشحن (stage 'ready') -> اتبعت للشحن (saved in 'wa_sent').
const CHANNELS = { whatsapp: { label: 'واتساب', icon: '💬' }, messenger: { label: 'ماسنجر', icon: '📘' } };

async function waLoad() {
  state.waDrafts = state.waDrafts || await Store.get('wa_drafts', []);
  state.waDrafts.forEach(d => { d.stage = d.stage || 'confirm'; d.channel = d.channel || 'whatsapp'; });
  state.waSent = state.waSent || await Store.get('wa_sent', []);
}
const waSave = () => Promise.all([Store.set('wa_drafts', state.waDrafts), Store.set('wa_sent', state.waSent)]);
// A draft as a shipment-like object, for message templates.
const draftShip = d => ({ consignee: d.s.client_name, order_id: d.s.order_id || '', cod: d.s.price, address: d.s.address, product: d.s.product_name, phone1: d.s.phone_1, waybill: '' });

async function renderWaSection(body) {
  await Promise.all([waLoad(), ensureSectors().catch(() => {}), loadCustomerHistory()]);
  const tab = state.shopTab;
  const addBtn = `<button class="btn wa block" id="waAdd" style="margin-bottom:10px">${ic('plus')} أوردر جديد من واتساب / ماسنجر (صور أو نص)</button>`;
  if (tab === 'sent') return renderWaSent(body, addBtn);
  const list = state.waDrafts.filter(d => d.stage === tab);
  if (!list.length) {
    body.innerHTML = addBtn + `<div class="card empty">${ic(tab === 'confirm' ? 'whatsapp' : 'truck')}<div>${tab === 'confirm' ? 'مفيش أوردرات مستنية تأكيد' : 'مفيش أوردرات جاهزة للشحن'}</div><div class="small" style="margin-top:6px">${tab === 'confirm' ? 'ضيف أوردر من صور أو رسايل الشات بالزرار اللي فوق' : 'الأوردرات بتيجي هنا لما تدوس "العميل أكّد"'}</div></div>`;
    $('#waAdd', body).onclick = openWaOrders; return;
  }
  const sel = state.waSel = state.waSel || new Set();
  body.innerHTML = addBtn + `
    <div class="row between" style="margin:0 4px 8px"><span class="small muted">${list.length} أوردر · ${money(list.reduce((a, d) => a + num(d.s.price), 0))} ج.م</span>${tab === 'ready' ? `<button class="btn sm" id="waAll">${list.every(d => sel.has(d.id)) ? 'إلغاء التحديد' : 'تحديد الكل'}</button>` : ''}</div>
    <div class="list">${list.map((d, i) => {
      const s = d.s, sec = (state.sectors || []).find(x => x.id === s.sector_id);
      const area = !s.sector_id ? '<span class="badge critical">اختار المنطقة</span>' : `<span class="badge ${s._confident ? 'success' : 'attention'}">${s._confident ? '' : 'راجع: '}${esc(sec?.area || '')}</span>`;
      const probs = [!validPhone(s.phone_1) && 'مفيش موبايل', !s.price && 'المبلغ ناقص', ...(d.missing || [])].filter(Boolean);
      return `<div class="item ${tab === 'ready' && sel.has(d.id) ? 'selected' : ''}" data-i="${i}">
        ${tab === 'ready' ? `<span class="check ${sel.has(d.id) ? 'on' : ''}" data-sel="${i}"></span>` : ''}
        <div class="grow">
          <div class="row between" data-open="${i}"><span class="title">${CHANNELS[d.channel].icon} ${esc(s.client_name || 'بدون اسم')}</span><span class="amount">${s.price ? money(s.price) + ' <span class="tiny">ج.م</span>' : '—'}</span></div>
          <div class="meta ellipsis" data-open="${i}">${esc(s.product_name || '')}</div>
          <div class="row wrap" style="gap:6px;margin-top:6px">${area}${s.phone_1 ? historyBadge(s.phone_1) : ''}${d.shop ? `<span class="badge info">🛍️ ${esc(d.shop.name)}</span>` : ''}${waBadge('WA:' + d.id)}${probs.map(p => `<span class="badge warning">${esc(p)}</span>`).join('')}</div>
          ${tab === 'confirm' ? `<div class="row" style="margin-top:10px;gap:8px"><button class="btn sm wa grow" data-msg="${i}">${ic('whatsapp')} ابعت تأكيد</button><button class="btn sm grow" data-ok="${i}">${ic('check')} العميل أكّد</button><button class="icon-btn" data-del="${i}">${ic('close')}</button></div>`
            : `<div class="row" style="margin-top:8px;gap:8px"><button class="btn sm grow" data-back="${i}">↩︎ رجّعه للتأكيد</button><button class="icon-btn" data-del="${i}">${ic('close')}</button></div>`}
        </div></div>`;
    }).join('')}</div>
    ${tab === 'ready' ? `<div style="height:70px"></div><div class="bottom-bar"><button class="btn accent" id="waShip" ${[...sel].some(id => list.some(d => d.id === id)) ? '' : 'disabled'}>${ic('truck')} ابعت ${list.filter(d => sel.has(d.id)).length || ''} لحازم حلان</button></div>` : ''}`;
  $('#waAdd', body).onclick = openWaOrders;
  const rerender = () => renderWaSection(body);
  $$('[data-open]', body).forEach(c => c.onclick = () => { const d = list[c.dataset.open]; openAdd(d.s, async vals => {
      const before = d.s; d.s = { ...d.s, ...vals, _confident: true }; await waSave();
      if (d.shop) {
        const patch = {};
        if (vals.client_name !== before.client_name) patch.name = vals.client_name;
        if (vals.phone_1 !== before.phone_1) patch.phone = vals.phone_1;
        if (vals.address !== before.address) patch.address = vals.address;
        if (Object.keys(patch).length) Shopify.findOrder(d.shop.name, '').then(o => o && Shopify.updateShipping(o, patch)).then(() => toast('اتحدّث في شوبيفاي كمان', 'ok')).catch(() => toast('اتحفظ هنا، بس تحديث شوبيفاي فشل', 'err'));
      }
      rerender();
    }); });
  $$('[data-del]', body).forEach(b => b.onclick = async () => { const d = list[b.dataset.del]; if (!confirm(`مسح أوردر ${d.s.client_name}؟`)) return;
    if (d.shop && confirm(`الأوردر مسجّل على شوبيفاي ${d.shop.name}. تلغيه هناك كمان؟\n(موافق = يتلغي، إلغاء = يفضل على شوبيفاي)`)) await Shopify.cancel(d.shop.id).then(() => toast('اتلغى على شوبيفاي', 'ok')).catch(e => toast('مقدرتش ألغيه: ' + String(e.message).slice(0, 60), 'err'));
    state.waDrafts.splice(state.waDrafts.indexOf(d), 1); await waSave(); rerender(); });
  $$('[data-msg]', body).forEach(b => b.onclick = () => { const d = list[b.dataset.msg]; draftMessage(d, async () => { await markWa('WA:' + d.id, 'confirm'); rerender(); }); });
  $$('[data-ok]', body).forEach(b => b.onclick = async () => { const d = list[b.dataset.ok]; d.stage = 'ready'; sel.add(d.id); await waSave(); toast(`${d.s.client_name} اتنقل لـ"جاهز للشحن" ✓`, 'ok'); rerender(); });
  $$('[data-back]', body).forEach(b => b.onclick = async () => { const d = list[b.dataset.back]; d.stage = 'confirm'; sel.delete(d.id); await waSave(); rerender(); });
  $$('[data-sel]', body).forEach(c => c.onclick = e => { e.stopPropagation(); const d = list[c.dataset.sel]; sel.has(d.id) ? sel.delete(d.id) : sel.add(d.id); rerender(); });
  if ($('#waAll', body)) $('#waAll', body).onclick = () => { const all = list.every(d => sel.has(d.id)); list.forEach(d => all ? sel.delete(d.id) : sel.add(d.id)); rerender(); };
  if ($('#waShip', body)) $('#waShip', body).onclick = () => sendWaDrafts(list.filter(d => sel.has(d.id)), rerender);
}

// WhatsApp opens with the message; Messenger has no phone link, so the message is copied instead.
async function draftMessage(d, onSent) {
  if (d.channel !== 'messenger') return waCompose({ ship: draftShip(d) }, 'confirm', onSent);
  const c = await WA.cfg(), text = WA.fill(c.templates.confirm.text, await waData({ ship: draftShip(d) }), 'confirm');
  const ok = await copyText(text);
  toast(ok ? 'رسالة التأكيد اتنسخت — الصقها في ماسنجر' : 'مقدرتش أنسخ', ok ? 'ok' : 'err');
  setTimeout(() => window.open('https://m.me/', '_blank'), 500);
  onSent && onSent('confirm');
}

async function sendWaDrafts(list, done) {
  const bad = list.filter(d => !d.s.sector_id || !validPhone(d.s.phone_1) || !d.s.address || !d.s.price || !d.s.client_name);
  if (bad.length) return toast(`راجع ${bad.length} أوردر: ناقص اسم أو موبايل أو منطقة أو مبلغ`, 'err');
  const already = list.filter(d => openShipmentFor(d.s.phone_1));
  if (already.length && !confirm(`⚠️ ${already.length} عميل ليهم شحنة مفتوحة على حازم بنفس الموبايل:\n${already.map(d => `${d.s.client_name} ← ${openShipmentFor(d.s.phone_1)}`).join('\n')}\n\nلو دي نفس الأوردرات هتتسجل مرتين. تكمّل؟`)) return;
  const toShopify = Shopify.ready && (await Store.get('wa_to_shopify', true)) !== false;
  const p = sheet('جاري الإرسال', `<div class="card card-pad"><div class="progress"><span id="pg" style="width:0"></span></div><div class="log" id="plog" style="margin-top:10px"></div></div>`, [['تم', () => { p.close(); done && done(); }, 'primary']]);
  const log = t => $('#plog', p.el).insertAdjacentHTML('beforeend', `<div>${t}</div>`);
  let ok = 0;
  for (let i = 0; i < list.length; i++) {
    const d = list[i];
    const vals = Object.fromEntries(Object.entries(d.s).filter(([k]) => !k.startsWith('_')));
    try {
      let order = null;
      if (d.shop) { order = d.shop; vals.order_id = order.name.replace('#', ''); await Shopify.tag(order.id, [TAG_SENT]).catch(() => {}); }
      else if (toShopify) { order = await Shopify.createOrder(d.s, d.items || [], [d.channel, TAG_WA, TAG_SENT]); vals.order_id = order.name.replace('#', ''); }
      else vals.order_id = vals.order_id || (d.channel === 'messenger' ? 'FB' : 'WA') + String(Date.now()).slice(-6);
      await Hazem.addShipment(vals, state.addBase);
      const found = (await Hazem.shipments({ order_id: vals.order_id, items: 20 })).find(r => r.order_id === vals.order_id);
      if (order && found) await Shopify.tag(order.id, ['HZM-' + found.waybill]).catch(() => {});
      if (found) state.sentMap[order?.name || 'WA-' + vals.order_id] = { waybill: found.waybill, id: found.id, price: vals.price };
      state.waSent.unshift({ id: d.id, name: d.s.client_name, phone: d.s.phone_1, channel: d.channel, order_id: vals.order_id, shopify: order?.name || '', price: vals.price, waybill: found?.waybill || '', shipId: found?.id || '', date: new Date().toISOString() });
      state.waDrafts.splice(state.waDrafts.indexOf(d), 1); state.waSel?.delete(d.id);
      log(`✅ ${esc(d.s.client_name)}${order ? ' · ' + esc(order.name) : ''} ← <span class="ltr">${esc(found?.waybill || 'اتبعت')}</span>`); ok++;
    } catch (e) { log(`❌ ${esc(d.s.client_name)}: ${esc(e.message)}`); }
    $('#pg', p.el).style.width = ((i + 1) / list.length * 100) + '%';
  }
  state.waSent = state.waSent.slice(0, 500);
  await waSave(); await Store.set('sent_map', state.sentMap);
  $('.sheet-h h3', p.el).textContent = `اتبعت ${ok} من ${list.length}`;
}

async function renderWaSent(body, addBtn) {
  const sent = state.waSent;
  if (!sent.length) { body.innerHTML = addBtn + `<div class="card empty">${ic('truck')}<div>لسه مفيش أوردرات واتساب اتبعتت</div></div>`; $('#waAdd', body).onclick = openWaOrders; return; }
  body.innerHTML = addBtn + loading();
  const from = new Date(Math.min(...sent.slice(0, 200).map(x => new Date(x.date).getTime()))); from.setDate(from.getDate() - 1);
  let ships = [];
  try { ships = await Hazem.shipments({ items: 1000, from: ymd(from), to: ymd(new Date()) }); } catch {}
  const byWb = {}, byOrd = {}; ships.forEach(s => { byWb[s.waybill] = s; if (s.order_id) byOrd[s.order_id] = s; });
  const rows = sent.slice(0, 200).map(x => ({ x, ship: byWb[x.waybill] || byOrd[x.order_id] || null }));
  body.innerHTML = addBtn + `<div class="list">${rows.map(({ x, ship }, i) => `
    <button class="item" data-i="${i}"><div class="grow">
      <div class="row between"><span class="title">${CHANNELS[x.channel || 'whatsapp'].icon} ${esc(x.name)}${x.shopify ? ' · ' + esc(x.shopify) : ''}</span><span class="amount">${money(x.price)}</span></div>
      <div class="meta row between"><span class="ltr">${esc(x.waybill || '')}</span><span>${esc(ship?.area || '')}</span></div>
      <div class="row between" style="margin-top:6px">${ship ? statusBadge(ship) : '<span class="badge">مش لاقي الشحنة</span>'}<span class="tiny">${new Date(x.date).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'short' })}</span></div>
      ${ship && hasReason(ship) ? `<div class="fail-line" data-x="${esc(ship.id)}"></div>` : ''}
    </div></button>`).join('')}</div>`;
  $('#waAdd', body).onclick = openWaOrders;
  $$('.item[data-i]', body).forEach(b => b.onclick = () => { const r = rows[b.dataset.i]; if (r.ship) openShipment(r.ship); });
  fillFailLines(body, rows.map(r => r.ship).filter(Boolean));
}
