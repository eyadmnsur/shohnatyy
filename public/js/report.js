// Professional Excel report of collection problems, to send to the courier's management.
// Uses ExcelJS (vendor/exceljs.min.js, loaded on first use) for real formatting: RTL, colours,
// borders, merged title, totals and per-courier / per-area summaries.

// A collection problem: a return where less than the set shipping was collected, or a
// delivery / partial delivery where the amount collected is below what was due.
function isProblemOp(o) {
  if (!o.waybill) return false;
  if (o.isReturn) return o.paid < o.fee;
  if (/جزئي/.test(o.type)) return true;
  const exp = expectedFor(o.waybill);
  return exp != null && o.value + 0.5 < exp;
}
function expectedFor(wb) {
  for (const v of Object.values(state.sentMap || {})) if (v.waybill === wb && v.price) return num(v.price);
  return null;
}

async function exportComplaint(ops, category = '') {
  ops = ops.filter(o => o.waybill);
  if (!ops.length) return toast('حدد عمليات الأول', 'err');
  const sh = sheet('تجهيز الشيت', `<div class="card card-pad"><div class="small" id="rpMsg">بجمع تفاصيل ${ops.length} شحنة من حازم حلان…</div><div class="progress" style="margin-top:10px"><span id="rpPg" style="width:0"></span></div></div>`);
  try {
    if (!window.ExcelJS) await loadScript('vendor/exceljs.min.js');
    // 1) Enrich each operation with its shipment and failure reason / courier.
    const rows = []; let done = 0;
    await pool(ops, 4, async o => {
      let s = null, r = {};
      try { s = (await Hazem.search(o.waybill)).find(x => x.waybill === o.waybill) || null; } catch {}
      if (s) { try { r = await reasonFor(s); } catch {} }
      const exp = o.isReturn ? o.fee : (expectedFor(o.waybill) ?? (s ? num(s.cod) : null) ?? o.value);
      const paid = o.value;
      rows.push({ o, s, r, exp, paid, short: Math.max(0, (exp || 0) - paid),
        kind: o.isReturn ? (paid <= 0 ? 'مرتجع ولم يُحصّل الشحن' : 'مرتجع وحُصّل شحن أقل من المحدد') : /جزئي/.test(o.type) ? 'تسليم جزئي' : 'تحصيل أقل من قيمة الأوردر' });
      done++; const pg = $('#rpPg', sh.el); if (pg) pg.style.width = (done / ops.length * 100) + '%';
    });
    rows.sort((a, b) => wbKey(a.o.waybill) - wbKey(b.o.waybill));
    $('#rpMsg', sh.el).textContent = 'بكتب الشيت…';
    const store = (await WA.cfg()).store || state.shopName || '';
    const buf = await buildComplaintWorkbook(rows, store, category);
    const b64 = btoa(Array.from(new Uint8Array(buf), c => String.fromCharCode(c)).join(''));
    const name = `${category ? category.replace(/\s+/g, '-') : 'مخالفات-تحصيل'}-${ymd(new Date())}.xlsx`;
    const P = window.Capacitor?.Plugins;
    sh.close();
    if (P?.Filesystem && P?.Share) {
      const w = await P.Filesystem.writeFile({ path: name, data: b64, directory: 'CACHE' });
      await P.Share.share({ title: 'تقرير مخالفات التحصيل', text: `تقرير مخالفات تحصيل — ${rows.length} شحنة — إجمالي العجز ${money(rows.reduce((a, x) => a + x.short, 0))} ج.م`, files: [w.uri] });
    } else {
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([buf])); a.download = name; a.click();
    }
    state.opSel = null; if (state.tab === 'money') renderOps();
  } catch (e) { sh.close(); if (!/cancel/i.test(e.message)) handleErr(e); }
}

async function buildComplaintWorkbook(rows, store, category = '') {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'شحناتي'; wb.created = new Date();
  const C = { ink: 'FF1A1A1A', head: 'FF303030', white: 'FFFFFFFF', yellow: 'FFFFF59D', red: 'FFFFCDD2', orange: 'FFFFE0B2', grey: 'FFF2F2F2', line: 'FFBDBDBD', total: 'FFE8E8E8' };
  const border = { top: { style: 'thin', color: { argb: C.line } }, left: { style: 'thin', color: { argb: C.line } }, bottom: { style: 'thin', color: { argb: C.line } }, right: { style: 'thin', color: { argb: C.line } } };
  const font = (o = {}) => ({ name: 'Arial', size: 11, ...o });
  const money = '#,##0 "ج.م"';
  const dates = rows.map(x => x.o.date).filter(Boolean).sort();
  const totExp = rows.reduce((a, x) => a + (x.exp || 0), 0), totPaid = rows.reduce((a, x) => a + x.paid, 0), totShort = rows.reduce((a, x) => a + x.short, 0);

  // ---------- Sheet 1: details ----------
  const ws = wb.addWorksheet((category || 'المخالفات').slice(0, 30), { views: [{ rightToLeft: true, state: 'frozen', ySplit: 8 }], pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 9 } });
  const cols = [
    ['م', 5], ['رقم البوليصة', 15], ['رقم الطلب', 10], ['اسم العميل', 22], ['الموبايل', 14], ['المنطقة', 14], ['العنوان', 34],
    ['حالة الشحنة', 18], ['سبب عدم الاستلام', 24], ['ملاحظة المندوب', 22], ['المندوب / المسؤول', 18],
    ['المبلغ المفروض', 14], ['المحصّل فعليًا', 14], ['العجز', 12], ['نوع المخالفة', 26], ['تاريخ العملية', 18], ['رد الإدارة', 24],
  ];
  ws.columns = cols.map(([, w]) => ({ width: w }));
  const N = cols.length, last = String.fromCharCode(64 + N);
  const band = (r, text, opts) => { ws.mergeCells(`A${r}:${last}${r}`); const c = ws.getCell(`A${r}`); c.value = text; Object.assign(c, opts); };
  band(1, `تقرير مخالفات تحصيل الشحن${category ? ' — ' + category : ''}${store ? ' — ' + store : ''}`, { font: font({ size: 16, bold: true, color: { argb: C.white } }), fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: C.ink } }, alignment: { horizontal: 'center', vertical: 'middle' } });
  ws.getRow(1).height = 32;
  band(2, `مُقدَّم إلى: إدارة شركة حازم حلان للشحن   |   تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG-u-nu-latn')}   |   الفترة: ${dates[0]?.slice(0, 10) || '-'} إلى ${dates[dates.length - 1]?.slice(0, 10) || '-'}`, { font: font({ size: 11, color: { argb: 'FF444444' } }), alignment: { horizontal: 'center' } });
  band(3, 'الشحنات التالية تم تحصيل مبالغ فيها أقل من القيمة المسجلة على النظام (أو لم يتم تحصيل مصاريف الشحن عند الارتجاع). برجاء المراجعة مع المناديب وتسوية الفروق.', { font: font({ size: 10, italic: true }), alignment: { horizontal: 'center', wrapText: true } });
  ws.getRow(3).height = 30;
  // summary boxes
  const sum = [['عدد الحالات', rows.length, '0'], ['إجمالي المفروض', totExp, money], ['إجمالي المحصّل', totPaid, money], ['إجمالي العجز', totShort, money]];
  sum.forEach(([label, val, fmt], i) => {
    const c1 = 2 + i * 4;
    ws.mergeCells(5, c1, 5, c1 + 2); ws.mergeCells(6, c1, 6, c1 + 2);
    const l = ws.getCell(5, c1), v = ws.getCell(6, c1);
    l.value = label; l.font = font({ size: 10, color: { argb: 'FF555555' } }); l.alignment = { horizontal: 'center' };
    v.value = val; v.numFmt = fmt; v.font = font({ size: 15, bold: true, color: { argb: i === 3 ? 'FFC62828' : C.ink } }); v.alignment = { horizontal: 'center' };
    for (let r = 5; r <= 6; r++) for (let c = c1; c <= c1 + 2; c++) { ws.getCell(r, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.grey } }; }
  });
  ws.getRow(6).height = 24;
  // header
  const hr = ws.getRow(8);
  cols.forEach(([h], i) => { const c = hr.getCell(i + 1); c.value = h; c.font = font({ bold: true, color: { argb: C.white } }); c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.head } }; c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }; c.border = border; });
  hr.height = 30;
  // rows
  rows.forEach((x, i) => {
    const s = x.s || {};
    const r = ws.addRow([i + 1, x.o.waybill, s.order_id || x.o.order_id || '', s.consignee || '', [s.phone1, s.phone2].filter(Boolean).join(' / '), s.area || x.o.area || '', s.address || '',
      s.status || '', x.r.reason || '', x.r.note || '', x.r.by || '', x.exp ?? '', x.paid, x.short, x.kind, x.o.date, '']);
    const fill = x.o.isReturn && x.paid <= 0 ? C.red : x.short > 0 && x.o.isReturn ? C.yellow : C.orange;
    r.eachCell({ includeEmpty: true }, (c, n) => {
      c.border = border; c.font = font({ size: 10 }); c.alignment = { vertical: 'middle', horizontal: n >= 12 && n <= 14 ? 'center' : 'right', wrapText: [7, 9, 10, 15, 17].includes(n) };
      if (n >= 12 && n <= 14) c.numFmt = money;
      if (n === 14 || n === 15) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } };
    });
    r.getCell(14).font = font({ size: 10, bold: true, color: { argb: 'FFC62828' } });
    r.getCell(5).alignment = { horizontal: 'left', vertical: 'middle' };
  });
  // totals with formulas
  const first = 9, lastRow = 8 + rows.length;
  const tr = ws.addRow([]);
  ws.mergeCells(tr.number, 1, tr.number, 11);
  tr.getCell(1).value = 'الإجمالي'; tr.getCell(1).alignment = { horizontal: 'center' };
  [12, 13, 14].forEach(n => { const L = String.fromCharCode(64 + n); tr.getCell(n).value = { formula: `SUM(${L}${first}:${L}${lastRow})`, result: n === 12 ? totExp : n === 13 ? totPaid : totShort }; tr.getCell(n).numFmt = money; });
  tr.eachCell({ includeEmpty: true }, c => { c.font = font({ bold: true }); c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.total } }; c.border = border; });
  tr.getCell(14).font = font({ bold: true, color: { argb: 'FFC62828' } });
  ws.autoFilter = { from: { row: 8, column: 1 }, to: { row: lastRow, column: N } };
  // legend + signature
  const lg = ws.addRow([]); ws.addRow([]);
  const leg = [['لم يُحصّل الشحن إطلاقًا', C.red], ['حُصّل شحن أقل من المحدد', C.yellow], ['تحصيل أقل / تسليم جزئي', C.orange]];
  leg.forEach(([t, color], i) => { const r = ws.addRow([]); const c = r.getCell(2); c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } }; c.border = border; ws.mergeCells(r.number, 3, r.number, 6); r.getCell(3).value = t; r.getCell(3).font = font({ size: 10 }); });
  ws.addRow([]); const sg = ws.addRow([]); ws.mergeCells(sg.number, 2, sg.number, 7); ws.mergeCells(sg.number, 11, sg.number, 16);
  sg.getCell(2).value = `توقيع الراسل${store ? ' (' + store + ')' : ''}: ____________________`; sg.getCell(11).value = 'توقيع واعتماد إدارة الشحن: ____________________';
  sg.getCell(2).font = sg.getCell(11).font = font({ bold: true });
  void lg;

  // ---------- Sheet 2: summaries ----------
  const s2 = wb.addWorksheet('ملخص', { views: [{ rightToLeft: true }] });
  s2.columns = [{ width: 28 }, { width: 12 }, { width: 16 }, { width: 16 }, { width: 16 }];
  const block = (title, key) => {
    const g = {};
    for (const x of rows) { const k = key(x) || 'غير معروف'; const a = g[k] || (g[k] = { n: 0, exp: 0, paid: 0, short: 0 }); a.n++; a.exp += x.exp || 0; a.paid += x.paid; a.short += x.short; }
    const t = s2.addRow([title]); s2.mergeCells(t.number, 1, t.number, 5);
    t.getCell(1).font = font({ size: 13, bold: true, color: { argb: C.white } }); t.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.ink } }; t.height = 24;
    const h = s2.addRow(['', 'عدد الحالات', 'المفروض', 'المحصّل', 'العجز']);
    h.eachCell(c => { c.font = font({ bold: true, color: { argb: C.white } }); c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.head } }; c.border = border; c.alignment = { horizontal: 'center' }; });
    Object.entries(g).sort((a, b) => b[1].short - a[1].short).forEach(([k, a]) => {
      const r = s2.addRow([k, a.n, a.exp, a.paid, a.short]);
      r.eachCell((c, n) => { c.border = border; c.font = font({ size: 10, bold: n === 5, color: n === 5 ? { argb: 'FFC62828' } : undefined }); if (n >= 3) c.numFmt = money; c.alignment = { horizontal: n === 1 ? 'right' : 'center' }; });
    });
    s2.addRow([]);
  };
  block('حسب المندوب / المسؤول', x => x.r.by);
  block('حسب المنطقة', x => x.s?.area || x.o.area);
  block('حسب نوع المخالفة', x => x.kind);

  return wb.xlsx.writeBuffer();
}
