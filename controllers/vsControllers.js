const db = require("../models");
const sha256 = require("js-sha256").sha256;
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const axios = require("axios");

const keys = require("../keys");
const { Portfolio } = require("../models");

const gmailUserId = keys.gmail_credentials.gmailUserId;
const gmailClientId = keys.gmail_credentials.gmailClientId;
const gmailClientSecret = keys.gmail_credentials.gmailClientSecret;
const gmailRefreshToken = keys.gmail_credentials.gmailRefreshToken;

const oauth2Client = new OAuth2(
  gmailClientId, // ClientID
  gmailClientSecret, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: gmailRefreshToken,
});

const accessToken = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: gmailUserId,
    //user: gmailUserId,
    //pass: gmailPassword,
    clientId: gmailClientId,
    clientSecret: gmailClientSecret,
    refreshToken: gmailRefreshToken,
    accessToken: accessToken,
  },
});

let useGmail = true;

module.exports = {
  //START: User Account Controllers...
  sendEmail: function (req, res) {
    //SENDGRID LOGIC BELOW...

    let messageParameters = req.body[0];

    /*let msg = {
      to: messageParameters.recipientEmail,
      from: "applications.nickramsay@gmail.com",
      subject:
        '"' +
        messageParameters.subject +
        '" from ' +
        messageParameters.senderName +
        " via SendGrid",
      text: messageParameters.message,
      html: "<strong>" + messageParameters.message + "</strong>",
    };

    if (useSendgrid) {
      sgMail.send(msg);
    }*/

    //GMAIL CREDENTIALS BELOW...

    let mailOptions = {
      from: "applications.nickramsay@gmail.com",
      to: messageParameters.recipientEmail,
      subject:
        '"' +
        messageParameters.subject +
        '" from ' +
        messageParameters.senderName,
      text: messageParameters.message,
    };

    if (useGmail) {
      smtpTransport.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
      });
    }
  },
  createAccount: function (req, res) {
    console.log("Called Create Account controller");
    db.Accounts.create(req.body)
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  checkExistingAccountEmails: function (req, res) {
    console.log("Called check accounts controller...");
    db.Accounts.find({ email: req.body[0] }, { email: 1, _id: 0 })
      .sort({})
      .then((dbModel) => res.json(dbModel[0]))
      .catch((err) => res.status(422).json(err));
  },
  setEmailVerficationToken: function (req, res) {
    console.log("Called check set e-mail verification token controller...");
    let email = req.body.email;
    let emailVerificationToken = Math.floor(
      Math.random() * 999999 + 100000
    ).toString();

    db.AccountCreationRequests.replaceOne(
      { email: email },
      { email: email, emailVerificationToken: emailVerificationToken },
      { upsert: true }
    )
      .then((dbModel) => {
        res.json(dbModel[0]),
          smtpTransport.sendMail(
            {
              from: "applications.nickramsay@gmail.com",
              to: email,
              subject: "Your Email Verification Code",
              text:
                "Your e-mail verification code is: " + emailVerificationToken,
            },
            (error, response) => {
              error ? console.log(error) : console.log(response);
              smtpTransport.close();
            }
          );
      })
      .catch((err) => res.status(422).json(err));
  },
  checkEmailVerificationToken: function (req, res) {
    console.log("Called checkEmailVerificationController controller...");

    db.AccountCreationRequests.find(
      {
        email: req.body.email,
        emailVerificationToken: req.body.emailVerificationToken,
      },
      { email: 1 }
    )
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  deleteEmailVerificationToken: function (req, res) {
    console.log("Called deleteEmailVerificationController controller...");

    db.AccountCreationRequests.remove({ email: req.body.email })
      .then((dbModel) => res.json(dbModel[0]))
      .catch((err) => res.status(422).json(err));
  },
  resetPasswordRequest: function (req, res) {
    console.log("Called reset password request controller...");
    let resetToken = Math.floor(Math.random() * 999999 + 100000).toString();

    db.Accounts.updateOne(
      { email: req.body[0] },
      { passwordResetToken: sha256(resetToken) }
    )
      .then((dbModel) => {
        res.json(dbModel[0]),
          smtpTransport.sendMail(
            {
              from: "applications.nickramsay@gmail.com",
              to: req.body[0],
              subject: "Your Password Reset Code",
              text: "Your password reset code is: " + resetToken,
            },
            (error, response) => {
              error ? console.log(error) : console.log(response);
              smtpTransport.close();
            }
          );
      })
      .catch((err) => res.status(422).json(err));
  },
  checkEmailAndToken: function (req, res) {
    console.log("Called check email and token controller...");

    db.Accounts.find(
      { email: req.body.email, passwordResetToken: req.body.resetToken },
      { email: 1 }
    )
      .then((dbModel) => res.json(dbModel[0]))
      .catch((err) => res.status(422).json(err));
  },
  resetPassword: function (req, res) {
    console.log("Called reset password controller...");

    db.Accounts.updateOne(
      { email: req.body.email },
      { password: req.body.newPassword, passwordResetToken: null }
    )
      .then((dbModel) => res.json(dbModel[0]))
      .catch((err) => res.status(422).json(err));
  },
  setSessionAccessToken: function (accountId) {
    console.log("Called session token set controller...");

    let sessionAccessToken = Math.floor(
      Math.random() * 999999 + req.body.id + Math.random() * 999999
    ).toString();

    db.Accounts.updateOne(
      { _id: accountId },
      { sessionAccessToken: sha256(sessionAccessToken) }
    )

      .then((dbModel) => res.json(dbModel[0]))
      .catch((err) => res.status(422).json(err));
  },
  login: function (req, res) {
    console.log("Called login controller...");
    db.Accounts.find(
      { email: req.body.email, password: req.body.password },
      { _id: 1 }
    )
      .then((dbModel) => {
        let currentAccountID = dbModel[0]._id.toString();
        let sessionAccessToken = sha256(
          Math.floor(Math.random() * 999999) +
          currentAccountID +
          Math.floor(Math.random() * 999999)
        );
        console.log(sessionAccessToken);
        db.Accounts.updateOne(
          { _id: dbModel[0]._id },
          { sessionAccessToken: sessionAccessToken }
        )
          .then(() =>
            db.Accounts.find(
              { _id: currentAccountID },
              { _id: 1, sessionAccessToken: 1 }
            )
          )
          //.then((dbModel) => console.log(dbModel[0]))
          .then((dbModel) => res.json(dbModel[0]))
          .catch((err) => res.status(422).json(err));
      })
      .catch((err) => res.status(422).json(err));
  },
  fetchUserId: (req, res) => {
    db.Accounts.find(
      { sessionAccessToken: req.body.sessionAccessToken },
      { _id: 1 }
    )
      .then((dbModel) => {
        res.json(dbModel[0])
      })
  },
  findUserName: (req, res) => {
    db.Accounts.find(
      { _id: req.body.account_id },
      { _id: -1, firstname: 1, lastname: 1 }
    )
      .then((dbModel) => res.json(dbModel[0]))
      .catch((err) => res.status(422).json(err));
  },
  fetchAccountDetails: function (req, res) {
    console.log("Called fetch account details controller...");

    db.Accounts.find(
      { _id: req.body.id },
      { password: 0, sessionAccessToken: 0, passwordResetToken: 0, _id: 0 }
    )
      .sort({})
      .then((dbModel) => res.json(dbModel[0]))
      .catch((err) => res.status(422).json(err));
  },
  testBackendToken: function (req, res) {
    console.log("Called test token controller...");
    var testToken;
    testToken = Math.floor(Math.random() * 100000);
    var testJSON = { body: testToken };
    res.json(testJSON);
  },
  //END: User Account Controllers...
  findSearchResults: (req, res) => {
    let potentialBottomParameter = (req.body.potentialBottomParameter === 1) ? {
      $or: [
        {
          "valueSearchScore.movingAverageSupport": Number(
            req.body.potentialBottomParameter
          ),
        },
        { "valueSearchScore.movingAverageSupport": { $exists: false } },
      ],
    } : "";
    db.StockData.find({
      "fundamentals.Forward P/E": {
        $gte: Number(req.body.minPE),
        $lte: Number(req.body.maxPE),
      },
      "fundamentals.Debt/Eq": {
        $gte: Number(req.body.minDebtEquity),
        $lte: Number(req.body.maxDebtEquity),
      },
      "fundamentals.P/S": {
        $gte: Number(req.body.minPriceSales),
        $lte: Number(req.body.maxPriceSales),
      },
      "fundamentals.P/B": {
        $gte: Number(req.body.minPriceToBook),
        $lte: Number(req.body.maxPriceToBook),
      },
      "fundamentals.Market Cap": {
        $gte: Number(req.body.minCap),
        $lte: Number(req.body.maxCap),
      },
      "fundamentals.Profit Margin (%)": {
        $gte: Number(req.body.minProfitMargin),
      }
    })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => console.log(err));
  },
  findScoreSearchResults: (req, res) => {
    //let movingAverageSupport = req.body.maSupportParameter === true ? 1:99
    // console.log(movingAverageSupport)
    db.StockData.find({
      "valueSearchScore.profitMarginPositive": 2,
      "valueSearchScore.healthyDebtEquity": 2,
      "valueSearchScore.movingAverageSupport": 1,
      "valueSearchScore.calculatedScorePercentage": { $gte: 0.8 },
    })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => console.log(err));
  },
  findSingleStock: (req, res) => {
    console.log("Find Single Stock");
    db.StockData.find({ symbol: req.body.searchSymbol })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => console.log(err));
  },
  updatePortfolioStatus: (req, res) => {
    db.Portfolio.updateOne(
      { symbol: req.body.symbol },
      { status: req.body.status },
      { upsert: true }
    )
      .then((dbModel) => res.json(dbModel))
      .catch((err) => console.log(err));
  },
  findPortfolioResults: (req, res) => {
    console.log("Find Portfolio results");
    db.Portfolio.find({})
      .then((dbModel) => res.json(dbModel))
      .catch((err) => console.log(err));
  },
  returnPortfolio: (req, res) => {
    console.log(req.body.symbols);
    db.StockData.find({ symbol: { $in: req.body.symbols } })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => console.log(err));
  },
  updatePortfolio: (req, res) => {
    db.Portfolio.updateOne(
      { account_id: req.body.account_id },
      { portfolio: req.body.portfolio },
      { upsert: true }
    )
      .then((dbModel) => res.json(dbModel))
      .catch((err) => console.log(err));
  },
  updateThesis: (req, res) => {
    console.log(req.body);

    db.Portfolio.updateOne(
      // Specify the condition to match the document
      { account_id: req.body.account_id },

      // Use $set and arrayFilters to update the specific object in the items array
      {
        $set: {
          "portfolio.$[elem].thesis": req.body.newThesis
        }
      },

      // Specify arrayFilters to match the specific object based on its key's value
      {
        arrayFilters: [{ "portfolio.symbol": req.body.symbol }]
      }
    );
  },
  addLabel: (req, res) => {
    db.Portfolio.updateOne(
      { account_id: req.body.account_id },
      { labels: req.body.labels },
      { upsert: true }
    )
      .then((dbModel) => res.json(dbModel))
      .catch((err) => console.log(err));
  },
  findPortfolio: (req, res) => {
    //console.log(req.body);
    db.Portfolio.findOne({ account_id: req.body.account_id })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => console.log(err));
  },
  findPortfolioQuotes: (req, res) => {
    //console.log(req.body.symbols);
    db.StockData.find({ symbol: { $in: req.body.symbols } })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => console.log(err));
  },
  returnPortfolioSymbolData: (req, res) => {
    console.log(req.body.symbols);
    db.StockSymbols.find({ symbol: { $in: req.body.symbols } })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => console.log(err));
  },
  syncPortfolioWithEtrade: (req, res) => {
    /*
        db.Portfolio.updateMany({ "symbol": { $in: req.body.symbols } }, { "status": req.body.status }, { "upsert": true })
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))
            */
  },
  //Portfolio Beta API Endpoints
  getAccountId: (req, res) => {
    db.Accounts.findOne(
      { sessionAccessToken: req.body.sessionAccessToken },
      { accountId: 1, firstname: 1, lastname: 1 }
    )
      .then((dbModel) => res.json(dbModel))
      .catch((err) => console.log(err));
  },
  getPortfolio: (req, res) => {
    db.PortfolioItems.find({
      account_id: req.body.account_id,
      status: { $nin: ["-", "avoid", "temporaryavoid"] },
    })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => console.log(err));
  },
};
