// Guess the Hazem Halan "sector" (area) for a Shopify shipping address.
const GOV_BY_CODE = {
  C: 'القاهرة', GZ: 'الجيزة', ALX: 'الإسكندرية', QL: 'القليوبية', SHR: 'الشرقية', MNF: 'المنوفية', GH: 'الغربية',
  DK: 'الدقهلية', KFS: 'كفر الشيخ', BH: 'البحيرة', DT: 'دمياط', PTS: 'بورسعيد', IS: 'الإسماعيلية', SUZ: 'السويس',
  FYM: 'الفيوم', BNS: 'بني سويف', MN: 'المنيا', AST: 'أسيوط', SHG: 'سوهاج', KN: 'قنا', LX: 'الأقصر', ASN: 'أسوان',
  BA: 'البحر الأحمر', WAD: 'الوادي الجديد', MT: 'مطروح', SIN: 'شمال سيناء', JS: 'جنوب سيناء',
};

const AREA_ALIASES = { 'مدينه نصر': ['مدينة نصر', 'nasr city'], 'مصر الجديده': ['heliopolis'], '6 اكتوبر': ['اكتوبر', 'october', '٦ اكتوبر'], 'الشيخ زايد': ['زايد', 'zayed'], 'التجمع الخامس': ['التجمع', 'new cairo'] };

function matchSector(addr, sectors) {
  if (!addr || !sectors?.length) return null;
  const govName = GOV_BY_CODE[addr.provinceCode] || addr.province || '';
  const gov = normAr(govName);
  const city = normAr(addr.city);
  const full = ' ' + normAr([addr.address1, addr.address2, addr.city, addr.zip].filter(Boolean).join(' ')) + ' ';
  const govs = new Set(sectors.map(s => normAr(s.gov)));
  // If the city itself is a governorate name (e.g. "المنيا"), trust it over the province field.
  const cityGov = [...govs].find(g => g && (city === g || city === g.replace(/^ال/, '')));
  const targetGov = cityGov || gov;

  let best = null, bestScore = 0;
  for (const s of sectors) {
    const area = normAr(s.area), sg = normAr(s.gov);
    if (!area) continue;
    const names = [area, ...(AREA_ALIASES[area] || []).map(normAr)];
    let score = 0;
    for (const n of names) {
      if (city && city === n) score = Math.max(score, 100);
      else if (city && (city.includes(n) || n.includes(city)) && n.length > 2 && city.length > 2) score = Math.max(score, 70);
      if (full.includes(' ' + n + ' ')) score = Math.max(score, 60 + Math.min(n.length, 15));
    }
    if (!score) continue;
    if (targetGov && sg === targetGov) score += 25;
    else if (targetGov && sg && sg !== targetGov) score -= 30;
    if (score > bestScore) { bestScore = score; best = s; }
  }
  if (best && bestScore >= 60) return { sector: best, confident: bestScore >= 90 };
  // Fall back to an area named like the governorate's capital (e.g. "المنيا - المنيا").
  if (targetGov) {
    const cap = sectors.find(s => normAr(s.gov) === targetGov && normAr(s.area) === targetGov);
    if (cap) return { sector: cap, confident: false };
  }
  return null;
}
