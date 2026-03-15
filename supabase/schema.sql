-- Trendlo Supabase schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE products (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  short_desc      TEXT,
  price           NUMERIC(10,2) NOT NULL,
  compare_price   NUMERIC(10,2),
  cost_price      NUMERIC(10,2),
  cj_product_id   TEXT,
  cj_variant_id   TEXT NOT NULL,
  images          JSONB DEFAULT '[]',
  variants        JSONB DEFAULT '[]',
  category        TEXT,
  tags            TEXT[],
  weight_grams    INT,
  seo_title       TEXT,
  seo_description TEXT,
  active          BOOLEAN DEFAULT true,
  featured        BOOLEAN DEFAULT false,
  stock           INT DEFAULT 9999,
  sold_count      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customers (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  phone      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number        TEXT UNIQUE NOT NULL,
  customer_id         UUID REFERENCES customers(id),
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  cj_order_id         TEXT,
  items               JSONB NOT NULL,
  subtotal            NUMERIC(10,2) NOT NULL,
  discount_amt        NUMERIC(10,2) DEFAULT 0,
  total_paid          NUMERIC(10,2) NOT NULL,
  utm_source          TEXT,
  utm_medium          TEXT,
  utm_campaign        TEXT,
  ref_code            TEXT,
  discount_code       TEXT,
  payment_status      TEXT DEFAULT 'pending',
  fulfillment_status  TEXT DEFAULT 'unfulfilled',
  tracking_number     TEXT,
  tracking_url        TEXT,
  shipping_name       TEXT NOT NULL,
  shipping_phone      TEXT NOT NULL,
  shipping_email      TEXT NOT NULL,
  shipping_address    TEXT NOT NULL,
  shipping_city       TEXT NOT NULL,
  shipping_state      TEXT NOT NULL,
  shipping_pincode    TEXT NOT NULL,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE discount_codes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code       TEXT UNIQUE NOT NULL,
  type       TEXT DEFAULT 'percent' CHECK (type IN ('percent','flat')),
  value      NUMERIC(10,2) NOT NULL,
  min_order  NUMERIC(10,2) DEFAULT 0,
  ref_name   TEXT,
  uses       INT DEFAULT 0,
  max_uses   INT,
  active     BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE VIEW order_analytics AS
SELECT
  DATE(created_at) AS date,
  utm_source,
  utm_campaign,
  COUNT(*) AS orders,
  SUM(total_paid) AS revenue,
  AVG(total_paid) AS avg_order_value
FROM orders
WHERE payment_status = 'paid'
GROUP BY DATE(created_at), utm_source, utm_campaign
ORDER BY date DESC;

CREATE INDEX idx_orders_created_at     ON orders(created_at DESC);
CREATE INDEX idx_orders_utm_source     ON orders(utm_source);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_fulfillment    ON orders(fulfillment_status);
CREATE INDEX idx_orders_customer_id    ON orders(customer_id);
CREATE INDEX idx_products_slug         ON products(slug);
CREATE INDEX idx_products_active       ON products(active);
CREATE INDEX idx_products_featured     ON products(featured);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_all_customers" ON customers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_orders"    ON orders    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_products"  ON products  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read_products"  ON products  FOR SELECT USING (active = true);

