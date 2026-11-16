// When the courier records a FULL successful delivery (status 5, not partial), the Shopify order is
// marked fulfilled + paid automatically. A delivery the courier's balance shows as partial, exchanged,
// returned or collected below the order total is left alone for a manual check.
async function autoMarkPaid(manual = false) {
  if (!Shopify.ready || !Hazem.creds) return 0;
  if (!manual && (await Store.get('auto_paid', true)) === false) return 0;
  if (!manual && Date.now() - (state.autoPaidAt || 0) < 5 * 60000) return 0;
  state.autoPaidAt = Date.now();
  const orders = await Shopify.sent();
  if (!orders.length) return 0;
  const from = new Date(); from.setDate(from.getDate() - 45);
  const ships = await Hazem.shipments({ status: STATUS.full, sfrom: ymd(from), sto: ymd(new Date()), items: 1000 });
  if (!ships.length) return 0;
  const byOrder = {}, byWb = {};
  ships.filter(s => STATUS.full.includes(Number(s.statusId))).forEach(s => { if (s.order_id) byOrder[s.order_id] = s; byWb[s.waybill] = s; });
  const hits = orders.map(o => {
    const wb = (o.tags.find(t => t.startsWith('HZM-')) || '').slice(4) || state.sentMap[o.name]?.waybill;
    const ship = byOrder[o.name.replace(/\D/g, '')] || byWb[wb];
    return ship ? { o, ship } : null;
  }).filter(Boolean);
  if (!hits.length) return 0;
  let ops = [];
  try { ops = await Hazem.opsFor(hits.map(h => h.ship.waybill)); } catch {}
  let done = 0; const review = [];
  for (const { o, ship } of hits) {
    const mine = ops.filter(op => op.waybill === ship.waybill && !op.isPayout);
    const expected = num(o.currentTotalPriceSet?.shopMoney?.amount);
    const notFull = mine.some(op => op.isReturn || /جزئي|استبدال/.test(op.type));
    const collected = mine.filter(op => !op.isReturn).reduce((a, op) => a + op.value, 0);
    if (notFull || (mine.length && expected && collected + 0.5 < expected)) { review.push(o.name); continue; }
    try {
      await Shopify.fulfill(o.id, ship.waybill);
      if (o.displayFinancialStatus !== 'PAID') await Shopify.markPaid(o.id);
      await Shopify.tag(o.id, [TAG_DELIVERED]);
      done++;
    } catch {}
  }
  if (done) toast(`✅ ${done} أوردر اتسلّم كامل واتعلّم «مدفوع» على شوبيفاي`, 'ok');
  else if (manual) toast(review.length ? `${review.length} أوردر محتاج مراجعة (جزئي أو مبلغ أقل): ${review.slice(0, 3).join('، ')}` : 'مفيش أوردرات جديدة اتسلّمت كاملة');
  if (done && state.tab === 'shop' && !sheetStack.length) { try { await refreshTab(); } catch {} }
  return done;
}
const autoPaidTick = () => { if (!document.hidden) autoMarkPaid().catch(() => {}); };
setTimeout(autoPaidTick, 6000);
setInterval(autoPaidTick, 10 * 60000);
document.addEventListener('visibilitychange', autoPaidTick);
window.Capacitor?.Plugins?.App?.addListener?.('resume', autoPaidTick);
