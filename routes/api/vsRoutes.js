const router = require("express").Router();
const vsControllers = require("../../controllers/vsControllers");

var bodyParser = require('body-parser')

router.use(bodyParser.json({
  parameterLimit: 100000,
  limit: '50mb'
}))

//START: Account Routes...

router
  .route("/send-email")
  .post(vsControllers.sendEmail);

router
  .route("/set-email-verification-token")
  .post(vsControllers.setEmailVerficationToken)

router
  .route("/check-email-verification-token")
  .post(vsControllers.checkEmailVerificationToken)

router
  .route("/delete-email-verification-token")
  .post(vsControllers.deleteEmailVerificationToken)

router
  .route("/create-account")
  .post(vsControllers.createAccount);

router
  .route("/check-existing-account-emails")
  .post(vsControllers.checkExistingAccountEmails);

router
  .route("/reset-password-request")
  .post(vsControllers.resetPasswordRequest);

router
  .route("/check-email-and-reset-token")
  .post(vsControllers.checkEmailAndToken);

router
  .route("/reset-password")
  .post(vsControllers.resetPassword);

router
  .route("/reset-login")
  .post(vsControllers.login);

router
  .route("/set-session-access-token")
  .post(vsControllers.setSessionAccessToken);

router
  .route("/fetch-account-details")
  .post(vsControllers.fetchAccountDetails);

router
  .route("/test-backend-token")
  .post(vsControllers.testBackendToken);

router
  .route("/find-user-name")
  .post(vsControllers.findUserName)

//END: User Account Routes...

router
  .route("/find-search-results")
  .post(vsControllers.findSearchResults);

router
  .route("/find-score-search-results")
  .post(vsControllers.findScoreSearchResults);

router
  .route("/find-single-stock")
  .post(vsControllers.findSingleStock);

router
  .route("/update-portfolio")
  .post(vsControllers.updatePortfolio);

router
  .route("/add-label")
  .post(vsControllers.addLabel);

router
  .route("/find-portfolio-results")
  .post(vsControllers.findPortfolioResults);

router
  .route("/find-portfolio")
  .post(vsControllers.findPortfolio);

router
  .route("/return-portfolio")
  .post(vsControllers.returnPortfolio);

router
  .route("/find-portfolio-quotes")
  .post(vsControllers.findPortfolioQuotes);

router
  .route("/return-portfolio-symbol-data")
  .post(vsControllers.returnPortfolioSymbolData);

router
  .route("/sync-portfolio-with-etrade")
  .post(vsControllers.syncPortfolioWithEtrade)

module.exports = router;
