import axios from "axios";

const apiURL = process.env.NODE_ENV === 'production' ? '' : '//localhost:3001'

export default {
    findSearchResults: (minPE, maxPE, minDebtEquity, maxDebtEquity, minPriceSales, maxPriceSales, minPriceToBook, maxPriceToBook, minCap, maxCap) => {
        return axios({ method: "post", url: apiURL + "/api/value-search/find-search-results", data: { minPE: minPE, maxPE: maxPE, minDebtEquity: minDebtEquity, maxDebtEquity: maxDebtEquity, minPriceSales: minPriceSales, maxPriceSales: maxPriceSales, minPriceToBook: minPriceToBook, maxPriceToBook: maxPriceToBook, minCap:minCap, maxCap:maxCap } });
    }
};