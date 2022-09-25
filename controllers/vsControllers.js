const db = require("../models");

module.exports = {
    findSearchResults: (req, res) => {
        console.log(req.body);
        db.StockData.find({
            "quote.peRatio": { $gte: Number(req.body.minPE), $lte: Number(req.body.maxPE) },
            "fundamentals.Debt/Eq": { $gte: Number(req.body.minDebtEquity), $lte: Number(req.body.maxDebtEquity) }, 
            "fundamentals.P/S": { $gte: Number(req.body.minPriceSales), $lte: Number(req.body.maxPriceSales) },
            "fundamentals.P/B": { $gte: Number(req.body.minPriceToBook), $lte: Number(req.body.maxPriceToBook) }
            //"quote.marketCap": { $gte: Number(req.body.minCap), $lte: Number(req.body.maxCap) }
        })
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))
    }
};

//minPriceToBook,maxPriceToBook