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
    }
};