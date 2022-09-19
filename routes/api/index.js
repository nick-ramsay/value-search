const router = require("express").Router();
const vsRoutes = require("./vsRoutes");

// value-search routes
router.use("/value-search", vsRoutes);

module.exports = router;