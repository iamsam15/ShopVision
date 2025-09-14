const express = require("express");
const router = express.Router();
const tenantController = require("../controllers/tenant.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.use(authenticateToken);

router.get("/me/data", authenticateToken, tenantController.getDataForUser);
router.post(
  "/:tenantId/sync",
  authenticateToken,
  tenantController.syncTenantData
);
router.post("/link", tenantController.linkUserToTenant);
router.delete("/:tenantId", tenantController.deleteTenant);
router.get("/:tenantId/checkout-stats", tenantController.getCheckOutStats);

module.exports = router;
