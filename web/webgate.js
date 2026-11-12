// Web build only: route portal / Shopify calls through the same-origin relay and ask for the app password.
window.HH_ORIGIN = location.origin + '/hz';
window.SHOP_PROXY = location.origin + '/sp';
window.SYNC_BASE = location.origin;
(async () => {
  let ok = false;
  try { ok = (await fetch('/api/me', { cache: 'no-store' })).ok; } catch {}
  if (ok) return;
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#1a1a1a;display:flex;align-items:center;justify-content:center;padding:24px;font-family:Cairo,system-ui,sans-serif;direction:rtl';
  d.innerHTML = '<form style="background:#fff;border-radius:16px;padding:24px;width:100%;max-width:340px;text-align:center"><div style="font-size:22px;font-weight:700;margin-bottom:6px">شحناتي</div><div style="color:#666;font-size:14px;margin-bottom:14px">اكتب كلمة سر التطبيق</div><input type="password" id="gw" autocomplete="current-password" style="width:100%;padding:12px;font-size:16px;border:1.5px solid #ccc;border-radius:10px;box-sizing:border-box"><div id="ge" style="color:#c0392b;font-size:13px;min-height:20px;margin:6px 0"></div><button style="width:100%;padding:12px;font-size:16px;border:0;border-radius:10px;background:#1a1a1a;color:#fff">دخول</button></form>';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(d));
  if (document.body) document.body.appendChild(d);
  d.querySelector('form').onsubmit = async e => {
    e.preventDefault();
    const r = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: d.querySelector('#gw').value }) });
    if (r.ok) location.reload(); else d.querySelector('#ge').textContent = 'كلمة السر غلط';
  };
})();
