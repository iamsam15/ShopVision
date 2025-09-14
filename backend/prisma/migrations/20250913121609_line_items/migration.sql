-- CreateTable
CREATE TABLE "public"."LineItem" (
    "id" BIGINT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderId" BIGINT NOT NULL,
    "productId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "vendor" TEXT,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "LineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LineItem_productId_idx" ON "public"."LineItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "LineItem_id_tenantId_key" ON "public"."LineItem"("id", "tenantId");

-- AddForeignKey
ALTER TABLE "public"."LineItem" ADD CONSTRAINT "LineItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LineItem" ADD CONSTRAINT "LineItem_orderId_tenantId_fkey" FOREIGN KEY ("orderId", "tenantId") REFERENCES "public"."Order"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LineItem" ADD CONSTRAINT "LineItem_productId_tenantId_fkey" FOREIGN KEY ("productId", "tenantId") REFERENCES "public"."Product"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
