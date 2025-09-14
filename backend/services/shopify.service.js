const shopify = require("../config/shopify.config");
const prisma = require("../config/prisma.config");
const axios = require("axios");

async function syncProducts(tenantId, storeUrl, accessToken) {
  const shopifyApiUrl = `https://${storeUrl}/admin/api/2024-07/products.json`;
  const response = await fetch(shopifyApiUrl, {
    headers: { "X-Shopify-Access-Token": accessToken },
  });
  if (!response.ok)
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  const { products } = await response.json();
  for (const product of products) {
    await prisma.product.upsert({
      where: { id_tenantId: { id: product.id, tenantId } },
      update: { title: product.title, vendor: product.vendor },
      create: {
        id: product.id,
        tenantId,
        title: product.title,
        vendor: product.vendor,
        productType: product.product_type,
        createdAt: new Date(product.created_at),
      },
    });
  }
  console.log(`Synced ${products.length} products for ${storeUrl}`);
}

async function syncCustomers(tenantId, storeUrl, accessToken) {
  const shopifyApiUrl = `https://${storeUrl}/admin/api/2024-07/customers.json`;
  const response = await fetch(shopifyApiUrl, {
    headers: { "X-Shopify-Access-Token": accessToken },
  });
  if (!response.ok)
    throw new Error(`Failed to fetch customers: ${response.statusText}`);
  const { customers } = await response.json();
  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { id_tenantId: { id: customer.id, tenantId } },
      update: {
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        orderCount: customer.orders_count,
      },
      create: {
        id: customer.id,
        tenantId,
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        createdAt: new Date(customer.created_at),
        orderCount: customer.orders_count,
      },
    });
  }
  console.log(`Synced ${customers.length} customers for ${storeUrl}`);
}

async function syncOrders(tenantId, storeUrl, accessToken) {
  const shopifyApiUrl = `https://${storeUrl}/admin/api/2024-07/orders.json?status=any`;
  const response = await fetch(shopifyApiUrl, {
    headers: { "X-Shopify-Access-Token": accessToken },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }
  const { orders } = await response.json();

  for (const order of orders) {
    await prisma.$transaction(async (tx) => {
      if (order.customer) {
        await tx.customer.upsert({
          where: { id_tenantId: { id: order.customer.id, tenantId } },
          update: {
            firstName: order.customer.first_name,
            lastName: order.customer.last_name,
            email: order.customer.email,
            phone: order.customer.phone,
            orderCount: {
              increment: 1,
            },
          },
          create: {
            id: order.customer.id,
            tenantId,
            firstName: order.customer.first_name,
            lastName: order.customer.last_name,
            email: order.customer.email,
            phone: order.customer.phone,
            createdAt: new Date(order.customer.created_at || Date.now()),
            orderCount: 1,
          },
        });
      }

      await tx.order.upsert({
        where: { id_tenantId: { id: order.id, tenantId } },
        update: {
          totalPrice: parseFloat(order.total_price),
          financialStatus: order.financial_status,
          customerId: order.customer ? order.customer.id : null,
        },
        create: {
          id: order.id,
          tenantId,
          totalPrice: parseFloat(order.total_price),
          currency: order.currency,
          financialStatus: order.financial_status,
          createdAt: new Date(order.created_at),
          customerId: order.customer ? order.customer.id : null,
        },
      });

      for (const line_item of order.line_items) {
        if (line_item.product_id) {
          await tx.product.upsert({
            where: { id_tenantId: { id: line_item.product_id, tenantId } },
            update: {
              title: line_item.title,
              vendor: line_item.vendor,
            },
            create: {
              id: line_item.product_id,
              tenantId,
              title: line_item.title,
              vendor: line_item.vendor,
              createdAt: new Date(order.created_at),
            },
          });

          await tx.lineItem.upsert({
            where: { id_tenantId: { id: line_item.id, tenantId } },
            update: {
              quantity: line_item.quantity,
              title: line_item.title,
              vendor: line_item.vendor,
            },
            create: {
              id: line_item.id,
              tenantId,
              orderId: order.id,
              productId: line_item.product_id,
              name: line_item.name,
              title: line_item.title,
              vendor: line_item.vendor,
              quantity: line_item.quantity,
            },
          });
        }
      }
    });
  }
  console.log(
    `Synced ${orders.length} orders and their line items for ${storeUrl}`
  );
}

const registerWebhooks = async (storeUrl, accessToken, tenantId) => {
  const webhookEndpoint = `${process.env.APP_URL}/api/webhooks/shopify/${tenantId}`;

  const webhookTopics = [
    "products/create",
    "products/update",
    "products/delete",
    "orders/create",
    "customers/create",
    "customers/update",
    "checkouts/create",
    "checkouts/update",
    "app/uninstalled",
  ];

  for (const topic of webhookTopics) {
    try {
      const apiUrl = `https://${storeUrl}/admin/api/2024-07/webhooks.json`;
      const requestBody = {
        webhook: {
          topic: topic,
          address: webhookEndpoint,
          format: "json",
        },
      };

      await axios.post(apiUrl, requestBody, {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      });

      console.log(`Successfully registered webhook: ${topic} for ${storeUrl}`);
    } catch (error) {
      console.error(
        `Failed to register webhook: ${topic} for ${storeUrl}`,
        error.response?.data
      );
    }
  }
};

module.exports = { syncProducts, syncCustomers, syncOrders, registerWebhooks };
