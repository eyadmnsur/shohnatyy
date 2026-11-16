// Shopify orders list: tap = full order sheet with every option, long-press = multi-select with bulk actions,
// and orders that are already on Hazem (same order number) are linked automatically instead of staying in "ready".

const cleanOrderNo = o => String(o.name || '').replace(/\D/g, '');

// ---- link an order to its shipment on Hazem (moves it to "sent") ----
async function linkOrder(o, ship) {
  await Shopify.tag(o.id, [TAG_SENT, 'HZM-' + ship.waybill]);
  state.sentMap[o.name] = { waybill: ship.waybill, id: ship.id, price: num(ship.cod) };
  await Store.set('sent_map', state.sentMap);
}
// Orders in "ready" whose number already exists on Hazem were registered another way: link them by themselves.
async function autoLinkRegistered(orders) {
  if (!orders.length) return orders;
  let ships = [];
  try { const from = new Date(); from.setDate(from.getDate() - 45); ships = await Hazem.shipments({ from: ymd(from), to: ymd(new Date()), items: 1000 }); } catch { return orders; }
  const byNo = {}; ships.forEach(s => { if (s.order_id && !/-[A-Z]$/.test(s.waybill)) byNo[String(s.order_id).replace(/\D/g, '')] = s; });
  const keep = []; let linked = 0;
  for (const o of orders) {
    const ship = byNo[cleanOrderNo(o)];
    if (ship && !['cancelled'].includes(ship.category)) { try { await linkOrder(o, ship); linked++; continue; } catch {} }
    keep.push(o);
  }
  if (linked) toast(`${linked} أوردر كانوا متسجلين على حازم — اتنقلوا لـ«اتبعت للشحن» ✓`, 'ok');
  return keep;
}

// ---- edit the customer details on the Shopify order ----
function editShopOrder(o, after) {
  const a = o.shippingAddress || {};
  const sh = sheet('تعديل ' + o.name, `<div class="card card-pad">
      <div class="field"><label>الاسم</label><input id="eoN" value="${esc(a.name || [a.firstName, a.lastName].filter(Boolean).join(' '))}"></div>
      <div class="field"><label>الموبايل</label><input id="eoP" class="ltr" inputmode="tel" value="${esc(a.phone || o.phone || '')}"></div>
      <div class="field"><label>العنوان</label><textarea id="eoA">${esc([a.address1, a.address2].filter(Boolean).join(' - '))}</textarea></div>
      <div class="field"><label>المدينة / المنطقة</label><input id="eoC" value="${esc(a.city || '')}"></div></div>`,
    [['إلغاء', () => sh.close()], ['حفظ على شوبيفاي', async b => {
      b.disabled = true; b.innerHTML = '<div class="spinner"></div>';
      try { await Shopify.updateShipping(o, { name: $('#eoN', sh.el).value.trim(), phone: $('#eoP', sh.el).value.trim(), address: $('#eoA', sh.el).value.trim(), city: $('#eoC', sh.el).value.trim() }); toast('اتعدّل على شوبيفاي ✓', 'ok'); sh.close(); after && after(); }
      catch (e) { b.disabled = false; b.textContent = 'حفظ على شوبيفاي'; handleErr(e); }
    }, 'primary']]);
}

// ---- the order sheet ----
async function openShopOrder(o, tab = 'confirm', after = () => viewShop()) {
  const s = orderToShipment(o, state.sectors || []);
  const sh = sheet(o.name, `
    <div class="card card-pad">
      <div class="row between"><div><div class="h2">${esc(s.client_name)}</div><div class="small muted">${esc((state.sectors || []).find(x => x.id === s.sector_id)?.area || o.shippingAddress?.city || '')}</div></div><span class="amount" style="font-size:20px">${money(s.price)} <span class="tiny">ج.م</span></span></div>
      <div class="row wrap" style="gap:6px;margin-top:8px">${s.phone_1 ? historyBadge(s.phone_1) : '<span class="badge critical">مفيش موبايل</span>'}${waBadge(o.name)}${o.displayFinancialStatus === 'PAID' ? '<span class="badge info">مدفوع</span>' : ''}</div>
      <div class="actions" style="margin-top:12px">
        <a class="action" href="tel:${esc(s.phone_1)}">${ic('phone')}اتصال</a>
        <button class="action" id="soWa">${ic('whatsapp')}واتساب</button>
        <button class="action" id="soEdit">${ic('edit')}تعديل</button>
        <button class="action" id="soShop">${ic('bag')}في شوبيفاي</button>
      </div>
    </div>
    <div class="card"><dl class="kv">
      <dt>الموبايل</dt><dd class="ltr" style="text-align:right">${esc([s.phone_1, s.phone_2].filter(Boolean).join(' / '))}</dd>
      <dt>العنوان</dt><dd>${esc(s.address)}</dd>
      <dt>المنتج</dt><dd>${esc(s.product_name)}</dd>
      ${o.note ? `<dt>ملاحظة</dt><dd>${esc(o.note)}</dd>` : ''}
      <dt>تاريخ الأوردر</dt><dd>${new Date(o.createdAt).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'long' })}</dd>
    </dl></div>
    <div id="soLink"></div>`,
    tab === 'confirm'
      ? [['إلغاء الأوردر', async b => { if (!confirm(`تلغي ${o.name} على شوبيفاي؟`)) return; b.disabled = true; try { await Shopify.cancel(o.id); toast('اتلغى', 'ok'); sh.close(); after(); } catch (e) { b.disabled = false; handleErr(e); } }],
         ['العميل أكّد ✓', async b => { if (!confirm(`العميل أكّد ${o.name}؟ هيتعمل Fulfilled وينتقل لـ"جاهز للشحن".`)) return; b.disabled = true; b.innerHTML = '<div class="spinner"></div>'; try { await Shopify.fulfill(o.id, null); toast(`${o.name} اتأكد ✓`, 'ok'); sh.close(); after(); } catch (e) { b.disabled = false; b.textContent = 'العميل أكّد ✓'; handleErr(e); } }, 'primary']]
      : [['شيله من الجاهز (اتبعت لحازم)', async b => { if (!confirm(`تعتبر ${o.name} اتبعت لحازم وتشيله من "جاهز للشحن"؟`)) return; b.disabled = true; try { await Shopify.tag(o.id, [TAG_SENT]); toast('اتنقل لـ«اتبعت للشحن»', 'ok'); sh.close(); after(); } catch (e) { b.disabled = false; handleErr(e); } }],
         ['إلغاء الأوردر', async b => { if (!confirm(`تلغي ${o.name} على شوبيفاي؟`)) return; b.disabled = true; try { await Shopify.cancel(o.id); toast('اتلغى', 'ok'); sh.close(); after(); } catch (e) { b.disabled = false; handleErr(e); } }]]);
  $('#soWa', sh.el).onclick = () => waCompose({ order: o }, 'confirm', async k => { await markWa(o.name, k); });
  $('#soEdit', sh.el).onclick = () => { sh.close(); editShopOrder(o, after); };
  $('#soShop', sh.el).onclick = () => window.open(Shopify.adminUrl(o.id), '_blank');
  // Is there already a shipment for this customer / order on Hazem? Offer to link it.
  try {
    const mine = await Hazem.shipments({ order_id: cleanOrderNo(o), items: 10 });
    const byNo = mine.find(x => String(x.order_id).replace(/\D/g, '') === cleanOrderNo(o));
    const phone = (await Hazem.shipments({ phone: s.phone_1, items: 10 }).catch(() => [])).filter(x => x.category === 'active' || x.category === 'postponed');
    const cand = byNo || phone[0];
    if (cand && $('#soLink', sh.el)) {
      $('#soLink', sh.el).innerHTML = `<div class="banner warning" style="display:block"><b>📦 فيه شحنة على حازم ${byNo ? 'بنفس رقم الأوردر' : 'بنفس الموبايل'}: <span class="ltr">${esc(cand.waybill)}</span></b><div class="small">${esc(cand.status)} · ${esc(cand.consignee)} · ${money(cand.cod)} ج.م</div>
        <button class="btn sm block" id="soLinkBtn" style="margin-top:8px">${ic('check')} دي نفس الشحنة — اربطها وانقل الأوردر لـ«اتبعت للشحن»</button></div>`;
      $('#soLinkBtn', sh.el).onclick = async e => { e.currentTarget.disabled = true; try { await linkOrder(o, cand); toast('اتربط ✓', 'ok'); sh.close(); after(); } catch (err) { e.currentTarget.disabled = false; handleErr(err); } };
    }
  } catch {}
}

// ---- multi-select on the "needs confirmation" list ----
function bindConfirmList(body, orders, rerender) {
  state.confSel = state.confSel || new Set();
  const paint = () => {
    $$('.item[data-i]', body).forEach(it => { const on = state.confSel.has(orders[it.dataset.i].name); it.classList.toggle('selected', on); const c = it.querySelector('.check'); if (c) c.classList.toggle('on', on); });
    bar();
  };
  const bar = () => {
    let b = $('#confBar'); const n = state.confSel.size;
    if (!n) { b?.remove(); body.style.paddingBottom = ''; $$('.item .check', body).forEach(c => c.remove()); return; }
    if (!b) { b = document.createElement('div'); b.id = 'confBar'; b.className = 'sel-bar'; document.body.appendChild(b); }
    body.style.paddingBottom = '140px';
    const all = orders.every(o => state.confSel.has(o.name));
    b.innerHTML = `<div class="row between" style="margin-bottom:8px"><b>تم تحديد ${n}</b><span class="row" style="gap:6px"><button class="btn sm" id="cbAll">${all ? 'إلغاء الكل' : 'تحديد الكل'}</button><button class="icon-btn" id="cbX">${ic('close')}</button></span></div>
      <div class="row" style="gap:8px"><button class="btn wa grow" id="cbWa">${ic('whatsapp')} تأكيد واتساب</button><button class="btn primary grow" id="cbOk">${ic('check')} العميل أكّد</button><button class="btn danger grow" id="cbDel">${ic('close')} إلغاء</button></div>`;
    const picked = () => orders.filter(o => state.confSel.has(o.name));
    $('#cbX').onclick = () => { state.confSel = new Set(); paint(); };
    $('#cbAll').onclick = () => { state.confSel = all ? new Set() : new Set(orders.map(o => o.name)); paint(); };
    $('#cbWa').onclick = () => { const l = picked(); state.confSel = new Set(); bar(); waQueue(l); };
    const bulk = async (label, fn, askText) => {
      const l = picked(); if (!confirm(`${askText} (${l.length} أوردر)؟`)) return;
      const p = sheet(label, `<div class="card card-pad"><div class="progress"><span id="bpg" style="width:0"></span></div><div class="log" id="blog" style="margin-top:10px"></div></div>`, [['تم', () => { p.close(); state.confSel = new Set(); bar(); rerender(); }]]);
      for (let i = 0; i < l.length; i++) {
        try { await fn(l[i]); $('#blog', p.el).insertAdjacentHTML('beforeend', `<div>✅ ${esc(l[i].name)}</div>`); } catch (e) { $('#blog', p.el).insertAdjacentHTML('beforeend', `<div>❌ ${esc(l[i].name)}: ${esc(e.message)}</div>`); }
        $('#bpg', p.el).style.width = ((i + 1) / l.length * 100) + '%';
      }
    };
    $('#cbOk').onclick = () => bulk('العميل أكّد', o => Shopify.fulfill(o.id, null), 'العميل أكّد');
    $('#cbDel').onclick = () => bulk('إلغاء الأوردرات', o => Shopify.cancel(o.id), 'تلغي على شوبيفاي');
  };
  $$('.item[data-i]', body).forEach(it => {
    const o = orders[it.dataset.i]; let t = null, long = false;
    const toggle = () => { state.confSel.has(o.name) ? state.confSel.delete(o.name) : state.confSel.add(o.name); if (!it.querySelector('.check')) it.insertAdjacentHTML('afterbegin', '<span class="check"></span>'); paint(); };
    it.addEventListener('touchstart', () => { long = false; t = setTimeout(() => { long = true; navigator.vibrate?.(30); toggle(); }, 480); }, { passive: true });
    it.addEventListener('touchend', () => clearTimeout(t)); it.addEventListener('touchmove', () => clearTimeout(t), { passive: true });
    it.addEventListener('contextmenu', e => { e.preventDefault(); if (!long) toggle(); long = true; });
    it.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      if (long) { long = false; return; }
      if (state.confSel.size) toggle(); else openShopOrder(o, 'confirm', rerender);
    });
  });
  paint();
}
