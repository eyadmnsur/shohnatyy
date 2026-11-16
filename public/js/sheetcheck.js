// Checks a shipments Excel sheet before it is uploaded to Hazem Halan:
// required fields (the ones the portal marks with a red star), a valid mobile number,
// and an area name that exists in the portal's own list for that governorate
// (taken from the official template's second sheet). Small mistakes are fixed automatically.

const TEMPLATE_URL = () => HH_ORIGIN + '/templates/default/uploads/excel/6f66f21d98.xlsx';

// Governorate -> exact area names, from the official template (cached for the session).
async function templateAreas() {
  if (state.tplAreas) return state.tplAreas;
  const res = await fetch(TEMPLATE_URL());
  const wb = XLSX.read(new Uint8Array(await res.arrayBuffer()), { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[1]];
  const grid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  const head = grid.find(r => r.filter(c => String(c).trim()).length > 5) || [];
  const map = new Map(); // normGov -> {name, areas: Map(normArea -> exact)}
  head.forEach((g, ci) => {
    const name = clean(String(g).replace(/_/g, ' '));
    if (!name || /service/i.test(name)) return;
    const areas = new Map();
    for (const r of grid) {
      const a = clean(String(r[ci] ?? '')), k = normAr(a);
      if (k.length >= 2 && a !== name && !/service/i.test(a)) areas.set(k, a); // skips placeholders like "---"
    }
    if (areas.size) map.set(normAr(name), { name, areas });
  });
  state.tplAreas = map;
  return map;
}

// Find the template column index for each field from the header row.
function sheetColumns(header) {
  const find = re => header.findIndex(c => re.test(clean(String(c))));
  return {
    name: find(/consignee|^name$|الاسم|المرسل اليه/i),
    city: find(/^city$|المحافظة|المدينة/i),
    area: find(/^area$|المنطقة/i),
    address: find(/address|العنوان/i),
    phone1: find(/phone_?1|موبايل\s*1|^موبايل$/i),
    phone2: find(/phone_?2|موبايل\s*2/i),
    cod: find(/^cod$|مبلغ التحصيل|التحصيل/i),
  };
}

const normGov = g => normAr(g).replace(/^ال/, '');
// A mobile (01xxxxxxxxx) or an Egyptian landline (0 + area code + number), which the portal also accepts.
const landline = v => { const d = String(v ?? '').replace(/[٠-٩]/g, x => '٠١٢٣٤٥٦٧٨٩'.indexOf(x)).replace(/\D/g, ''); return /^0[2-9]\d{7,8}$/.test(d) ? d : ''; };
const validPhone = v => findPhones(String(v ?? ''))[0] || landline(v);

// Returns {errors:[], fixes:[], fixed: newRow}
function checkSheetRow(row, col, areasByGov) {
  const errors = [], fixes = [], fixed = row.slice();
  const get = k => (col[k] >= 0 ? clean(String(row[col[k]] ?? '')) : '');
  const set = (k, v) => { if (col[k] >= 0) fixed[col[k]] = v; };

  if (!get('name')) errors.push('اسم العميل فاضي');
  if (!get('address')) errors.push('العنوان فاضي');

  // Mobile 1 (required) and mobile 2 (optional)
  const raw1 = get('phone1'), p1 = validPhone(raw1);
  if (!raw1) errors.push('موبايل 1 فاضي');
  else if (!p1) errors.push(`موبايل 1 غلط: «${raw1}»`);
  else if (p1 !== raw1) { set('phone1', p1); fixes.push(`الموبايل ${raw1} ← ${p1}`); }
  const raw2 = get('phone2');
  if (raw2 && raw2 !== '0') { const p2 = validPhone(raw2); if (!p2) errors.push(`موبايل 2 غلط: «${raw2}»`); else if (p2 !== raw2) set('phone2', p2); }

  // Amount
  const codRaw = get('cod');
  if (col.cod >= 0 && codRaw === '') errors.push('مبلغ التحصيل فاضي');
  else if (codRaw && !isFinite(Number(String(codRaw).replace(/[,\s]/g, '').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))))) errors.push(`مبلغ التحصيل مش رقم: «${codRaw}»`);

  // Governorate + area must exist in the portal's list
  const city = get('city'), area = get('area');
  if (!city) errors.push('المحافظة فاضية');
  if (!area) errors.push('المنطقة فاضية');
  if (city && areasByGov?.size) {
    let gov = areasByGov.get(normAr(city)) || [...areasByGov.values()].find(g => normGov(g.name) === normGov(city));
    if (!gov) errors.push(`المحافظة «${city}» مش موجودة في قايمة الموقع`);
    else {
      if (gov.name !== city) { set('city', gov.name); fixes.push(`المحافظة ${city} ← ${gov.name}`); }
      if (area) {
        const n = normAr(area);
        let exact = gov.areas.get(n);
        if (!exact) {
          const near = n.length < 3 ? [] : [...gov.areas.entries()].filter(([k]) => k.length >= 3 && (k.includes(n) || n.includes(k)));
          if (near.length === 1) exact = near[0][1];
        }
        if (!exact) errors.push(`المنطقة «${area}» مش موجودة في قايمة الموقع لـ ${gov.name}`);
        else if (exact !== area) { set('area', exact); fixes.push(`المنطقة ${area} ← ${exact}`); }
      }
    }
  }
  return { errors, fixes, fixed };
}
