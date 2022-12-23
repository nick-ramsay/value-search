import axios from "axios";

const apiURL = process.env.NODE_ENV === 'production' ? '' : '//localhost:3001'

export default {
    findSearchResults: (minPE, maxPE, minDebtEquity, maxDebtEquity, minPriceSales, maxPriceSales, minPriceToBook, maxPriceToBook, minCap, maxCap) => {
        return axios({ method: "post", url: apiURL + "/api/value-search/find-search-results", data: { minPE: minPE, maxPE: maxPE, minDebtEquity: minDebtEquity, maxDebtEquity: maxDebtEquity, minPriceSales: minPriceSales, maxPriceSales: maxPriceSales, minPriceToBook: minPriceToBook, maxPriceToBook: maxPriceToBook, minCap: minCap, maxCap: maxCap } });
    },
    findSingleStock: (searchSymbol) => {
        return axios({ method: "post", url: apiURL + "/api/value-search/find-single-stock", data: { searchSymbol } });
    },
    updatePortfolioStatus: (symbol, status) => {
        return axios({ method: "post", url: apiURL + "/api/value-search/update-portfolio-status", data: { symbol: symbol, status: status } });
    },
    findPortfolioResults: () => {
        return axios({ method: "post", url: apiURL + "/api/value-search/find-portfolio-results", data: {} });
    },
    returnPortfolio: (symbols) => {
        return axios({ method: "post", url: apiURL + "/api/value-search/return-portfolio", data: { symbols } });
    },
    //START: Account APIs...
    sendEmail: function (messageInfo) {
        return axios({ method: "post", url: apiURL + "/api/value-search/send-email", data: [messageInfo] });
    },
    createAccount: function (newAccountInfo) {
        return axios({ method: "post", url: apiURL + "/api/value-search/create-account", data: newAccountInfo })
    },
    setEmailVerificationToken: function (email) {
        return axios({ method: "post", url: apiURL + "/api/value-search/set-email-verification-token", data: { email: email } })
    },
    checkEmailVerificationToken: function (email, emailVerificationToken) {
        return axios({ method: "post", url: apiURL + "/api/value-search/check-email-verification-token", data: { email: email, emailVerificationToken: emailVerificationToken } })
    },
    deleteEmailVerificationToken: function (email) {
        return axios({ method: "post", url: apiURL + "/api/value-search/delete-email-verification-token", data: { email: email } })
    },
    checkExistingAccountEmails: function (email) {
        return axios({ method: "post", url: apiURL + "/api/value-search/check-existing-account-emails", data: [email] });
    },
    setEmailResetCode: function (email, generatedResetToken) {
        return axios({ method: "post", url: apiURL + "/api/value-search/reset-password-request", data: [email, generatedResetToken] });
    },
    checkEmailAndResetToken: function (email, resetToken) {
        return axios({ method: "post", url: apiURL + "/api/value-search/check-email-and-reset-token", data: { email: email, resetToken: resetToken } });
    },
    resetPassword: function (email, newPassword) {
        return axios({ method: "post", url: apiURL + "/api/value-search/reset-password", data: { email: email, newPassword: newPassword } });
    },
    login: function (email, password) {
        return axios({ method: "post", url: apiURL + "/api/value-search/reset-login", data: { email: email, password: password } });
    },
    setSessionAccessToken: function (id, sessionAccessToken) {
        return axios({ method: "post", url: apiURL + "/api/value-search/set-session-access-token", data: { id: id, sessionAccessToken: sessionAccessToken } });
    },
    findUserName: (account_id) => {
        return axios({ method: "post", url: apiURL + "/api/value-search/find-user-name", data: { account_id: account_id } });
    },
    //END: Account APIs...
    updatePortfolio: (account_id, portfolio) => {
        return axios({ method: "post", url: apiURL + "/api/value-search/update-portfolio", data: { account_id: account_id, portfolio: portfolio } });
    },
    findPortfolio: (account_id) => {
        return axios({ method: "post", url: apiURL + "/api/value-search/find-portfolio", data: { account_id: account_id } });
    }

}