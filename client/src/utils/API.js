import axios from "axios";

const apiURL = process.env.NODE_ENV === 'production' ? '' : '//localhost:3001'

export default {
    findSearchResults: (minPE, maxPE) => {
        return axios({ method: "post", url: apiURL + "/api/value-search/find-search-results", data: { minPE: minPE, maxPE: maxPE } });
    }
};