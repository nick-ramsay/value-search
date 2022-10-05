const router = require("express").Router();
const vsControllers = require("../../controllers/vsControllers");


router
  .route("/find-search-results")
  .post(vsControllers.findSearchResults);

router
  .route("/find-single-stock")
  .post(vsControllers.findSingleStock);

router
  .route("/update-portfolio-status")
  .post(vsControllers.updatePortfolioStatus);

router
  .route("/find-portfolio-results")
  .post(vsControllers.findPortfolioResults);

router
  .route("/return-portfolio")
  .post(vsControllers.returnPortfolio);

module.exports = router;
