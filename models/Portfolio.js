const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PortfolioSchema = new Schema({
    symbol: { type: String },
    status: { type: String }
})

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

module.exports = Portfolio;