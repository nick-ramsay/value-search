const router = require("express").Router();
const vsControllers = require("../../controllers/vsControllers");


router
  .route("/find-search-results")
  .post(vsControllers.findSearchResults);

module.exports = router;
