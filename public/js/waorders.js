// "أوردرات واتساب": paste a chat or attach screenshots -> Claude extracts the orders ->
// review -> create on Shopify (optional) and send to Hazem Halan, same as Shopify orders.

// Shopify: create an order for a WhatsApp sale (cash on delivery, custom line items).
Shopify.createOrder = async function (s, items, tags) {
  const parts = clean(s.client_name).split(' ');
  const money = a => ({ shopMoney: { amount: String(a || 0), currencyCode: 'EGP' } });
  const sum = items.reduce((a, i) => a + (i.unit_price || 0) * (i.quantity || 1), 0);
  const ship = Math.max(0, num(s.price) - sum);
  const d = await this.gql(`mutation($o: OrderCreateOrderInput!) { orderCreate(order: $o, options: { sendReceipt: false, sendFulfillmentReceipt: false }) { order { id name } userErrors { field message } } }`, {
    o: {
      currency: 'EGP', financialStatus: 'PENDING', sourceName: 'whatsapp', tags, note: s.notes || null, phone: null,
      shippingAddress: { firstName: parts[0] || 'عميل', lastName: parts.slice(1).join(' ') || '-', address1: s.address || '-', city: s._city || '-', province: s._gov || null, countryCode: 'EG', phone: s.phone_1 ? '+2' + s.phone_1 : null },
      lineItems: items.length ? items.map(i => ({ title: [i.name || 'منتج', i.code && !String(i.name).includes(i.code) ? 'كود ' + i.code : ''].filter(Boolean).join(' - '), variantTitle: [i.size, i.color].filter(Boolean).join(' / ') || null, quantity: Math.max(1, i.quantity || 1), priceSet: money(i.unit_price || 0), requiresShipping: true }))
        : [{ title: s.product_name || 'أوردر واتساب', quantity: 1, priceSet: money(num(s.price)), requiresShipping: true }],
      shippingLines: items.length && ship > 0 ? [{ title: 'شحن', priceSet: money(ship) }] : [],
    },
  });
  const e = d.orderCreate.userErrors[0]; if (e) throw new Error('شوبيفاي: ' + e.message);
  return d.orderCreate.order;
};

function waToShipment(o) {
  const items = o.items || [];
  const sum = items.reduce((a, i) => a + (i.unit_price || 0) * (i.quantity || 1), 0);
  const total = o.total_to_collect ?? (sum ? sum + (o.shipping_fee || 0) : null);
  const phones = findPhones(...(o.phones || []));
  const m = matchSector({ city: o.city_area, province: o.governorate, address1: o.address }, state.sectors || []);
  return {
    client_name: o.customer_name || '', phone_1: phones[0] || '', phone_2: phones[1] || '',
    address: [o.address, o.city_area, o.governorate].filter(Boolean).filter((x, i, a) => !a.slice(0, i).some(p => normAr(p).includes(normAr(x)))).join(' - '),
    sector_id: m?.sector.id || '', _confident: !!m?.confident, _city: o.city_area, _gov: o.governorate,
    price: total != null ? String(Math.round(total)) : '',
    product_name: items.map(i => `${i.name || ''}${i.code ? ' كود ' + i.code : ''}${[i.size, i.color].filter(Boolean).length ? ' (' + [i.size, i.color].filter(Boolean).join(' / ') + ')' : ''}${i.quantity > 1 ? ' ×' + i.quantity : ''}`.trim()).join(' + '),
    quantity: String(items.reduce((a, i) => a + (i.quantity || 1), 0) || 1),
    notes: o.notes || '', service_type: '1', order_id: '',
  };
}

async function openWaOrders() {
  await Promise.all([ensureSectors().catch(() => {}), loadCustomerHistory()]);
  await waLoad();
  const imgs = [];
  let channel = state.lastChannel || 'whatsapp';
  const sh = sheet('أوردر جديد من الشات', `
    <div id="waIn">
      <div class="seg" id="waCh"><button data-c="whatsapp" class="${channel === 'whatsapp' ? 'on' : ''}">💬 واتساب</button><button data-c="messenger" class="${channel === 'messenger' ? 'on' : ''}">📘 ماسنجر</button></div>
      <label class="card card-pad row" style="gap:10px;margin-bottom:10px"><input type="checkbox" id="waConfirmed" style="width:22px;height:22px"><span class="grow"><b>العميل أكّد بالفعل في الشات</b><div class="tiny">يروح على طول لـ"جاهز للشحن"</div></span></label>
      <div class="card card-pad">
        <div class="field"><label>الصق رسايل العميل هنا</label><textarea id="waText" style="min-height:130px" placeholder="مثال:&#10;الاسم: منى أحمد&#10;01012345678&#10;القاهرة - مدينة نصر - 10 شارع عباس العقاد&#10;كود 5289 مقاس L أزرق قطعة&#10;الإجمالي 1495"></textarea></div>
        <label class="btn block" style="border:1.5px dashed var(--border-strong);box-shadow:none">${ic('upload')} أو ارفع صور شاشة من الشات
          <input type="file" id="waImgs" accept="image/*" multiple hidden></label>
        <div class="row wrap" id="waThumbs" style="gap:6px;margin-top:8px"></div>
      </div>
      <button class="btn primary block" id="waGo">✨ طلّع الأوردرات</button>
      <div class="tiny" style="text-align:center;margin-top:6px" id="waVia"></div>
      <div class="card card-pad" style="margin-top:12px">
        <div class="h2" style="margin-bottom:4px">🆓 ببلاش باشتراك Claude Pro</div>
        <div class="small muted" style="margin-bottom:10px">١) انسخ الرسالة وافتح Claude ٢) ارفع صور الشات هناك وابعت ٣) انسخ رد Claude كله والصقه هنا</div>
        <button class="btn block" id="waCopy">📋 انسخ الرسالة وافتح Claude</button>
        <div class="field" style="margin:10px 0 8px"><textarea id="waReply" style="min-height:80px" placeholder="الصق رد Claude هنا…"></textarea></div>
        <button class="btn block" id="waParse">📥 طلّع الأوردرات من الرد</button>
      </div>
    </div>
    <div id="waOut"></div>`);
  const out = $('#waOut', sh.el);
  AI.provider().then(p => { $('#waVia', sh.el).textContent = p === 'gemini' ? 'بيقرا الرسايل والصور بـ Gemini' : p === 'claude' ? 'بيقرا الرسايل والصور بـ Claude API' : 'مفيش مفتاح ذكاء اصطناعي — استخدم Claude Pro تحت، أو اربط مفتاح من المزيد'; });
  $$('#waCh button', sh.el).forEach(b => b.onclick = () => { channel = state.lastChannel = b.dataset.c; $$('#waCh button', sh.el).forEach(x => x.classList.toggle('on', x === b)); });
  // New orders land in the WhatsApp/Messenger section of the Orders tab.
  const addOrders = async orders => {
    if (!orders.length) return toast('مالقيتش أوردرات', 'err');
    const stage = $('#waConfirmed', sh.el).checked ? 'ready' : 'confirm';
    const toShop = Shopify.ready && (await Store.get('wa_to_shopify', true)) !== false;
    let shopOk = 0, shopFail = '';
    for (const o of orders) {
      const d = { id: String(Date.now()) + Math.floor(Math.random() * 1e6), raw: o, s: waToShipment(o), items: o.items || [], missing: o.missing || [], channel, stage };
      // Register it in Shopify now, so every order (website, WhatsApp, Messenger) is in one place.
      if (toShop) {
        try {
          const so = await Shopify.createOrder(d.s, d.items, [channel, TAG_WA]);
          d.shop = { id: so.id, name: so.name }; d.s.order_id = so.name.replace('#', ''); shopOk++;
        } catch (e) { shopFail = e.message; }
      }
      state.waDrafts.push(d); if (stage === 'ready') (state.waSel = state.waSel || new Set()).add(d.id);
    }
    await Store.set('wa_drafts', state.waDrafts);
    toast(`اتضاف ${orders.length} أوردر في «${stage === 'ready' ? 'جاهز للشحن' : 'محتاج تأكيد'}» ✓` + (toShop ? (shopOk === orders.length ? ' وسجّلناهم في شوبيفاي' : ` — اتسجل ${shopOk} في شوبيفاي (${String(shopFail).slice(0, 60)})`) : ''), shopFail ? '' : 'ok');
    sh.close();
    state.orderSrc = 'wa'; state.shopTab = stage;
    state.tab === 'shop' ? viewShop() : go('shop');
    return;
  };
  $('#waCopy', sh.el).onclick = async () => {
    const msg = await AI.manualPrompt($('#waText', sh.el).value);
    const ok = await copyText(msg);
    toast(ok ? 'اتنسخت ✓ — الصقها في Claude وارفع صور الشات' : 'مقدرتش أنسخ — انسخها يدوي', ok ? 'ok' : 'err');
    // Opens the Claude app (or claude.ai); the message is pre-filled when it is short enough for a link.
    const url = 'https://claude.ai/new' + (msg.length < 6000 ? '?q=' + encodeURIComponent(msg) : '');
    setTimeout(() => window.open(url, '_blank'), 600);
  };
  $('#waParse', sh.el).onclick = async () => {
    try { await addOrders(AI.parseReply($('#waReply', sh.el).value)); $('#waReply', sh.el).value = ''; }
    catch (e) { toast(e.message, 'err'); }
  };
  $('#waImgs', sh.el).onchange = async e => {
    for (const f of e.target.files) { try { imgs.push(await imageToB64(f)); } catch (er) { toast(er.message, 'err'); } }
    $('#waThumbs', sh.el).innerHTML = imgs.map((im, i) => `<div style="position:relative"><img src="${im.preview}" style="width:56px;height:80px;object-fit:cover;border-radius:6px;border:1px solid var(--border)"><button data-rm="${i}" class="badge critical" style="position:absolute;top:-6px;left:-6px;border:0">✕</button></div>`).join('');
    $$('[data-rm]', sh.el).forEach(b => b.onclick = () => { imgs.splice(b.dataset.rm, 1); $('#waImgs', sh.el).dispatchEvent(new Event('change')); });
    e.target.value = '';
  };
  $('#waGo', sh.el).onclick = async () => {
    const text = $('#waText', sh.el).value;
    if (!text.trim() && !imgs.length) return toast('الصق الرسايل أو ارفع صورة الأول', 'err');
    if ((await AI.provider()) === 'manual') return openAiSettings(() => $('#waGo', sh.el).click());
    const b = $('#waGo', sh.el); b.disabled = true; b.innerHTML = '<div class="spinner"></div> بيقرا الرسايل…';
    try {
      await addOrders(await AI.extractAny({ text, images: imgs.flatMap(i => i.parts) }));
      $('#waText', sh.el).value = ''; imgs.length = 0; $('#waThumbs', sh.el).innerHTML = '';
    } catch (e) {
      if (e.message === 'NO_KEY' || e.message === 'MANUAL') openAiSettings();
      else toast(/401|authentication|api.key/i.test(e.message) ? 'المفتاح غلط — راجعه من المزيد' : /429|rate/i.test(e.message) ? 'ضغط على الخدمة، جرّب كمان دقيقة' : e.message, 'err');
    }
    b.disabled = false; b.innerHTML = '✨ طلّع الأوردرات';
  };

  function renderDrafts() {
    const list = state.waDrafts;
    if (!list.length) { out.innerHTML = ''; return; }
    out.innerHTML = `
      <div class="section-title">${list.length} أوردر جاهز للمراجعة</div>
      <div class="list">${list.map((d, i) => {
        const s = d.s, sec = (state.sectors || []).find(x => x.id === s.sector_id);
        const area = !s.sector_id ? '<span class="badge critical">اختار المنطقة</span>' : `<span class="badge ${s._confident ? 'success' : 'attention'}">${s._confident ? '' : 'راجع: '}${esc(sec?.area || '')}</span>`;
        const probs = [!s.phone_1 && 'مفيش موبايل', !s.price && 'المبلغ ناقص', ...d.missing].filter(Boolean);
        return `<div class="item" data-i="${i}"><div class="grow" data-open="${i}">
          <div class="row between"><span class="title">${esc(s.client_name || 'بدون اسم')}</span><span class="amount">${s.price ? money(s.price) + ' <span class="tiny">ج.م</span>' : '—'}</span></div>
          <div class="meta ellipsis">${esc(s.product_name || '')}</div>
          <div class="small muted ltr" style="text-align:right">${esc([s.phone_1, s.phone_2].filter(Boolean).join(' / '))}</div>
          <div class="row wrap" style="gap:6px;margin-top:6px">${area}${s.phone_1 ? historyBadge(s.phone_1) : ''}${probs.map(p => `<span class="badge warning">${esc(p)}</span>`).join('')}</div>
        </div><button class="icon-btn" data-del="${i}" title="مسح">${ic('close')}</button></div>`;
      }).join('')}</div>
      ${Shopify.ready ? `<label class="card card-pad row" style="gap:10px"><input type="checkbox" id="waShop" checked style="width:22px;height:22px"><span class="grow"><b>سجّلهم كأوردرات على شوبيفاي كمان</b><div class="tiny">عشان المبيعات والتقارير كلها تبقى في مكان واحد</div></span></label>` : ''}
      <button class="btn accent block" id="waSend">${ic('truck')} ابعت ${list.length} لحازم حلان</button>
      <div style="height:20px"></div>`;
    $$('[data-open]', out).forEach(c => c.onclick = () => {
      const d = list[c.dataset.open];
      openAdd(d.s, async vals => { d.s = { ...d.s, ...vals, _confident: true }; await Store.set('wa_drafts', list); renderDrafts(); });
    });
    $$('[data-del]', out).forEach(b => b.onclick = async () => { list.splice(b.dataset.del, 1); await Store.set('wa_drafts', list); renderDrafts(); });
    $('#waSend', out).onclick = () => sendDrafts($('#waShop', out)?.checked);
  }

  async function sendDrafts(toShopify) {
    const list = state.waDrafts;
    const bad = list.filter(d => !d.s.sector_id || !/^01[0125]\d{8}$/.test(d.s.phone_1) || !d.s.address || !d.s.price || !d.s.client_name);
    if (bad.length) return toast(`راجع ${bad.length} أوردر: ناقص اسم أو موبايل أو منطقة أو مبلغ`, 'err');
    const already = list.filter(d => openShipmentFor(d.s.phone_1));
    if (already.length && !confirm(`⚠️ ${already.length} عميل ليهم شحنة مفتوحة على حازم بنفس الموبايل:\n${already.map(d => `${d.s.client_name} ← ${openShipmentFor(d.s.phone_1)}`).join('\n')}\n\nلو دي نفس الأوردرات هتتسجل مرتين. تكمّل؟`)) return;
    const p = sheet('جاري الإرسال', `<div class="card card-pad"><div class="progress"><span id="pg" style="width:0"></span></div><div class="log" id="plog" style="margin-top:10px"></div></div>`, [['تم', () => { p.close(); renderDrafts(); }, 'primary']]);
    const log = t => $('#plog', p.el).insertAdjacentHTML('beforeend', `<div>${t}</div>`);
    const total = list.length; let ok = 0;
    for (let i = 0; i < total; i++) {
      const d = list[0];
      const vals = Object.fromEntries(Object.entries(d.s).filter(([k]) => !k.startsWith('_')));
      try {
        let order = null;
        if (toShopify && d.shop) { order = d.shop; vals.order_id = order.name.replace('#', ''); await Shopify.tag(order.id, [TAG_SENT]).catch(() => {}); }
        else if (toShopify) { order = await Shopify.createOrder(d.s, d.items, ['whatsapp', TAG_WA, TAG_SENT]); vals.order_id = order.name.replace('#', ''); }
        else vals.order_id = vals.order_id || 'WA' + String(Date.now()).slice(-6);
        await Hazem.addShipment(vals, state.addBase);
        const found = (await Hazem.shipments({ order_id: vals.order_id, items: 20 })).find(r => r.order_id === vals.order_id);
        if (order && found) await Shopify.tag(order.id, ['HZM-' + found.waybill]).catch(() => {});
        if (found) { state.sentMap[order?.name || 'WA-' + vals.order_id] = { waybill: found.waybill, id: found.id, price: vals.price }; }
        log(`✅ ${esc(d.s.client_name)}${order ? ' · ' + esc(order.name) : ''} ← <span class="ltr">${esc(found?.waybill || 'اتبعت')}</span>`); ok++;
        list.shift();
      } catch (e) { log(`❌ ${esc(d.s.client_name)}: ${esc(e.message)}`); list.push(list.shift()); }
      $('#pg', p.el).style.width = ((i + 1) / total * 100) + '%';
    }
    await Store.set('wa_drafts', list); await Store.set('sent_map', state.sentMap);
    $('.sheet-h h3', p.el).textContent = `اتبعت ${ok} من ${total}`;
  }
}

function openAiSettings(after) {
  const sh = sheet('ربط الذكاء الاصطناعي', `
    <div class="card card-pad">
      <div class="field"><label>مين يقرا رسايل وصور الواتساب؟</label></div>
      <div class="seg" id="aiProv"><button data-p="gemini">Gemini</button><button data-p="claude">Claude API</button><button data-p="manual">Claude Pro (يدوي)</button></div>
      <div id="aiBody"></div><div id="aiRes"></div>
    </div>`, [['حفظ واختبار', save, 'primary']]);
  const keys = {};
  let prov;
  const body = () => {
    const box = $('#aiBody', sh.el);
    if (prov === 'gemini') box.innerHTML = `
      <div class="banner info small" style="display:block">1. ادخل <b>aistudio.google.com</b> بحساب جوجل.<br>2. دوس <b>Get API key</b> ← <b>Create API key</b> وانسخه.<br>فيه <b>باقة مجانية</b> بحد يومي.</div>
      <div class="banner warning small" style="display:block">⚠️ في الباقة المجانية جوجل بتستخدم البيانات اللي بتتبعت (أسماء وأرقام وعناوين العملاء) لتحسين خدماتها. لو ده مضايقك فعّل الدفع عندهم أو استخدم Claude.</div>
      <div class="field"><label>مفتاح Gemini API</label><input id="kGem" class="ltr" type="password" placeholder="AIza..." autocomplete="off" value="${esc(keys.gemini || '')}"></div>`;
    else if (prov === 'claude') box.innerHTML = `
      <div class="banner info small" style="display:block">1. ادخل <b>console.anthropic.com</b> واعمل حساب.<br>2. اشحن رصيد (Billing) — كل مرة استخراج بتتكلف تقريبًا من 1 لـ 3 جنيه حسب عدد الصور.<br>3. من <b>API Keys</b> دوس <b>Create Key</b> وانسخه.<br><span class="tiny">اشتراك Claude Pro مش بيشتغل هنا، ده حساب منفصل.</span></div>
      <div class="field"><label>مفتاح Claude API</label><input id="kCl" class="ltr" type="password" placeholder="sk-ant-..." autocomplete="off" value="${esc(keys.claude || '')}"></div>`;
    else box.innerHTML = `<div class="banner success small" style="display:block">ببلاش باشتراكك في Claude Pro: في شاشة "أوردرات من واتساب" دوس <b>📋 انسخ الرسالة وافتح Claude</b>، ارفع صور الشات في Claude وابعت، وبعدين انسخ رده والصقه في التطبيق.</div>`;
  };
  const pick = p => { prov = p; $$('#aiProv button', sh.el).forEach(b => b.classList.toggle('on', b.dataset.p === p)); $('#aiRes', sh.el).innerHTML = ''; body(); };
  $$('#aiProv button', sh.el).forEach(b => b.onclick = () => { keys.gemini = $('#kGem', sh.el)?.value ?? keys.gemini; keys.claude = $('#kCl', sh.el)?.value ?? keys.claude; pick(b.dataset.p); });
  Promise.all([AI.provider(), AI.key(), Store.get('gemini_key', '')]).then(([p, c, g]) => { keys.claude = c; keys.gemini = g; pick(p); });
  async function save(btn) {
    btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
    try {
      if (prov === 'gemini') { const k = $('#kGem', sh.el).value.trim(); if (!k) throw new Error('الصق مفتاح Gemini الأول'); await AI.testGemini(k); await Store.set('gemini_key', k); }
      if (prov === 'claude') { const k = $('#kCl', sh.el).value.trim(); if (!k) throw new Error('الصق مفتاح Claude الأول'); await AI.test(k); await Store.set('ai_key', k); }
      await Store.set('ai_provider', prov);
      $('#aiRes', sh.el).innerHTML = `<div class="banner success">${prov === 'manual' ? 'اتحفظ ✓' : 'المفتاح شغّال ✓'}</div>`;
      setTimeout(() => { sh.close(); if (prov !== 'manual') after && after(); }, 700);
    } catch (e) { $('#aiRes', sh.el).innerHTML = `<div class="banner critical">${/401|403|auth|API key/i.test(e.message) ? 'المفتاح غلط' : esc(e.message)}</div>`; }
    btn.disabled = false; btn.textContent = 'حفظ واختبار';
  }
}
