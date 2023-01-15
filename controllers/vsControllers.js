const db = require("../models");
const sha256 = require('js-sha256').sha256;
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const axios = require("axios");

const keys = require("../keys");
const { Portfolio } = require("../models");

const gmailClientId = keys.gmail_credentials.gmailClientId;
const gmailClientSecret = keys.gmail_credentials.gmailClientSecret;
const gmailRefreshToken = keys.gmail_credentials.gmailRefreshToken;

const oauth2Client = new OAuth2(
    gmailClientId, // ClientID
    gmailClientSecret, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: gmailRefreshToken
});

const accessToken = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: "applications.nickramsay@gmail.com",
        //user: gmailUserId,
        //pass: gmailPassword,
        clientId: gmailClientId,
        clientSecret: gmailClientSecret,
        refreshToken: gmailRefreshToken,
        accessToken: accessToken
    }
});

let useGmail = true;

module.exports = {
    //START: User Account Controllers...
    sendEmail: function (req, res) {
        console.log("Called send test e-mail controller...");
        //SENDGRID LOGIC BELOW...

        let messageParameters = req.body[0];

        let msg = {
            to: messageParameters.recipientEmail,
            from: 'applications.nickramsay@gmail.com',
            subject: '"' + messageParameters.subject + '" from ' + messageParameters.senderName + ' via SendGrid',
            text: messageParameters.message,
            html: '<strong>' + messageParameters.message + '</strong>'
        };

        if (useSendgrid) {
            sgMail.send(msg);
        }

        //GMAIL CREDENTIALS BELOW...

        let mailOptions = {
            from: 'applications.nickramsay@gmail.com',
            to: messageParameters.recipientEmail,
            subject: '"' + messageParameters.subject + '" from ' + messageParameters.senderName,
            text: messageParameters.message
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
        db.Accounts
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    checkExistingAccountEmails: function (req, res) {
        console.log("Called check accounts controller...");
        db.Accounts
            .find({ email: req.body[0] }, { email: 1, _id: 0 }).sort({})
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    setEmailVerficationToken: function (req, res) {
        console.log("Called check set e-mail verification token controller...");
        let email = req.body.email;
        let emailVerificationToken = Math.floor((Math.random() * 999999) + 100000).toString();

        db.AccountCreationRequests
            .replaceOne({ email: email }, { email: email, emailVerificationToken: emailVerificationToken }, { upsert: true })
            .then(dbModel => {
                //res.json(dbModel[0]),
                smtpTransport.sendMail({
                    from: 'applications.nickramsay@gmail.com',
                    to: email,
                    subject: "Your Email Verification Code",
                    text: "Your e-mail verification code is: " + emailVerificationToken
                }, (error, response) => {
                    error ? console.log(error) : console.log(response);
                    smtpTransport.close();
                })
            })
            .catch(err => res.status(422).json(err));
    },
    checkEmailVerificationToken: function (req, res) {
        console.log("Called checkEmailVerificationController controller...");

        db.AccountCreationRequests
            .find({ email: req.body.email, emailVerificationToken: req.body.emailVerificationToken }, { email: 1 })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    deleteEmailVerificationToken: function (req, res) {
        console.log("Called deleteEmailVerificationController controller...");

        db.AccountCreationRequests
            .remove({ email: req.body.email })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err))
    },
    resetPasswordRequest: function (req, res) {
        console.log("Called reset password request controller...");
        let resetToken = Math.floor((Math.random() * 999999) + 100000).toString();

        db.Accounts
            .updateOne({ email: req.body[0] }, { passwordResetToken: sha256(resetToken) })
            .then(dbModel => {
                res.json(dbModel[0]),
                    smtpTransport.sendMail({
                        from: 'applications.nickramsay@gmail.com',
                        to: req.body[0],
                        subject: "Your Password Reset Code",
                        text: "Your password reset code is: " + resetToken
                    }, (error, response) => {
                        error ? console.log(error) : console.log(response);
                        smtpTransport.close();
                    })
            })
            .catch(err => res.status(422).json(err));
    },
    checkEmailAndToken: function (req, res) {
        console.log("Called check email and token controller...");

        db.Accounts
            .find({ email: req.body.email, passwordResetToken: req.body.resetToken }, { email: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    resetPassword: function (req, res) {
        console.log("Called reset password controller...");

        db.Accounts
            .updateOne({ email: req.body.email }, { password: req.body.newPassword, passwordResetToken: null })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    login: function (req, res) {
        console.log("Called login controller...");

        db.Accounts
            .find({ email: req.body.email, password: req.body.password }, { _id: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    findUserName: (req, res) => {
        db.Accounts
            .find({ _id: req.body.account_id }, { _id: -1, firstname: 1, lastname: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    setSessionAccessToken: function (req, res) {
        console.log("Called session token set controller...");

        let sessionAccessToken = Math.floor((Math.random() * 999999) + 100000).toString();

        db.Accounts
            .updateOne({ _id: req.body.id }, { sessionAccessToken: sha256(sessionAccessToken) })
            .then(dbModel => {
                res.json({
                    dbModel: dbModel[0],
                    sessionAccessToken: sha256(sessionAccessToken)
                });
            })
            .catch(err => res.status(422).json(err));
    },
    fetchAccountDetails: function (req, res) {
        console.log("Called fetch account details controller...");

        db.Accounts
            .find({ _id: req.body.id }, { password: 0, sessionAccessToken: 0, passwordResetToken: 0, _id: 0 }).sort({})
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
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
        db.StockData.find({
            "fundamentals.Forward P/E": { $gte: Number(req.body.minPE), $lte: Number(req.body.maxPE) },
            "fundamentals.Debt/Eq": { $gte: Number(req.body.minDebtEquity), $lte: Number(req.body.maxDebtEquity) },
            "fundamentals.P/S": { $gte: Number(req.body.minPriceSales), $lte: Number(req.body.maxPriceSales) },
            "fundamentals.P/B": { $gte: Number(req.body.minPriceToBook), $lte: Number(req.body.maxPriceToBook) },
            "quote.marketCap": { $gte: Number(req.body.minCap), $lte: Number(req.body.maxCap) }
        })
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))
    },
    findSingleStock: (req, res) => {
        console.log("Find Single Stock")
        db.StockData.find({ "symbol": req.body.searchSymbol })
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))
    },
    updatePortfolioStatus: (req, res) => {
        db.Portfolio.updateOne({ "symbol": req.body.symbol }, { "status": req.body.status }, { "upsert": true })
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))
    },
    findPortfolioResults: (req, res) => {
        console.log("Find Portfolio results")
        db.Portfolio.find({})
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))
    },
    returnPortfolio: (req, res) => {
        console.log(req.body.symbols);
        db.StockData.find({ "symbol": { $in: req.body.symbols } })
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))

    },
    updatePortfolio: (req, res) => {
        db.Portfolio.updateOne({ "account_id": req.body.account_id }, { "portfolio": req.body.portfolio }, { "upsert": true })
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))
    },
    addLabel: (req, res) => {
        db.Portfolio.updateOne({ "account_id": req.body.account_id }, { "labels": req.body.labels }, { "upsert": true })
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))
    },
    findPortfolio: (req, res) => {
        console.log(req.body);
        db.Portfolio.findOne({ "account_id": req.body.account_id })
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))
    },
    findPortfolioQuotes: (req, res) => {
        console.log(req.body.symbols);
        db.StockData.find({ "symbol": { $in: req.body.symbols } })
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))
    },
    syncPortfolioWithEtrade: (req, res) => {
        /*
        db.Portfolio.updateMany({ "symbol": { $in: req.body.symbols } }, { "status": req.body.status }, { "upsert": true })
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))
            */
    }
};