const db = require("../models");

module.exports = {
    findSearchResults: (req, res) => {
        db.StockData.find({ "quote.peRatio": { $gte: req.body.minPE, $lte: req.body.maxPE } })
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))
    }
};