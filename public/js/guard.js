// Never leave a blank white screen: show a loader at once, and an error panel (with the reason) if the app fails to start.
(() => {
  const errs = [];
  const panel = () => {
    const app = document.getElementById('app'); if (!app || app.dataset.ok) return;
    const msg = errs.slice(0, 4).map(e => String(e).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))).join('<br>') || 'مفيش تفاصيل';
    app.innerHTML = `<div style="padding:28px 20px;font-family:Cairo,system-ui,sans-serif;direction:rtl;text-align:center">
      <div style="font-size:42px">⚠️</div><h2 style="margin:8px 0">التطبيق مقدرش يفتح</h2>
      <div style="font-size:12px;color:#8a1f11;direction:ltr;text-align:left;background:#fff1ee;border-radius:10px;padding:10px;margin:12px 0;word-break:break-all">${msg}</div>
      <button onclick="location.reload()" style="padding:12px 20px;font-size:16px;border:0;border-radius:10px;background:#1a1a1a;color:#fff;margin:4px">إعادة المحاولة</button>
      <button onclick="try{localStorage.clear()}catch(e){};location.reload()" style="padding:12px 20px;font-size:16px;border:1px solid #ccc;border-radius:10px;background:#fff;margin:4px">مسح بيانات المتصفح وإعادة الفتح</button>
      <div style="font-size:12px;color:#666;margin-top:10px">ابعت الرسالة اللي فوق لو المشكلة مستمرة</div></div>`;
  };
  addEventListener('error', e => { errs.push(e.message ? `${e.message} (${(e.filename || '').split('/').pop()}:${e.lineno})` : 'تعذر تحميل ' + ((e.target && (e.target.src || e.target.href)) || '')); }, true);
  addEventListener('unhandledrejection', e => errs.push('promise: ' + (e.reason && e.reason.message || e.reason)));
  document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (app && !app.children.length) app.innerHTML = '<div style="padding:60px 20px;text-align:center;font-family:Cairo,system-ui,sans-serif;color:#555">جاري التحميل…</div>';
    new MutationObserver((_, o) => { if (app.querySelector('.login,.shell,.tabbar,#view')) { app.dataset.ok = '1'; o.disconnect(); } }).observe(app, { childList: true, subtree: true });
    setTimeout(() => { if (!app.querySelector('.login,.shell,.tabbar,#view')) panel(); }, 9000);
    setTimeout(() => { if (errs.length && !app.querySelector('.login,.shell,.tabbar,#view')) panel(); }, 2500);
  });
})();
