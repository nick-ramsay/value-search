import axios from "axios";

const apiURL = process.env.NODE_ENV === "production" ? "" : "//localhost:3001";

export default {
  findSearchResults: (
    minPE,
    maxPE,
    minDebtEquity,
    maxDebtEquity,
    minPriceSales,
    maxPriceSales,
    minPriceToBook,
    maxPriceToBook,
    minCap,
    maxCap,
    minProfitMargin,
    potentialBottomParameter
  ) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/find-search-results",
      data: {
        minPE: minPE,
        maxPE: maxPE,
        minDebtEquity: minDebtEquity,
        maxDebtEquity: maxDebtEquity,
        minPriceSales: minPriceSales,
        maxPriceSales: maxPriceSales,
        minPriceToBook: minPriceToBook,
        maxPriceToBook: maxPriceToBook,
        minCap: minCap,
        maxCap: maxCap,
        minProfitMargin: minProfitMargin,
      },
    });
  },
  findScoreSearchResults: (maSupportParameter) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/find-score-search-results",
      data: { maSupportParameter: maSupportParameter },
    });
  },
  findSingleStock: (searchSymbol) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/find-single-stock",
      data: { searchSymbol },
    });
  },
  updatePortfolioStatus: (symbol, status) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/update-portfolio-status",
      data: { symbol: symbol, status: status },
    });
  },
  findPortfolioResults: () => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/find-portfolio-results",
      data: {},
    });
  },
  returnPortfolio: (symbols) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/return-portfolio",
      data: { symbols },
    });
  },
  findPortfolioQuotes: (symbols, selectedStatus) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/find-portfolio-quotes",
      data: { symbols, selectedStatus },
    });
  },
  //START: Account APIs...
  sendEmail: function (messageInfo) {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/send-email",
      data: [messageInfo],
    });
  },
  createAccount: function (newAccountInfo) {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/create-account",
      data: newAccountInfo,
    });
  },
  setEmailVerificationToken: function (email) {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/set-email-verification-token",
      data: { email: email },
    });
  },
  checkEmailVerificationToken: function (email, emailVerificationToken) {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/check-email-verification-token",
      data: { email: email, emailVerificationToken: emailVerificationToken },
    });
  },
  deleteEmailVerificationToken: function (email) {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/delete-email-verification-token",
      data: { email: email },
    });
  },
  checkExistingAccountEmails: function (email) {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/check-existing-account-emails",
      data: [email],
    });
  },
  setEmailResetCode: function (email, generatedResetToken) {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/reset-password-request",
      data: [email, generatedResetToken],
    });
  },
  checkEmailAndResetToken: function (email, resetToken) {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/check-email-and-reset-token",
      data: { email: email, resetToken: resetToken },
    });
  },
  resetPassword: function (email, newPassword) {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/reset-password",
      data: { email: email, newPassword: newPassword },
    });
  },
  login: function (email, password) {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/reset-login",
      data: { email: email, password: password },
    });
  },
  setSessionAccessToken: function (id, sessionAccessToken) {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/set-session-access-token",
      data: { id: id, sessionAccessToken: sessionAccessToken },
    });
  },
  findUserName: (account_id) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/find-user-name",
      data: { account_id: account_id },
    });
  },
  //END: Account APIs...
  updatePortfolio: (account_id, portfolio, symbol) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/update-portfolio",
      data: { account_id: account_id, portfolio: portfolio, symbol:symbol },
    });
  },
  updateThesis: (account_id, newThesis, symbol) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/update-thesis",
      data: { account_id: account_id, newThesis: newThesis, symbol: symbol },
    });
  },
  addLabel: (account_id, labels) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/add-label",
      data: { account_id: account_id, labels: labels },
    });
  },
  findPortfolio: (account_id) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/find-portfolio",
      data: { account_id: account_id },
    });
  },
  syncPortfolioWithEtrade: (symbols, status) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/sync-portfolio-with-etrade",
      data: { symbols: symbols, status: status },
    });
  },
  returnPortfolioSymbolData: (symbols) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/return-portfolio-symbol-data",
      data: { symbols: symbols },
    });
  },
  //Portfolio Beta
  getAccountID: (sessionAccessToken) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/get-account-id",
      data: { sessionAccessToken: sessionAccessToken },
    });
  },
  getPortfolio: (account_id) => {
    return axios({
      method: "post",
      url: apiURL + "/api/value-search/get-portfolio",
      data: { account_id: account_id },
    });
  },
};
