CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "suppliers" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL
);

CREATE TABLE "categories" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL,
  "icon" VARCHAR(255)
);

CREATE TABLE "products" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL,
  "sku" VARCHAR(255) UNIQUE NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "category_id" UUID REFERENCES "categories"("id"),
  "image_url" VARCHAR(255),
  "supplier_id" UUID REFERENCES "suppliers"("id"),
  "stock" INTEGER NOT NULL DEFAULT 0,
  "has_sizes" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "stock_variants" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "color" VARCHAR(50),
  "size" VARCHAR(50),
  "quantity" INTEGER NOT NULL,
  UNIQUE("product_id", "color", "size")
);

CREATE TABLE "orders" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order_number" VARCHAR(255) NOT NULL,
  "date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "supplier_id" UUID NOT NULL REFERENCES "suppliers"("id"),
  "item_count" INTEGER NOT NULL,
  "total_amount" DECIMAL(10, 2) NOT NULL,
  "status" VARCHAR(50) NOT NULL
);

CREATE TABLE "order_items" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order_id" UUID NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "product_id" UUID NOT NULL REFERENCES "products"("id"),
  "quantity" INTEGER NOT NULL,
  "selected_color" VARCHAR(50),
  "selected_size" VARCHAR(50)
);

-- Seed initial data
INSERT INTO "suppliers" (name) VALUES ('거래처 A'), ('거래처 B');
INSERT INTO "categories" (name) VALUES ('반지'), ('목걸이'), ('귀걸이');
