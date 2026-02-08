
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL
);

CREATE TABLE "suppliers" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "sku" VARCHAR(255) UNIQUE NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "category_id" INTEGER REFERENCES "categories"("id"),
  "image_url" VARCHAR(255),
  "supplier_id" INTEGER REFERENCES "suppliers"("id") ON DELETE CASCADE,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "has_sizes" BOOLEAN NOT NULL DEFAULT false,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "stock_variants" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "color" VARCHAR(50),
  "size" VARCHAR(50),
  "quantity" INTEGER NOT NULL,
  UNIQUE("product_id", "color", "size")
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "order_number" VARCHAR(255) NOT NULL,
  "date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "supplier_id" INTEGER NOT NULL REFERENCES "suppliers"("id") ON DELETE CASCADE,
  "item_count" INTEGER NOT NULL,
  "total_amount" DECIMAL(10, 2) NOT NULL,
  "status" VARCHAR(50) NOT NULL,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "order_items" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id"),
  "quantity" INTEGER NOT NULL,
  "selected_color" VARCHAR(50),
  "selected_size" VARCHAR(50)
);

-- No seed data for multi-tenant tables
