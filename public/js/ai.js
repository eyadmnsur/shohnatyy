// Turns WhatsApp chats (pasted text and/or screenshots) into structured orders with Claude.
// The official Anthropic SDK is bundled in vendor/anthropic.js and loaded on first use.
// The API key is the merchant's own, entered in the app and stored only on this phone.
const AI_MODEL = 'claude-opus-5-5';

function loadScript(src) {
  return new Promise((ok, fail) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => fail(new Error('تعذر تحميل ' + src)); document.head.appendChild(s); });
}

const AI = {
  async key() { return (await Store.get('ai_key', '')) || ''; },
  async lib() { if (!window.AnthropicLib) await loadScript('vendor/anthropic.js'); return window.AnthropicLib; },

  async client() {
    const key = await this.key();
    if (!key) throw new Error('NO_KEY');
    const { Anthropic } = await this.lib();
    // The key belongs to the phone's owner and never leaves the device except to the API.
    return new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true, maxRetries: 2, timeout: 120000 });
  },

  schema(z) {
    const Item = z.object({
      code: z.string().describe('كود الموديل زي Z408 أو 5289، فاضي لو مش مذكور'),
      name: z.string().describe('اسم المنتج'),
      size: z.string(), color: z.string(),
      quantity: z.number().int(),
      unit_price: z.number().nullable().describe('سعر القطعة بالجنيه، null لو مش معروف'),
    });
    const Order = z.object({
      customer_name: z.string(),
      phones: z.array(z.string()).describe('أرقام موبايل مصرية بصيغة 01xxxxxxxxx'),
      governorate: z.string().describe('المحافظة بالعربي'),
      city_area: z.string().describe('المدينة أو المنطقة أو الحي'),
      address: z.string().describe('العنوان بالتفصيل كما كتبه العميل'),
      items: z.array(Item),
      shipping_fee: z.number().nullable(),
      total_to_collect: z.number().nullable().describe('المبلغ المطلوب تحصيله من العميل عند الاستلام شامل الشحن'),
      notes: z.string().describe('أي ملاحظات تخص التوصيل أو المقاس أو المواعيد'),
      missing: z.array(z.string()).describe('البيانات الناقصة أو المش مؤكدة، بالعربي'),
    });
    return z.object({ orders: z.array(Order) });
  },

  // Recent product codes and prices from Shopify orders, so the model can fill names/prices from a code.
  async catalog() {
    if (this._cat && Date.now() - this._cat.t < 6 * 3600e3) return this._cat.text;
    let text = '';
    if (Shopify.ready) {
      try {
        const d = await Shopify.gql(`{ orders(first: 100, sortKey: CREATED_AT, reverse: true) { nodes { lineItems(first: 20) { nodes { title variantTitle sku originalUnitPriceSet { shopMoney { amount } } } } } } }`);
        const seen = new Map();
        for (const o of d.orders.nodes) for (const li of o.lineItems.nodes) {
          const code = ((li.title.match(/كود\s*([A-Za-z]*\s?\d+[A-Za-z0-9]*)/) || [])[1] || (li.sku || '').split('-')[0] || '').replace(/\s/g, '');
          if (!code || seen.has(code)) continue;
          seen.set(code, `${code}: ${li.title} — ${Math.round(li.originalUnitPriceSet.shopMoney.amount)} ج.م`);
        }
        text = [...seen.values()].sort().slice(0, 200).join('\n');
      } catch {}
    }
    this._cat = { t: Date.now(), text };
    return text;
  },

  // images: [{media_type, data(base64)}]
  async extract({ text, images = [] }) {
    const [client, { betaZodOutputFormat, z }, catalog] = await Promise.all([this.client(), this.lib(), this.catalog()]);
    const system = await this.instructions(catalog);
    const content = [];
    for (const im of images) content.push({ type: 'image', source: { type: 'base64', media_type: im.media_type, data: im.data } });
    content.push({ type: 'text', text: text?.trim() ? `رسايل الواتساب:\n${text}` : 'استخرج الأوردرات من صور الشات.' });

    const res = await client.beta.messages.parse({
      model: AI_MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content }],
      output_config: { effort: 'low', format: betaZodOutputFormat(this.schema(z)) },
    });
    if (res.stop_reason === 'refusal') throw new Error('تعذر قراءة الرسايل دي، جرّب تكتبها نص');
    if (res.stop_reason === 'max_tokens') throw new Error('الرسايل طويلة جدًا، قسّمها على كذا مرة');
    const out = res.parsed_output;
    if (!out) throw new Error('مقدرتش أطلع أوردرات من الرسايل دي');
    return out.orders;
  },

  async test(key) {
    const { Anthropic } = await this.lib();
    const c = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true, maxRetries: 0, timeout: 30000 });
    await c.models.retrieve(AI_MODEL);
  },
};

// Read a screenshot as base64 JPEG. Long chat screenshots are cut into overlapping
// slices so the Arabic text stays large enough to read after the API's own resizing.
function imageToB64(file) {
  return new Promise((ok, fail) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const W = Math.min(1000, img.width), k = W / img.width, H = Math.round(img.height * k);
      const sliceH = Math.round(W * 1.5), overlap = 80, parts = [];
      for (let y = 0; y < H; y += sliceH - overlap) {
        const h = Math.min(sliceH, H - y);
        const c = document.createElement('canvas'); c.width = W; c.height = h;
        c.getContext('2d').drawImage(img, 0, y / k, img.width, h / k, 0, 0, W, h);
        parts.push({ media_type: 'image/jpeg', data: c.toDataURL('image/jpeg', 0.85).split(',')[1] });
        if (y + h >= H || parts.length >= 8) break;
      }
      const p = document.createElement('canvas'); p.width = 120; p.height = Math.round(120 * img.height / img.width);
      p.getContext('2d').drawImage(img, 0, 0, p.width, p.height); URL.revokeObjectURL(url);
      ok({ parts, preview: p.toDataURL('image/jpeg', 0.6) });
    };
    img.onerror = () => fail(new Error('الصورة مش مدعومة'));
    img.src = url;
  });
}
