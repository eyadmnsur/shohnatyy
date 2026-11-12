// Three ways to turn WhatsApp chats into orders:
//  - 'claude'  : Claude API (merchant's Anthropic key)            -> AI.extract (ai.js)
//  - 'gemini'  : Gemini API (merchant's Google AI Studio key)     -> AI.extractGemini
//  - 'manual'  : the merchant's own Claude Pro chat: the app copies a ready message,
//                the merchant pastes Claude's reply back, the app reads the JSON in it.
const GEMINI_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest'];

// Same fields as the Claude schema in ai.js, as plain JSON Schema.
const ORDER_JSON_SCHEMA = {
  type: 'object',
  properties: {
    orders: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          customer_name: { type: 'string' },
          phones: { type: 'array', items: { type: 'string' }, description: 'أرقام موبايل مصرية 01xxxxxxxxx' },
          governorate: { type: 'string', description: 'المحافظة بالعربي' },
          city_area: { type: 'string', description: 'المدينة أو المنطقة أو الحي' },
          address: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                code: { type: 'string' }, name: { type: 'string' }, size: { type: 'string' }, color: { type: 'string' },
                quantity: { type: 'integer' }, unit_price: { type: ['number', 'null'] },
              },
              required: ['code', 'name', 'size', 'color', 'quantity', 'unit_price'],
            },
          },
          shipping_fee: { type: ['number', 'null'] },
          total_to_collect: { type: ['number', 'null'], description: 'المبلغ المطلوب من العميل عند الاستلام شامل الشحن' },
          notes: { type: 'string' },
          missing: { type: 'array', items: { type: 'string' }, description: 'البيانات الناقصة بالعربي' },
        },
        required: ['customer_name', 'phones', 'governorate', 'city_area', 'address', 'items', 'shipping_fee', 'total_to_collect', 'notes', 'missing'],
      },
    },
  },
  required: ['orders'],
};

Object.assign(AI, {
  async provider() {
    const p = await Store.get('ai_provider', '');
    if (p) return p;
    if (await this.key()) return 'claude';
    if (await Store.get('gemini_key', '')) return 'gemini';
    return 'manual';
  },

  async instructions(catalog) {
    catalog = catalog ?? await this.catalog();
    const store = (await WA.cfg()).store || state.shopName || 'المتجر';
    return [
      `انت بتساعد متجر ملابس مصري اسمه ${store} يحوّل رسايل الواتساب لأوردرات شحن.`,
      'استخرج كل أوردر موجود في الرسايل أو الصور (ممكن يكون أكتر من أوردر). متخترعش بيانات مش موجودة.',
      'الموبايل: اكتبه 11 رقم يبدأ بـ 01، وحوّل الأرقام العربية لإنجليزي.',
      'المحافظة: اكتب اسمها بالعربي حتى لو العميل كتبها بالإنجليزي أو غلط.',
      'المنتجات: لو العميل ذكر كود، طابقه مع كتالوج المتجر تحت عشان تجيب الاسم والسعر. لو السعر مش معروف خليه null.',
      'المبلغ المطلوب تحصيله: لو مكتوب صراحة في الشات استخدمه، غير كده اجمع أسعار القطع × الكمية + الشحن لو معروف، ولو مش هتعرف خليه null.',
      'missing: اكتب بالعربي أي حاجة ناقصة أو مش متأكد منها (زي: المقاس، العنوان بالتفصيل، رقم تاني).',
    ].join('\n') + (catalog ? `\n\nكتالوج المتجر (الكود: الاسم — السعر):\n${catalog}` : '');
  },

  async extractAny(input) {
    const p = await this.provider();
    if (p === 'gemini') return this.extractGemini(input);
    if (p === 'claude') return this.extract(input);
    throw new Error('MANUAL');
  },

  // ---- Gemini (Google's official SDK, bundled in vendor/gemini.js) ----
  async gemini(key) {
    key = key || await Store.get('gemini_key', '');
    if (!key) throw new Error('NO_KEY');
    if (!window.GeminiLib) await loadScript('vendor/gemini.js');
    return new window.GeminiLib.GoogleGenAI({ apiKey: key });
  },

  async extractGemini({ text, images = [] }) {
    const [ai, system] = await Promise.all([this.gemini(), this.instructions()]);
    const parts = images.map(im => ({ inlineData: { mimeType: im.media_type, data: im.data } }));
    parts.push({ text: text?.trim() ? `رسايل الواتساب:\n${text}` : 'استخرج الأوردرات من صور الشات.' });
    let lastErr;
    for (const model of GEMINI_MODELS) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts }],
          config: { systemInstruction: system, responseMimeType: 'application/json', responseJsonSchema: ORDER_JSON_SCHEMA },
        });
        return this.normalize(JSON.parse(res.text));
      } catch (e) {
        lastErr = e;
        if (!/404|not found|not supported/i.test(e.message)) break; // only fall back when the model name is unknown
      }
    }
    throw new Error(/API key|401|403|PERMISSION/i.test(lastErr?.message) ? 'مفتاح Gemini غلط' : /429|quota|RESOURCE_EXHAUSTED/i.test(lastErr?.message) ? 'خلصت الباقة المجانية النهارده — جرّب بكرة أو فعّل الدفع' : lastErr?.message || 'تعذر الاتصال بـ Gemini');
  },

  async testGemini(key) {
    const ai = await this.gemini(key);
    const r = await ai.models.generateContent({ model: GEMINI_MODELS[0], contents: 'رد بكلمة تمام بس' }).catch(async e => {
      if (/404|not found/i.test(e.message)) return ai.models.generateContent({ model: GEMINI_MODELS[1], contents: 'رد بكلمة تمام بس' });
      throw e;
    });
    if (!r.text) throw new Error('مفيش رد');
  },

  // ---- Manual: Claude Pro chat ----
  async manualPrompt(text) {
    const example = { orders: [{ customer_name: 'منى أحمد', phones: ['01012345678'], governorate: 'القاهرة', city_area: 'مدينة نصر', address: '10 شارع عباس العقاد', items: [{ code: '5289', name: 'سوت شتوي جينز', size: 'L', color: 'أزرق', quantity: 1, unit_price: 1400 }], shipping_fee: 95, total_to_collect: 1495, notes: '', missing: [] }] };
    return `${await this.instructions()}

المطلوب: رد بكود JSON بس (من غير أي كلام قبله أو بعده) بالشكل ده بالظبط:
\`\`\`json
${JSON.stringify(example, null, 1)}
\`\`\`
${text?.trim() ? `\nرسايل الواتساب:\n${text}` : '\nالأوردرات في صور الشات اللي مرفقة.'}`;
  },

  // Read the JSON out of Claude's reply (code block or raw), tolerating extra text around it.
  parseReply(reply) {
    const t = String(reply || '');
    const block = t.match(/```(?:json)?\s*([\s\S]*?)```/);
    let raw = block ? block[1] : t;
    const a = raw.search(/[\[{]/), b = Math.max(raw.lastIndexOf('}'), raw.lastIndexOf(']'));
    if (a < 0 || b < a) throw new Error('مش لاقي أوردرات في الرد — انسخ رد Claude كله');
    raw = raw.slice(a, b + 1);
    let data;
    try { data = JSON.parse(raw); } catch { throw new Error('الرد مش كامل — انسخه كله تاني'); }
    return this.normalize(data);
  },

  normalize(data) {
    const list = Array.isArray(data) ? data : Array.isArray(data?.orders) ? data.orders : [data];
    const n = v => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));
    return list.filter(o => o && typeof o === 'object').map(o => ({
      customer_name: String(o.customer_name || o.name || ''),
      phones: (Array.isArray(o.phones) ? o.phones : [o.phones, o.phone].filter(Boolean)).map(String),
      governorate: String(o.governorate || ''), city_area: String(o.city_area || o.area || o.city || ''),
      address: String(o.address || ''),
      items: (o.items || []).map(i => ({ code: String(i.code || ''), name: String(i.name || ''), size: String(i.size || ''), color: String(i.color || ''), quantity: Math.max(1, parseInt(i.quantity) || 1), unit_price: n(i.unit_price) })),
      shipping_fee: n(o.shipping_fee), total_to_collect: n(o.total_to_collect),
      notes: String(o.notes || ''), missing: (o.missing || []).map(String),
    }));
  },
});

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {}
  try { const ta = Object.assign(document.createElement('textarea'), { value: text }); document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok; } catch { return false; }
}
