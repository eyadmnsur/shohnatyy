// Move all app data (login, Shopify, WhatsApp templates, drafts, alert settings…) between devices.
async function backupAll() {
  const P = window.Capacitor?.Plugins?.Preferences, out = {};
  if (P) { for (const k of (await P.keys()).keys) out[k] = (await P.get({ key: k })).value; }
  else for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); out[k] = localStorage.getItem(k); }
  return out;
}
async function restoreAll(obj) {
  const P = window.Capacitor?.Plugins?.Preferences; let n = 0;
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v !== 'string') continue;
    try { JSON.parse(v); } catch { continue; }
    if (P) await P.set({ key: k, value: v }); else localStorage.setItem(k, v);
    n++;
  }
  return n;
}
function openBackup() {
  const sh = sheet('نسخ البيانات لجهاز تاني', `
    <div class="banner warning small" style="display:block">النسخة فيها <b>كلمة سر حازم ومفاتيح شوبيفاي</b> وكل إعداداتك. ابعتها لنفسك بس، ومتشاركهاش مع حد، وامسحها بعد ما تستخدمها.</div>
    <div class="card card-pad"><b>1) من الجهاز اللي فيه البيانات</b>
      <button class="btn block" id="bkCopy" style="margin-top:8px">📋 انسخ بيانات التطبيق</button></div>
    <div class="card card-pad"><b>2) على الجهاز الجديد</b>
      <div class="field" style="margin-top:8px"><textarea id="bkText" rows="4" class="ltr" placeholder="الصق البيانات هنا"></textarea></div>
      <button class="btn block primary" id="bkRestore">⬇️ استرجاع</button></div>`);
  $('#bkCopy', sh.el).onclick = async () => {
    const txt = 'SHOHNATY-BACKUP:' + btoa(unescape(encodeURIComponent(JSON.stringify(await backupAll()))));
    toast(await copyText(txt) ? 'اتنسخت — الصقها في الجهاز التاني' : 'تعذر النسخ', 'ok');
  };
  $('#bkRestore', sh.el).onclick = async () => {
    try {
      const t = $('#bkText', sh.el).value.trim().replace(/^SHOHNATY-BACKUP:/, '');
      const n = await restoreAll(JSON.parse(decodeURIComponent(escape(atob(t)))));
      toast(`اتسترجع ${n} إعداد — بيتعاد تشغيل التطبيق`, 'ok'); setTimeout(() => location.reload(), 1200);
    } catch { toast('البيانات مش سليمة، انسخها تاني', 'err'); }
  };
}

// ---- Live sync between devices -------------------------------------------------
async function applySynced(keys) {
  if (!keys.length) return;
  state.sentMap = await Store.get('sent_map', {}); state.overrides = await Store.get('overrides', {});
  try { await Shopify.load(); } catch {}
  const visible = ['wa_drafts', 'wa_sent', 'sent_map', 'overrides', 'wa_log', 'shopify_cfg'].some(k => keys.includes(k));
  if (visible && state.tab === 'shop' && !sheetStack.length && !state.selMode && $('#view')) { try { await refreshTab(); } catch {} }
}
async function syncNow(quiet = true) {
  if (!Sync.on) return;
  try { await applySynced(await Sync.pull()); if (!quiet) toast('المزامنة تمت', 'ok'); } catch { if (!quiet) toast('تعذرت المزامنة — اتأكد من النت واللينك', 'err'); }
}
setInterval(() => { if (!document.hidden) syncNow(); }, 20000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) syncNow(); });
window.Capacitor?.Plugins?.App?.addListener?.('resume', () => syncNow());

function openSyncSetup() {
  const web = !!window.SYNC_BASE;
  const sh = sheet('المزامنة بين الموبايل والموقع', web ? `
    <div class="banner info small" style="display:block">المزامنة <b>شغّالة تلقائي</b> على الموقع. أي حاجة تتغيّر هنا بتظهر على الموبايل والعكس، والتحديث كل ~20 ثانية.</div>
    <button class="btn block" id="syNow">🔄 زامن دلوقتي</button>` : `
    <div class="banner info small" style="display:block">اكتب لينك موقعك وكلمة سر التطبيق، وبعدها أي حاجة تتغيّر هنا بتظهر على الموقع والعكس. بيانات الموبايل الحالية بتترفع للموقع أول مرة.</div>
    <div class="card card-pad">
      <div class="field"><label>لينك الموقع</label><input id="syUrl" class="ltr" placeholder="https://اسم-موقعك.vercel.app" inputmode="url"></div>
      <div class="field"><label>كلمة سر التطبيق</label><input id="syPw" type="password"></div>
      <div id="syState" class="small muted"></div>
    </div>`, web ? [] : [['إيقاف', async () => { await Sync.disable(); toast('المزامنة اتوقفت'); sh.close(); }], ['تفعيل ومزامنة', activate, 'primary']]);
  if (web) { $('#syNow', sh.el).onclick = () => syncNow(false); return; }
  Sync.config().then(c => { if (c) { $('#syUrl', sh.el).value = c.url; $('#syState', sh.el).textContent = '✅ المزامنة مفعّلة'; } });
  async function activate() {
    const url = $('#syUrl', sh.el).value.trim().replace(/\/+$/, ''), pw = $('#syPw', sh.el).value;
    if (!/^https:\/\//.test(url) || !pw) return toast('اكتب اللينك (https://…) وكلمة السر', 'err');
    try { const ch = await Sync.enable(url, pw); await applySynced(ch); toast('المزامنة اشتغلت ✅', 'ok'); sh.close(); }
    catch (e) { await Sync.disable(); toast(/401/.test(e.message) ? 'كلمة السر غلط' : /503/.test(e.message) ? 'قاعدة البيانات لسه متربطتش في Vercel' : 'تعذر الاتصال باللينك', 'err'); }
  }
}
