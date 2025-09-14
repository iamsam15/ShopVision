const prisma = require("../config/prisma.config");

const handleShopifyWebhook = async (req, res) => {
  const topic = req.headers["x-shopify-topic"];
  const tenantId = req.params.tenantId;
  const shopDomain = req.headers["x-shopify-shop-domain"];
  const data = req.body;

  console.log(`🚀 Webhook received for topic: ${topic} from ${shopDomain}`);

  res.status(200).send();

  try {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      console.error(`Webhook for an unknown tenant received: ${tenantId}`);
      return;
    }

    switch (topic) {
      case "products/create":
        await prisma.product.upsert({
          where: { id_tenantId: { id: data.id, tenantId } },
          update: {
            title: data.title,
            vendor: data.vendor,
            productType: data.product_type,
          },
          create: {
            id: data.id,
            tenantId: tenantId,
            title: data.title,
            vendor: data.vendor,
            productType: data.product_type,
            createdAt: new Date(data.created_at),
          },
        });

      case "products/update":
        await prisma.product.upsert({
          where: { id_tenantId: { id: data.id, tenantId } },
          update: {
            title: data.title,
            vendor: data.vendor,
            productType: data.product_type,
          },
          create: {
            id: data.id,
            tenantId,
            title: data.title,
            vendor: data.vendor,
            productType: data.product_type,
            createdAt: new Date(data.created_at),
          },
        });
        break;
      case "products/delete":
        await prisma.product.delete({
          where: { id_tenantId: { id: data.id, tenantId } },
        });
        break;

      case "customers/create":
        await prisma.customer.upsert({
          update: {
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
          },
          create: {
            id: data.id,
            tenantId: tenantId,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            createdAt: new Date(data.created_at),
            orderCount: 0,
          },
        });
        break;
      case "customers/update":
        await prisma.customer.upsert({
          where: { id_tenantId: { id: data.id, tenantId } },
          update: {
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
          },
          create: {
            id: data.id,
            tenantId,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            createdAt: new Date(data.created_at),
            orderCount: 0,
          },
        });
        break;

      case "orders/create":
        if (data.checkout_id) {
          await prisma.checkout.updateMany({
            where: { id: data.checkout_id, tenantId },
            data: { isCompleted: true },
          });
        }
        await prisma.$transaction(async (tx) => {
          await tx.order.create({
            data: {
              id: data.id,
              tenantId,
              totalPrice: parseFloat(data.total_price),
              currency: data.currency,
              financialStatus: data.financial_status,
              createdAt: new Date(data.created_at),
              customerId: data.customer ? data.customer.id : null,
              lineItems: {
                create: data.line_items.map((item) => ({
                  id: item.id,
                  productId: item.product_id,
                  name: item.name,
                  title: item.title,
                  vendor: item.vendor,
                  quantity: item.quantity,
                })),
              },
            },
          });
        });
        break;
      case "checkouts/create":
        await prisma.checkout.upsert({
          where: { id_tenantId: { id: data.id, tenantId } },
          update: {},
          create: {
            id: data.id,
            tenantId,
            email: data.email,
          },
        });
        break;
      case "checkouts/update":
        if (data.email) {
          await prisma.checkout.upsert({
            where: { id_tenantId: { id: data.id, tenantId } },
            update: {
              email: data.email,
            },
            create: {
              id: data.id,
              tenantId,
              email: data.email,
              createdAt: new Date(data.created_at),
            },
          });
        }
        break;
      case "app/uninstalled":
        console.log(
          `App uninstalled for tenant ${tenantId}. Deleting all data.`
        );
        await prisma.$transaction(async (tx) => {
          await tx.lineItem.deleteMany({ where: { tenantId } });
          await tx.order.deleteMany({ where: { tenantId } });
          await tx.customer.deleteMany({ where: { tenantId } });
          await tx.product.deleteMany({ where: { tenantId } });
          await tx.tenant.delete({ where: { id: tenantId } });
        });
        break;
    }
  } catch (error) {
    console.error(`Webhook processing failed for topic ${topic}:`, error);
  }
};

module.exports = { handleShopifyWebhook };
