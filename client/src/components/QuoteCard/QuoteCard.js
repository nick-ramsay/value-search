import React, { useState, useEffect } from "react";
import editIcon from "../../images/outline_edit_white_24dp.png";

const QuoteCard = (props) => {
    let portfolio = props.portfolio;
    let portfolioEntry = portfolio.length > 0 ? portfolio[portfolio.map(Object => Object.symbol).indexOf(props.stock.symbol)] : []
    let stock = props.stock
    let userID = props.userID;
    let updatePortfolio = props.updatePortfolio;

    console.log(portfolioEntry.status)
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title row">
                    <div className="col-md-12">
                        <a href={"https://finviz.com/quote.ashx?t=" + stock.symbol + "&ty=l&ta=0&p=m&tas=0"} target="_blank">{stock.quote.companyName + " (" + stock.symbol + ")"}</a>
                        {userID !== undefined && userID !== "" ?
                            <span><img
                                className="ml-3 text-icon"
                                src={editIcon}
                                alt="editIcon"
                                data-bs-toggle="modal" data-bs-target={"#" + stock.symbol + "editModal"}
                            /></span> : ""
                        }
                    </div>
                    {/*Start: Edit Symbol Modal*/}
                    <div class="modal fade" id={stock.symbol + "editModal"} tabindex="-1" role="dialog" aria-labelledby={stock.symbol + "editModalLabel"} aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id={stock.symbol + "editModalLabel"}>Edit {stock.quote.companyName + " (" + stock.symbol + ")"}</h5>
                                    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <select id={stock.symbol + "PortfolioStatusInput"} class="form-select" defaultValue={portfolioEntry !== undefined ? portfolioEntry.status : ""} aria-label="Default select example">
                                            <option value="-" selected={portfolioEntry.status === "-" || portfolioEntry.status === undefined}>-</option>
                                            <option value="watch" selected={portfolioEntry.status === "watch"}>Watch</option>
                                            <option value="own" selected={portfolioEntry.status === "own"}>Own</option>
                                            <option value="hold" selected={portfolioEntry.status === "hold"}>Hold</option>
                                            <option value="icebox" selected={portfolioEntry.status === "icebox"}>Icebox</option>
                                            <option value="speculative" selected={portfolioEntry.status === "speculative"}>Speculative</option>
                                        </select>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary" onClick={() => updatePortfolio(stock.symbol, userID)}>Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Start: Edit Symbol Modal*/}
                </h5>
                <div className="row">
                    {stock.fundamentals.country && stock.fundamentals.country !== null ?
                        <div className="col-md-12">
                            <span><strong>Sector:</strong> {stock.fundamentals.sector} | <strong>Industry:</strong> {stock.fundamentals.industry} | <strong>Country:</strong> {stock.fundamentals.country}</span>
                        </div>
                        : ""}
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <p><strong>Price: </strong> ${stock.quote.latestPrice.toFixed(2)}</p>
                    </div>
                    <div className="col-md-4">
                        <p><strong>Target Price: </strong> ${Number(stock.fundamentals['Target Price']).toFixed(2)}</p>
                    </div>
                    <div className="col-md-4">
                        {stock.fundamentals['Target Price'] >= stock.quote.latestPrice ?
                            <p className="badge badge-success py-1 px-1">{((1 - (stock.quote.latestPrice / stock.fundamentals['Target Price'])) * 100).toFixed(2) + "% Undervalued"}</p>
                            : <p className="badge badge-danger py-1 px-1">{(((stock.quote.latestPrice / stock.fundamentals['Target Price']) - 1) * 100).toFixed(2) + "% Overvalued"}</p>}
                    </div>
                </div>
                <div className="progress bg-dark">
                    <div className="progress-bar" role="progressbar" style={{ width: Math.round(stock.quote.latestPrice / stock.quote.week52High * 100) + "%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{"$" + stock.quote.latestPrice}</div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-4">
                        <p><strong>Index: </strong>{stock.symbolData.exchangeName}</p>
                    </div>
                    <div className="col-md-4">
                        <p><strong>P/E: </strong>{stock.quote.peRatio}</p>
                    </div>
                    <div className="col-md-4">
                        <p><strong>Profit Margin: </strong>{Number(stock.fundamentals['Profit Margin (%)']).toFixed(2)}%</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <p><strong>Market Cap: </strong>${(stock.quote.marketCap / 1000000000).toFixed(2)} billion</p>
                    </div>
                    <div className="col-md-4">
                        <p><strong>Debt/Equity: </strong>{(stock.fundamentals['Debt/Eq'])} </p>
                    </div>
                    <div className="col-md-4">
                        <p><strong>Price-to-Sales: </strong>{(stock.fundamentals['P/S'])} </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <p><strong>Price-to-Book: </strong>{(stock.fundamentals['P/B'])} </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuoteCard;