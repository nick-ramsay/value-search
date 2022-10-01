const router = require("express").Router();
const vsControllers = require("../../controllers/vsControllers");


router
  .route("/find-search-results")
  .post(vsControllers.findSearchResults);

router
  .route("/find-single-stock")
  .post(vsControllers.findSingleStock);

module.exports = router;
