const db = require("../models");

module.exports = {
    findSearchResults: (req, res) => {
        db.StockData.find({
            "quote.peRatio": { $gte: Number(req.body.minPE), $lte: Number(req.body.maxPE) },
            "fundamentals.Debt/Eq": { $gte: Number(req.body.minDebtEquity), $lte: Number(req.body.maxDebtEquity) },
            "fundamentals.P/S": { $gte: Number(req.body.minPriceSales), $lte: Number(req.body.maxPriceSales) },
            "fundamentals.P/B": { $gte: Number(req.body.minPriceToBook), $lte: Number(req.body.maxPriceToBook) }
            //"quote.marketCap": { $gte: Number(req.body.minCap), $lte: Number(req.body.maxCap) }
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
        db.StockData.find({"symbol" : { $in : req.body.symbols}})
            .then(dbModel => res.json(dbModel))
            .catch(err => console.log(err))
        
    }
};