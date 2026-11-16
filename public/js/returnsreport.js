// "شيت المرتجعات": the courier's returns sheet as an Excel file you can review against your own records —
// codes, order numbers, the final status, the failure reason, the return-shipping fee and what was really paid.
async function openReturnsReport() {
  const base = state.shipRange || periodRange('30');
  let range = { ...base }, scope = 'returned';
  const sh = sheet('شيت المرتجعات (إكسيل)', `
    <div class="banner info small" style="display:block">بيطلّع كل شحنات المرتجعات اللي حالتها اتغيّرت في الفترة، ومعاها السبب وتكلفة شحن المرتجع والمدفوع منها، وأكواد البوالص مرتّبة جاهزة تراجعها مع الحسابات.</div>
    <div class="card card-pad">
      <div class="chips" id="rrP">${[['7', '7 أيام'], ['30', '30 يوم'], ['90', '3 شهور']].map(([k, l]) => `<button class="chip" data-p="${k}">${l}</button>`).join('')}</div>
      <div class="row" style="gap:8px"><div class="field grow"><label>من</label><input type="date" id="rrFrom" value="${range.from}"></div><div class="field grow"><label>إلى</label><input type="date" id="rrTo" value="${range.to}"></div></div>
      <div class="field" style="margin-top:6px"><label>إيه اللي يتضمّن؟</label></div>
      <div class="seg" id="rrS"><button data-s="returned" class="on">المرتجعات والرفض</button><button data-s="all">كل الحالات المنتهية (تسليم + مرتجع)</button></div>
    </div><div id="rrMsg"></div>`, [['تجهيز الشيت', go, 'primary']]);
  $$('#rrP .chip', sh.el).forEach(c => c.onclick = () => { const r = periodRange(c.dataset.p); $('#rrFrom', sh.el).value = r.from; $('#rrTo', sh.el).value = r.to; $$('#rrP .chip', sh.el).forEach(x => x.classList.toggle('on', x === c)); });
  $$('#rrS button', sh.el).forEach(b => b.onclick = () => { scope = b.dataset.s; $$('#rrS button', sh.el).forEach(x => x.classList.toggle('on', x === b)); });

  async function go(btn) {
    const from = $('#rrFrom', sh.el).value, to = $('#rrTo', sh.el).value;
    if (!from || !to) return toast('اختار الفترة', 'err');
    btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
    const msg = t => { const m = $('#rrMsg', sh.el); if (m) m.innerHTML = `<div class="small muted" style="padding:8px">${t}</div><div class="progress"><span id="rrPg" style="width:0"></span></div>`; };
    const pg = p => { const e = $('#rrPg', sh.el); if (e) e.style.width = p + '%'; };
    try {
      if (!window.ExcelJS) await loadScript('vendor/exceljs.min.js');
      msg('بحمّل المرتجعات من حازم…');
      const statuses = scope === 'all' ? [...new Set(STATUS.returned.concat([13, 25, 31], STATUS.delivered))] : [...new Set(STATUS.returned.concat([13, 25, 31]))];
      const ships = (await Hazem.shipments({ sfrom: from, sto: to, status: statuses, items: 1000 })).filter(x => x.waybill && statuses.includes(Number(x.statusId)));
      if (!ships.length) { btn.disabled = false; btn.textContent = 'تجهيز الشيت'; return toast('مفيش شحنات في الفترة دي', 'err'); }
      msg(`لقيت ${ships.length} شحنة — بجيب تكلفة شحن المرتجع…`); pg(15);
      let ops = [];
      try { ops = await Hazem.opsFor(ships.map(s => s.waybill)); } catch {}
      const retFee = {}; ops.forEach(o => { if (o.isReturn && o.waybill) retFee[o.waybill] = o; });
      msg('بجيب أسباب الرفض…');
      let done = 0; const failed = ships.filter(s => hasReason(s));
      await pool(failed, 4, async s => { s.rInfo = await reasonFor(s); done++; pg(15 + done / Math.max(1, failed.length) * 75); });
      msg('بكتب الشيت…'); pg(95);
      const rows = ships.map(s => {
        const op = retFee[s.waybill], r = s.rInfo || {};
        const fee = op ? op.fee : null, paid = op ? op.paid : null;
        return { s, r, fee, paid, short: op ? Math.max(0, op.fee - op.paid) : null, final: (s.status || r.lastStatus || '').replace(/^\d+\s*-\s*/, '') };
      }).sort((a, b) => wbKey(a.s.waybill) - wbKey(b.s.waybill));
      const store = (await WA.cfg()).store || state.shopName || '';
      const buf = await buildReturnsWorkbook(rows, store, { from, to });
      const b64 = btoa(Array.from(new Uint8Array(buf), c => String.fromCharCode(c)).join(''));
      const name = `شيت-المرتجعات-${from}_${to}.xlsx`;
      const P = window.Capacitor?.Plugins;
      sh.close();
      if (P?.Filesystem && P?.Share) {
        const w = await P.Filesystem.writeFile({ path: name, data: b64, directory: 'CACHE' });
        await P.Share.share({ title: 'شيت المرتجعات', text: `شيت مرتجعات ${from} ← ${to} — ${rows.length} شحنة`, files: [w.uri] });
      } else { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([buf])); a.download = name; a.click(); }
    } catch (e) { btn.disabled = false; btn.textContent = 'تجهيز الشيت'; if (!/cancel/i.test(e.message)) handleErr(e); }
  }
}

async function buildReturnsWorkbook(rows, store, range) {
  const wb = new ExcelJS.Workbook(); wb.creator = 'شحناتي'; wb.created = new Date();
  const C = { ink: 'FF1A1A1A', head: 'FF303030', white: 'FFFFFFFF', grey: 'FFF2F2F2', line: 'FFBDBDBD', total: 'FFE8E8E8', yellow: 'FFFFF59D', red: 'FFFFCDD2', green: 'FFC8E6C9' };
  const bd = { top: { style: 'thin', color: { argb: C.line } }, left: { style: 'thin', color: { argb: C.line } }, bottom: { style: 'thin', color: { argb: C.line } }, right: { style: 'thin', color: { argb: C.line } } };
  const font = (o = {}) => ({ name: 'Arial', size: 11, ...o });
  const money = '#,##0';
  const fill = argb => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });
  const isDelivered = x => STATUS.delivered.includes(Number(x.s.statusId));
  const nCod = x => num(x.s.cod);

  // ---------- Sheet 1: the returns sheet ----------
  const ws = wb.addWorksheet('شيت المرتجعات', { views: [{ rightToLeft: true, state: 'frozen', ySplit: 5 }], pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 } });
  const cols = [['مسلسل', 7], ['رقم البوليصة', 16], ['كود العميل', 12], ['رقم الطلب', 11], ['الراسل', 14], ['COD', 11], ['المرسل إليه', 22], ['المنطقة', 15], ['التليفون', 14],
    ['الحالة النهائية', 20], ['سبب فشل التسليم', 26], ['ملاحظة المندوب', 24], ['تكلفة شحن المرتجع', 13], ['المدفوع من الشحن', 13], ['الناقص', 10], ['آخر تحديث', 17], ['تمت المراجعة ✓', 12]];
  ws.columns = cols.map(([, w]) => ({ width: w }));
  const N = cols.length, last = String.fromCharCode(64 + N);
  ws.mergeCells(`A1:${last}1`);
  const t = ws.getCell('A1'); t.value = `شيت المرتجعات${store ? ' — ' + store : ''}`; t.font = font({ size: 16, bold: true, color: { argb: C.white } }); t.fill = fill(C.ink); t.alignment = { horizontal: 'center', vertical: 'middle' }; ws.getRow(1).height = 30;
  ws.mergeCells(`A2:${last}2`);
  const sub = ws.getCell('A2'); sub.value = `الفترة: ${range.from} ← ${range.to}   |   عدد الشحنات: ${rows.length}   |   تاريخ التجهيز: ${new Date().toLocaleDateString('ar-EG-u-nu-latn')}`; sub.alignment = { horizontal: 'center' }; sub.font = font({ size: 10, color: { argb: 'FF555555' } });
  const hr = ws.getRow(4);
  cols.forEach(([h], i) => { const c = hr.getCell(i + 1); c.value = h; c.font = font({ bold: true, color: { argb: C.white } }); c.fill = fill(C.head); c.border = bd; c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }; });
  hr.height = 32;
  rows.forEach((x, i) => {
    const s = x.s;
    const r = ws.addRow([i + 1, s.waybill, s.client_code || '', s.order_id || '', store, nCod(x), s.consignee || '', s.area || '', s.phone1 || '', x.final, x.r.reason || '', x.r.note || '',
      x.fee ?? '', x.paid ?? '', x.short ?? '', (s.last_change || s.date || '').slice(0, 16), '']);
    r.eachCell({ includeEmpty: true }, (c, n) => { c.border = bd; c.font = font({ size: 10 }); c.alignment = { vertical: 'middle', horizontal: [6, 13, 14, 15].includes(n) ? 'center' : 'right', wrapText: [7, 11, 12].includes(n) }; if ([6, 13, 14, 15].includes(n)) c.numFmt = money; });
    r.getCell(9).alignment = { horizontal: 'left', vertical: 'middle' };
    const f = isDelivered(x) ? C.green : x.paid == null ? null : x.paid <= 0 ? C.red : x.short > 0 ? C.yellow : C.green;
    if (f) r.getCell(15).fill = fill(f);
    if (x.short > 0) r.getCell(15).font = font({ size: 10, bold: true, color: { argb: 'FFC62828' } });
  });
  const first = 5, lastRow = 4 + rows.length;
  const tr = ws.addRow([]); ws.mergeCells(tr.number, 1, tr.number, 5); tr.getCell(1).value = `الإجمالي (${rows.length} شحنة)`; tr.getCell(1).alignment = { horizontal: 'center' };
  const sumOf = n => rows.reduce((a, x) => a + (n === 6 ? nCod(x) : n === 13 ? (x.fee || 0) : n === 14 ? (x.paid || 0) : (x.short || 0)), 0);
  [6, 13, 14, 15].forEach(n => { const L = String.fromCharCode(64 + n); tr.getCell(n).value = { formula: `SUM(${L}${first}:${L}${lastRow})`, result: sumOf(n) }; tr.getCell(n).numFmt = money; tr.getCell(n).alignment = { horizontal: 'center' }; });
  tr.eachCell({ includeEmpty: true }, c => { c.font = font({ bold: true }); c.fill = fill(C.total); c.border = bd; });
  ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: lastRow, column: N } };

  // ---------- Sheet 2: counts & accounts ----------
  const s2 = wb.addWorksheet('الأعداد والحسابات', { views: [{ rightToLeft: true }] });
  s2.columns = [{ width: 34 }, { width: 12 }, { width: 14 }, { width: 16 }, { width: 16 }, { width: 14 }];
  const block = (title, key, extra = false) => {
    const g = {};
    for (const x of rows) { const k = key(x) || 'غير محدد'; const a = g[k] || (g[k] = { n: 0, cod: 0, fee: 0, paid: 0, short: 0 }); a.n++; a.cod += nCod(x); a.fee += x.fee || 0; a.paid += x.paid || 0; a.short += x.short || 0; }
    const tt = s2.addRow([title]); s2.mergeCells(tt.number, 1, tt.number, 6); tt.getCell(1).font = font({ size: 13, bold: true, color: { argb: C.white } }); tt.getCell(1).fill = fill(C.ink); tt.height = 24;
    const h = s2.addRow(['', 'العدد', 'إجمالي COD', 'تكلفة شحن المرتجع', 'المدفوع', 'الناقص']);
    h.eachCell(c => { c.font = font({ bold: true, color: { argb: C.white } }); c.fill = fill(C.head); c.border = bd; c.alignment = { horizontal: 'center' }; });
    const entries = Object.entries(g).sort((a, b) => b[1].n - a[1].n);
    const startRow = s2.rowCount + 1;
    entries.forEach(([k, a]) => { const r = s2.addRow([k, a.n, a.cod, a.fee, a.paid, a.short]); r.eachCell((c, n) => { c.border = bd; c.font = font({ size: 10 }); if (n >= 3) c.numFmt = money; c.alignment = { horizontal: n === 1 ? 'right' : 'center' }; }); });
    const endRow = s2.rowCount;
    const tot = s2.addRow(['الإجمالي']);
    ['B', 'C', 'D', 'E', 'F'].forEach((L, i) => { const c = tot.getCell(i + 2); c.value = { formula: `SUM(${L}${startRow}:${L}${endRow})`, result: entries.reduce((a, [, v]) => a + [v.n, v.cod, v.fee, v.paid, v.short][i], 0) }; c.numFmt = i ? money : '0'; c.alignment = { horizontal: 'center' }; });
    tot.eachCell({ includeEmpty: true }, c => { c.font = font({ bold: true }); c.fill = fill(C.total); c.border = bd; });
    s2.addRow([]);
    void extra;
  };
  block('حسب الحالة النهائية', x => x.final);
  block('حسب سبب فشل التسليم', x => x.r.reason || (isDelivered(x) ? 'تم التسليم' : 'بدون سبب مكتوب'));
  block('حسب المنطقة', x => x.s.area);

  // ---------- Sheet 3: codes by status, for quick comparison ----------
  const s3 = wb.addWorksheet('الأكواد', { views: [{ rightToLeft: true }] });
  const byStatus = {}; rows.forEach(x => (byStatus[x.final || 'غير محدد'] ||= []).push(x.s.waybill));
  const keys = Object.keys(byStatus).sort((a, b) => byStatus[b].length - byStatus[a].length);
  s3.columns = keys.map(() => ({ width: 18 }));
  const hd = s3.addRow(keys.map(k => `${k} (${byStatus[k].length})`));
  hd.eachCell(c => { c.font = font({ bold: true, color: { argb: C.white } }); c.fill = fill(C.head); c.border = bd; c.alignment = { horizontal: 'center', wrapText: true }; }); hd.height = 34;
  const maxLen = Math.max(...keys.map(k => byStatus[k].length));
  for (let i = 0; i < maxLen; i++) { const r = s3.addRow(keys.map(k => byStatus[k][i] || '')); r.eachCell({ includeEmpty: true }, c => { c.border = bd; c.font = font({ size: 10 }); c.alignment = { horizontal: 'center' }; }); }
  return wb.xlsx.writeBuffer();
}
