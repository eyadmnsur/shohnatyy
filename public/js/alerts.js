// Alert settings + alert center. The background checker (Android) writes "alerts_log";
// the toggles below are saved in "notify_prefs" and read by that checker.
const ALERT_TYPES = [
  ['underpay', '💸 العميل دفع أقل من المطلوب', 'شحن أقل في المرتجع، أو تحصيل أقل من قيمة الأوردر', true],
  ['returned', '↩️ مرتجع أو رفض', 'العميل رفض الاستلام أو الشحنة رجعت', true],
  ['partial', '🧩 تسليم جزئي', 'العميل استلم جزء من الأوردر', true],
  ['postponed', '📅 تأجيل أو العميل مردّش', 'مع سبب التأجيل والموعد الجديد', true],
  ['shopify_new', '🛍️ أوردر جديد على شوبيفاي', 'أول ما عميل يطلب من المتجر', true],
  ['delivered', '✅ شحنة اتسلّمت', 'إشعار هادي من غير صوت', false],
];
async function notifyPrefs() {
  const p = await Store.get('notify_prefs', null);
  const out = {};
  for (const [k, , , def] of ALERT_TYPES) out[k] = p && k in p ? p[k] : def;
  if (!p && (await Store.get('pay_alerts_on', true)) === false) out.underpay = false;
  return out;
}

function openAlertSettings() {
  const sh = sheet('التنبيهات', `
    <div class="banner info small" style="display:block">التطبيق بيشيّك على حازم حلان وشوبيفاي <b>كل ~15 دقيقة حتى وهو مقفول</b>، وكل نوع بيطلع بصوت مختلف. تقدر تغيّر صوت كل نوع من إعدادات الإشعارات في الموبايل.</div>
    <div class="list menu" id="alList"></div>
    <button class="btn block" id="alTest">🔔 جرّب تنبيه دلوقتي</button>
    <div class="banner warning small" style="display:block;margin-top:10px">لو موبايلك <b>شاومي / أوبو / ريلمي / فيفو / هواوي</b>: الإعدادات ← التطبيقات ← شحناتي ← البطارية ← <b>بدون قيود</b>، وإلا الموبايل ممكن يوقف الفحص وهو مقفول.</div>`);
  notifyPrefs().then(p => {
    $('#alList', sh.el).innerHTML = ALERT_TYPES.map(([k, l, d]) => `<label class="item" style="align-items:center"><span class="grow"><b>${l}</b><div class="tiny">${d}</div></span><input type="checkbox" data-al="${k}" ${p[k] ? 'checked' : ''} class="switch"></label>`).join('');
    $$('[data-al]', sh.el).forEach(c => c.onchange = async () => {
      p[c.dataset.al] = c.checked; await Store.set('notify_prefs', p);
      if (c.checked) askNotifyPermission();
      toast(c.checked ? 'اتفعّل' : 'اتقفل');
    });
  });
  $('#alTest', sh.el).onclick = async () => {
    await askNotifyPermission();
    try {
      await window.Capacitor?.Plugins?.LocalNotifications?.schedule({ notifications: [{ id: Date.now() % 100000, title: '↩️ مرتجع — HZM0000000 (تجربة)', body: 'السبب: العميل رفض الاستلام\nده تنبيه تجريبي من شحناتي', channelId: 'alert_returned' }] });
      toast('اتبعت تنبيه تجريبي', 'ok');
    } catch { toast('اسمح للتطبيق بالإشعارات من إعدادات الموبايل', 'err'); }
  };
}

const ALERT_ICON = { underpay: '💸', returned: '↩️', partial: '🧩', postponed: '📅', shopify_new: '🛍️', delivered: '✅' };
async function unreadAlerts() {
  const log = await Store.get('alerts_log', []), seen = await Store.get('alerts_read_at', 0);
  return (log || []).filter(a => a.t > seen).length;
}
async function updateBell() {
  const n = await unreadAlerts(), b = $('#bellDot');
  if (b) { b.hidden = !n; b.textContent = n > 99 ? '99+' : n; }
}
async function openAlertCenter() {
  const log = (await Store.get('alerts_log', [])) || [], seen = await Store.get('alerts_read_at', 0);
  let f = 'all';
  const sh = sheet('مركز التنبيهات', `<div class="chips" id="acF"></div><div id="acL"></div>`, [['⚙️ إعدادات التنبيهات', () => { sh.close(); openAlertSettings(); }]]);
  const types = ['all', ...ALERT_TYPES.map(x => x[0]).filter(k => log.some(a => a.type === k))];
  const render = () => {
    $('#acF', sh.el).innerHTML = types.map(k => `<button class="chip ${f === k ? 'on' : ''}" data-f="${k}">${k === 'all' ? 'الكل' : ALERT_ICON[k] + ' ' + log.filter(a => a.type === k).length}</button>`).join('');
    $$('#acF [data-f]', sh.el).forEach(b => b.onclick = () => { f = b.dataset.f; render(); });
    const list = log.filter(a => f === 'all' || a.type === f);
    $('#acL', sh.el).innerHTML = list.length ? `<div class="list">${list.map((a, i) => `
      <button class="item ${a.t > seen ? 'unread' : ''}" data-i="${i}"><div class="grow">
        <div class="row between"><b>${esc(a.title)}</b>${a.t > seen ? '<span class="badge info">جديد</span>' : ''}</div>
        <div class="small" style="white-space:pre-line">${esc(a.body)}</div>
        <div class="tiny">${new Date(a.t).toLocaleString('ar-EG-u-nu-latn', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</div>
      </div></button>`).join('')}</div>`
      : `<div class="card empty">${ic('alert')}<div>مفيش تنبيهات لسه</div><div class="small" style="margin-top:6px">أول ما يحصل مرتجع أو تأجيل أو دفع أقل أو أوردر جديد هتلاقيه هنا</div></div>`;
    $$('#acL [data-i]', sh.el).forEach(b => b.onclick = async () => {
      const a = list[b.dataset.i];
      if (a.type === 'shopify_new') { sh.close(); state.orderSrc = 'shopify'; state.shopTab = 'confirm'; return go('shop'); }
      if (!a.waybill) return;
      try { const r = (await Hazem.search(a.waybill, 'waybill')).find(x => x.waybill === a.waybill); if (r) openShipment(r); else toast('مش لاقي الشحنة'); } catch (e) { handleErr(e); }
    });
  };
  render();
  await Store.set('alerts_read_at', Date.now()); updateBell();
}

// Opened from a notification tap (flag set by the Android side), or coming back to the app.
async function checkOpenAlerts() {
  updateBell();
  if ((await Store.get('open_alerts', null)) === true) { await Store.del('open_alerts'); if (Hazem.creds) openAlertCenter(); }
}
window.Capacitor?.Plugins?.App?.addListener?.('resume', () => { checkOpenAlerts(); });
