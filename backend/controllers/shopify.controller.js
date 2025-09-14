const shopify = require("../config/shopify.config");
const prisma = require("../config/prisma.config");
const dotenv = require("dotenv");
const shopifyService = require("../services/shopify.service");
dotenv.config();
const install = async (req, res) => {
  const shop = req.query.shop;
  if (!shop) {
    return res.status(400).send("Missing 'shop' query parameter.");
  }

  await shopify.auth.begin({
    shop: shop,
    callbackPath: "/api/shopify/callback",
    isOnline: false,
    rawRequest: req,
    rawResponse: res,
  });
};

const callback = async (req, res) => {
  try {
    const callbackData = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });
    const { session } = callbackData;

    const tenant = await prisma.tenant.upsert({
      where: { storeUrl: session.shop },
      update: { accessToken: session.accessToken },
      create: { storeUrl: session.shop, accessToken: session.accessToken },
      select: { id: true, storeUrl: true },
    });

    console.log("Registering webhooks for", session.shop);
    const webhookEndpoint = `${process.env.HOST}/api/webhooks/shopify/${tenant.id}`;

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

    const client = new shopify.clients.Rest({ session });

    for (const topic of webhookTopics) {
      try {
        await client.post({
          path: "webhooks",
          data: {
            webhook: {
              topic: topic,
              address: webhookEndpoint,
              format: "json",
            },
          },
        });
        console.log(
          `✅ Successfully registered webhook: ${topic} for ${session.shop}`
        );
      } catch (error) {
        console.error(
          `❌ Failed to register webhook: ${topic} for ${session.shop}`,
          error.message
        );
      }
    }

    res.redirect(
      `${process.env.CLIENT_URL}/shopify/return?newTenantId=${tenant.id}&shop=${tenant.storeUrl}`
    );
  } catch (error) {
    console.error("Failed during OAuth callback:", error);
    res.status(500).send("Authentication failed.");
  }
};

const handleWebhook = async (req, res) => {
  try {
    const shopDomain = req.get("X-Shopify-Shop-Domain");
    const valid = await shopify.webhooks.validate({
      rawBody: req.body.toString(),
      rawRequest: req,
      rawResponse: res,
    });

    if (!valid || !shopDomain) {
      return res
        .status(401)
        .json({ error: "Invalid HMAC or missing shop domain" });
    }

    console.log(`Received webhook from ${shopDomain}`);
    // TODO: Add logic here to process the webhook payload.
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { install, callback, handleWebhook };
