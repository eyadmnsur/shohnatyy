// On the web build, requests go through the app's own relay (window.SHOP_PROXY); on the phone they go direct.
const shopBase = h => window.SHOP_PROXY ? `${window.SHOP_PROXY}/${h}` : `https://${h}`;
// Shopify Admin GraphQL client (runs on the phone, credentials stay on the device).
const SHOPIFY_API = '2026-07';
const TAG_WA = 'wa-app', TAG_SENT = 'hazem-sent', TAG_DELIVERED = 'hazem-delivered', TAG_RETURNED = 'hazem-returned';

const Shopify = {
  cfg: null, // {shop, mode:'token'|'client', token, clientId, clientSecret}
  _tok: null,

  async load() { this.cfg = await Store.get('shopify_cfg'); this._tok = await Store.get('shopify_tok'); return this.cfg; },
  async save(cfg) { this.cfg = cfg; this._tok = null; await Store.set('shopify_cfg', cfg); await Store.del('shopify_tok'); },
  get ready() { return !!(this.cfg && this.cfg.shop && (this.cfg.token || (this.cfg.clientId && this.cfg.clientSecret))); },
  host() { let s = (this.cfg.shop || '').trim().replace(/^https?:\/\//, '').replace(/\/.*$/, ''); if (!s.includes('.')) s += '.myshopify.com'; return s; },

  async token() {
    if (this.cfg.mode !== 'client') return this.cfg.token.trim();
    if (this._tok && this._tok.exp > Date.now() + 60000) return this._tok.value;
    const body = new URLSearchParams({ grant_type: 'client_credentials', client_id: this.cfg.clientId.trim(), client_secret: this.cfg.clientSecret.trim() });
    const r = await fetch(`${shopBase(this.host())}/admin/oauth/access_token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    const raw = await r.text().catch(() => '');
    let j = null; try { j = JSON.parse(raw); } catch {}
    if (!j?.access_token) {
      const code = j?.error || j?.errors || '';
      const why = /not_installed|not installed/i.test(raw + code) ? 'التطبيق مش متسطّب على المتجر — ادخل Dev Dashboard ودوس Install app'
        : /invalid_client|unauthorized|invalid/i.test(raw + code) ? 'الـ Client ID أو الـ Secret غلط — انسخهم تاني من غير مسافات'
        : r.status === 404 ? 'عنوان المتجر غلط'
        : 'شوبيفاي رفض الطلب';
      throw new Error(`${why}\n(${r.status}: ${String(j?.error_description || code || raw).slice(0, 160)})`);
    }
    this._tok = { value: j.access_token, exp: Date.now() + (j.expires_in || 86000) * 1000 };
    await Store.set('shopify_tok', this._tok);
    return this._tok.value;
  },

  async gql(query, variables = {}) {
    const r = await fetch(`${shopBase(this.host())}/admin/api/${SHOPIFY_API}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': await this.token() },
      body: JSON.stringify({ query, variables }),
    });
    if (r.status === 401 || r.status === 403) throw new Error('صلاحيات شوبيفاي غير كافية أو المفتاح غير صحيح');
    const j = await r.json();
    if (j.errors?.length) throw new Error(j.errors[0].message);
    return j.data;
  },

  ORDER_FIELDS: `id name createdAt note tags fulfillments(first: 5) { createdAt } displayFinancialStatus displayFulfillmentStatus paymentGatewayNames
    totalOutstandingSet { shopMoney { amount } } currentTotalPriceSet { shopMoney { amount } }
    shippingAddress { name firstName lastName phone address1 address2 city province provinceCode zip }
    lineItems(first: 30) { nodes { title variantTitle quantity sku } }`,

  async orders(query, first = 50, sort = 'CREATED_AT') {
    const run = f => this.gql(`query($q:String!,$n:Int!){ orders(first:$n, query:$q, sortKey:${sort}, reverse:true){ nodes { ${f} } } }`, { q: query, n: first });
    try { return (await run(this.ORDER_FIELDS + ' phone')).orders.nodes; }
    catch (e) {
      // order.phone may need extra access on some stores — fall back to the shipping address only.
      if (!/access denied/i.test(e.message)) throw e;
      return (await run(this.ORDER_FIELDS)).orders.nodes;
    }
  },
  // readyMode 'fulfilled' (default): the merchant marks an order Fulfilled in Shopify after
  // confirming it with the customer, and only those go to the courier.
  // 'unfulfilled': every new open order is offered for shipping.
  get readyMode() { return this.cfg?.readyMode || 'fulfilled'; },
  // days: only orders touched (e.g. marked Fulfilled) in the last N days; 0 = last 60 days.
  // Sorted by last update so an old order fulfilled today is never cut off by the 100 limit.
  toShip(days = 2) {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - Math.max(0, (days || 60) - 1) - 1);
    const since = d.toISOString().slice(0, 10);
    return this.readyMode === 'unfulfilled'
      ? this.orders(`fulfillment_status:unfulfilled status:open -tag:${TAG_SENT} -tag:${TAG_WA}`)
      : this.orders(`fulfillment_status:shipped -status:cancelled -tag:${TAG_SENT} -tag:${TAG_WA} updated_at:>=${since}`, 100, 'UPDATED_AT').then(list => {
        if (!days) return list;
        const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - (days - 1));
        return list.filter(o => { const f = (o.fulfillments || []).map(x => x.createdAt).sort().pop(); return f && new Date(f) >= start; });
      });
  },
  toConfirm() { return this.orders(`fulfillment_status:unfulfilled status:open -tag:${TAG_SENT} -tag:${TAG_WA}`); },
  sent() { return this.orders(`tag:${TAG_SENT} -tag:${TAG_DELIVERED} -tag:${TAG_RETURNED}`, 100); },
  test() { return this.gql('{ shop { name myshopifyDomain currencyCode } }').then(d => d.shop); },

  async tag(id, tags) {
    const d = await this.gql(`mutation($id:ID!,$t:[String!]!){ tagsAdd(id:$id, tags:$t){ userErrors { message } } }`, { id, t: tags });
    const e = d.tagsAdd.userErrors[0]; if (e) throw new Error(e.message);
  },

  async fulfill(orderId, waybill) {
    const d = await this.gql(`query($id:ID!){ order(id:$id){ fulfillmentOrders(first:10){ nodes { id status } } } }`, { id: orderId });
    const fos = d.order.fulfillmentOrders.nodes.filter(f => ['OPEN', 'IN_PROGRESS', 'SCHEDULED'].includes(f.status));
    if (!fos.length) return false;
    const m = await this.gql(`mutation($f:FulfillmentInput!){ fulfillmentCreate(fulfillment:$f){ userErrors { message } } }`, {
      f: { notifyCustomer: false, ...(waybill ? { trackingInfo: { company: 'Hazem Halan', number: waybill } } : {}), lineItemsByFulfillmentOrder: fos.map(f => ({ fulfillmentOrderId: f.id })) },
    });
    const e = m.fulfillmentCreate.userErrors[0]; if (e) throw new Error(e.message);
    return true;
  },

  // The Shopify order behind a Hazem shipment: by order number, else by the HZM-<waybill> tag.
  async findOrder(orderNo, waybill) {
    const F = 'id name shippingAddress { firstName lastName address1 address2 city provinceCode countryCodeV2 zip phone company }';
    const find = async q => (await this.gql(`query($q:String!){ orders(first:5, query:$q){ nodes { ${F} } } }`, { q })).orders.nodes;
    const no = String(orderNo || '').replace(/\D/g, '');
    let n = no ? (await find(`name:${no}`)).filter(o => o.name.replace(/\D/g, '') === no) : [];
    if (!n.length && waybill) n = await find(`tag:HZM-${waybill}`);
    return n[0] || null;
  },
  // Opens in the Shopify app when it is installed (admin.shopify.com links are app links), else the browser.
  adminUrl(gid) { return `https://admin.shopify.com/store/${this.host().replace(/\.myshopify\.com$/, '')}/orders/${String(gid).split('/').pop()}`; },
  // patch: {name, phone, address, city}; only the given fields change, the rest of the address is kept.
  async updateShipping(order, patch) {
    const a = order.shippingAddress || {};
    const sa = { firstName: a.firstName || '', lastName: a.lastName || '', address1: a.address1 || '', address2: a.address2 || '', city: a.city || '', provinceCode: a.provinceCode || undefined, countryCode: a.countryCodeV2 || 'EG', zip: a.zip || '', phone: a.phone || '', company: a.company || '' };
    if (patch.name != null) { const w = clean(patch.name).split(' '); sa.firstName = w[0] || ''; sa.lastName = w.slice(1).join(' '); }
    if (patch.phone != null) sa.phone = patch.phone;
    if (patch.address != null) { sa.address1 = patch.address; sa.address2 = ''; }
    if (patch.city != null) sa.city = patch.city;
    const m = await this.gql(`mutation($i:OrderInput!){ orderUpdate(input:$i){ userErrors { message } } }`, { i: { id: order.id, shippingAddress: sa } });
    const e = m.orderUpdate.userErrors[0]; if (e) throw new Error(e.message);
  },

  // Cancels an order (used when a chat order is deleted before shipping); no refund, no customer email.
  async cancel(orderId) {
    const m = await this.gql(`mutation($id:ID!){ orderCancel(orderId:$id, reason:OTHER, refund:false, restock:true, notifyCustomer:false){ orderCancelUserErrors { message } } }`, { id: orderId });
    const e = m.orderCancel.orderCancelUserErrors?.[0]; if (e) throw new Error(e.message);
  },

  async markPaid(orderId) {
    const m = await this.gql(`mutation($i:OrderMarkAsPaidInput!){ orderMarkAsPaid(input:$i){ userErrors { message } } }`, { i: { id: orderId } });
    const e = m.orderMarkAsPaid.userErrors[0]; if (e && !/already|paid/i.test(e.message)) throw new Error(e.message);
  },
};

// Build the Hazem Halan shipment fields from a Shopify order.
function orderToShipment(o, sectors) {
  const a = o.shippingAddress || {};
  const phones = findPhones(a.phone, o.phone, a.zip, a.address2, a.address1);
  const items = o.lineItems.nodes;
  const product = items.map(i => `${i.title}${i.variantTitle ? ' (' + i.variantTitle + ')' : ''}${i.quantity > 1 ? ' ×' + i.quantity : ''}`).join(' + ');
  const qty = items.reduce((s, i) => s + i.quantity, 0);
  const cod = Number(o.totalOutstandingSet?.shopMoney?.amount ?? o.currentTotalPriceSet?.shopMoney?.amount ?? 0);
  const m = matchSector(a, sectors);
  const parts = [];
  for (const x of [a.address1, a.address2, a.city, m?.sector.gov || GOV_BY_CODE[a.provinceCode] || a.province]) {
    if (!x || /^\+?\d[\d\s]{6,}$/.test(String(x).trim())) continue;
    const n = normAr(x);
    if (parts.some(p => normAr(p).includes(n))) continue;
    parts.push(clean(x));
  }
  const addrText = parts.join(' - ');
  return {
    client_name: a.name || [a.firstName, a.lastName].filter(Boolean).join(' '),
    phone_1: phones[0] || '', phone_2: phones[1] || '',
    address: addrText,
    sector_id: m?.sector.id || '', _sectorLabel: m?.sector.label || '', _confident: !!m?.confident,
    price: String(Math.round(cod)),
    product_name: product, product_desc: items.map(i => i.sku).filter(Boolean).join(', '),
    quantity: String(qty), order_id: o.name.replace('#', ''), notes: o.note || '', service_type: '1',
  };
}
