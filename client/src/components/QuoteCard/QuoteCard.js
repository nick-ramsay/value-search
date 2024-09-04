import React, { useState, useEffect } from "react";
import _ from 'lodash';
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { useInput } from "../../sharedFunctions/sharedFunctions";
import API from "../../utils/API";
import moment from "moment";
import TimelineIcon from '@mui/icons-material/Timeline';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import NotesIcon from '@mui/icons-material/Notes';
import ThesisIcon from '@mui/icons-material/MenuBook';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import editIcon from "../../images/outline_edit_white_24dp.png";
import commentsIcon from "../../images/outline_notes_white_24dp.png";
import shoppingBasketIcon from "../../images/round_shopping_basket_white_24dp.png";
import removeIcon from "../../images/round_remove_circle_outline_white_24dp.png";
import infoIcon from "../../images/round_info_white_24dp.png";
import motleyFoolIcon from "../../images/motley_fool_logo.png";
import kppIcon from "../../images/kpp_logo.png";
import valueSearchIcon from "../../images/value_search_logo.png";
import targetIcon from "../../images/outline_my_location_white_24dp.png";
import sellIcon from "../../images/outline_sell_white_24dp.png";

import { toTitleCase } from "../../sharedFunctions/sharedFunctions";
import "./style.css";

const QuoteCard = (props) => {
  let portfolio = props.portfolio !== undefined ? props.portfolio : [];
  let page = props.page;
  let portfolioEntry =
    portfolio.length > 0
      ? portfolio[
      portfolio.map((Object) => Object.symbol).indexOf(props.stock.symbol)
      ]
      : [];
  let stock = props.stock;
  let userID = props.userID;
  let updatePortfolio = props.updatePortfolio;
  let updateThesis = props.updateThesis;
  //let addLabel = props.addLabel;
  let findPortfolio = props.findPortfolio;
  let selectedStatus = props.selectedStatus;

  const addLabel = (symbol, newLabel, currentLabels) => {
    let portfolioIndex = portfolio
      .map((object) => object.symbol)
      .indexOf(symbol);
    let tempPortfolio = portfolio;
    let existingLabels = currentLabels !== undefined ? currentLabels : [];

    if (newLabel !== "-" && existingLabels.indexOf(newLabel) === -1) {
      existingLabels.push(newLabel);
    }

    tempPortfolio[portfolioIndex].labels = existingLabels;

    API.updatePortfolio(userID, tempPortfolio).then((res) => {
      findPortfolio(userID, selectedStatus);
    });
  };

  //console.log(props.stock.valueSearchScoreHistory);

  let valueSearchHistoryDates = [];
  let valueSearchHistoryScores = [];

  for (let i = 0; i < props.stock.valueSearchScoreHistory.length; i++) {
    //console.log(props.stock.valueSearchScoreHistory[i]);
    valueSearchHistoryDates.push(props.stock.valueSearchScoreHistory[i].date)
    valueSearchHistoryScores.push((props.stock.valueSearchScoreHistory[i].score * 100))
  }

  const removeLabel = (symbol, label) => {
    let tempPortfolio = portfolio;
    let symbolIndex = tempPortfolio
      .map((object) => object.symbol)
      .indexOf(symbol);
    let labelIndex = tempPortfolio[symbolIndex].labels.indexOf(label);

    tempPortfolio[symbolIndex].labels.splice(labelIndex, 1);

    API.updatePortfolio(userID, tempPortfolio).then((res) => {
      findPortfolio(userID, selectedStatus);
    });
  };

  return (
    <div
      className="card mb-3"
      style={{
        borderColor:
          _.isEqual(portfolioEntry, []) && portfolioEntry !== undefined
            ? "transparent"
            : _.isEqual(portfolioEntry,[]) === false &&
              portfolioEntry !== undefined &&
              portfolioEntry.status === "avoid"
              ? "#cf6679"
              : _.isEqual(portfolioEntry,[]) === false &&
                portfolioEntry !== undefined &&
                portfolioEntry.status === "temporaryavoid"
                ? "#fdfd96"
                : _.isEqual(portfolioEntry,[]) === false &&
                  portfolioEntry !== undefined &&
                  portfolioEntry.status === "-"
                  ? "transparent"
                  : _.isEqual(portfolioEntry,[]) === false &&
                    portfolioEntry !== undefined &&
                    page === "Home" &&
                    (portfolioEntry.status === "watch" ||
                      portfolioEntry.status === "own" ||
                      portfolioEntry.status === "tradableOwn" ||
                      portfolioEntry.status === "hold" ||
                      portfolioEntry.status === "icebox" ||
                      portfolioEntry.status === "speculative")
                    ? "#007bff"
                    : "transparent",
      }}
    >
      <div className="card-body">
        <h5 className="card-title row">
          <div className="col-md-12">
            <a
              href={
                "https://finviz.com/quote.ashx?t=" +
                stock.symbol.replace(".", "-") +
                "&ty=l&ta=0&p=w&tas=0"
              }
              target="_blank"
            >
              {stock.quote.companyName + " (" + stock.symbol + ")"}
            </a>
            {stock.valueSearchScore !== undefined &&
              stock.valueSearchScore.totalPossiblePoints > 0 ? (
              <span
                data-bs-toggle="modal"
                data-bs-target={"#" + stock.symbol.replace(".", "-") + "valueSearchScoreModal"}
                className={
                  stock.valueSearchScore.calculatedScorePercentage <= 0.33
                    ? "ml-2 vs-score-badge vs-score-badge-red"
                    : stock.valueSearchScore.calculatedScorePercentage <= 0.66
                      ? "ml-2 vs-score-badge vs-score-badge-yellow"
                      : "ml-2 vs-score-badge vs-score-badge-green"
                }
              >
                {Math.round(
                  stock.valueSearchScore.calculatedScorePercentage * 100
                ) + "%"}
                {stock.valueSearchScore.movingAverageSupport > 0 ? <TrendingUpIcon style={{ "height": "15px" }} /> : ""}
              </span>
            ) : (
              ""
            )}
            <span>
              <TimelineIcon className="ml-3 text-icon"
                src={TimelineIcon}
                alt="TimelineIcon"
                data-bs-toggle="modal"
                data-bs-target={"#" + stock.symbol.replace(".","-") + "valueSearchHistoryModal"}
              />
            </span>
            {userID !== undefined && userID !== "" ? (
              <span>
                <EditIcon
                  className="ml-3 text-icon"
                  src={editIcon}
                  alt="editIcon"
                  data-bs-toggle="modal"
                  data-bs-target={"#" + stock.symbol.replace(".","-") + "editModal"}
                />
                <NotesIcon
                  className="ml-3 text-icon"
                  src={commentsIcon}
                  alt="commentIcon"
                  data-bs-toggle="modal"
                  data-bs-target={"#" + stock.symbol.replace(".","-") + "commentModal"}
                />
                {/*
                <ThesisIcon
                  className="ml-3 text-icon"
                  src={ThesisIcon}
                  alt="thesisIcon"
                  data-bs-toggle="modal"
                  data-bs-target={"#" + stock.symbol + "ThesisModal"}
                />
                */}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="col-md-12 mt-1">
            <div className="col-md-12">
              {portfolioEntry !== undefined && portfolioEntry.status !== "-" ? (
                <span
                  className={
                    portfolioEntry.status === "avoid"
                      ? "badge badge-danger"
                      : portfolioEntry.status === "temporaryavoid"
                        ? "badge badge-yellow-custom"
                        : "badge badge-primary"
                  }
                >
                  {toTitleCase(
                    portfolioEntry.status === "temporaryavoid"
                      ? "Temporary Avoid"
                      : portfolioEntry.status === "tradableOwn" ? "Tradable Own" : portfolioEntry.status
                  )}
                </span>
              ) : (
                ""
              )}
            </div>
            {portfolioEntry !== undefined && portfolioEntry.labels !== undefined
              ? portfolioEntry.labels.map((label, i) => (
                <img
                  className="text-icon mt-2 m-1"
                  title={label}
                  src={
                    label === "Motley Fool"
                      ? motleyFoolIcon
                      : label === "KPP"
                        ? kppIcon
                        : label === "Value Search"
                          ? valueSearchIcon
                          : ""
                  }
                />
              ))
              : ""}
          </div>
          {/*Start: Edit Symbol Modal*/}
          <div
            className="modal fade"
            id={stock.symbol.replace(".","-") + "editModal"}
            tabIndex="-1"
            role="dialog"
            aria-labelledby={stock.symbol.replace(".","-") + "editModalLabel"}
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id={stock.symbol.replace(".","-") + "editModalLabel"}>
                    Edit {stock.quote.companyName + " (" + stock.symbol + ")"}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <select
                      id={stock.symbol + "PortfolioStatusInput"}
                      className="form-select"
                      defaultValue={
                        portfolioEntry != undefined ? portfolioEntry.status : ""
                      }
                      aria-label="Default select example"
                    >
                      <option
                        value="-"
                        selected={
                          portfolioEntry === undefined ||
                          portfolioEntry.status === "-"
                        }
                      >
                        -
                      </option>
                      <option
                        value="watch"
                        selected={
                          portfolioEntry !== undefined &&
                          portfolioEntry.status === "watch"
                        }
                      >
                        Watch
                      </option>
                      <option
                        value="tradableOwn"
                        selected={
                          portfolioEntry !== undefined &&
                          portfolioEntry.status === "tradableOwn"
                        }
                      >
                        Tradable Own
                      </option>
                      <option
                        value="own"
                        selected={
                          portfolioEntry !== undefined &&
                          portfolioEntry.status === "own"
                        }
                      >
                        Own
                      </option>
                      <option
                        value="hold"
                        selected={
                          portfolioEntry !== undefined &&
                          portfolioEntry.status === "hold"
                        }
                      >
                        Hold
                      </option>
                      <option
                        value="icebox"
                        selected={
                          portfolioEntry !== undefined &&
                          portfolioEntry.status === "icebox"
                        }
                      >
                        Icebox
                      </option>
                      <option
                        value="speculative"
                        selected={
                          portfolioEntry !== undefined &&
                          portfolioEntry.status === "speculative"
                        }
                      >
                        Speculative
                      </option>
                      <option
                        value="temporaryavoid"
                        selected={
                          portfolioEntry !== undefined &&
                          portfolioEntry.status === "temporaryavoid"
                        }
                      >
                        Temporary Avoid
                      </option>
                      <option
                        value="avoid"
                        selected={
                          portfolioEntry !== undefined &&
                          portfolioEntry.status === "avoid"
                        }
                      >
                        Avoid
                      </option>
                    </select>
                    <div className="input-group mt-2">
                      <span className="input-group-text">Comment</span>
                      <textarea
                        id={"new-comment-input-" + stock.symbol}
                        className="form-control form-control-small"
                        aria-label="With textarea"
                      ></textarea>
                    </div>
                    <form className="d-flex mt-2">
                      <select
                        id={stock.symbol + "newSelectedLabel"}
                        className="form-select form-control form-control-small"
                        aria-label="Default select example"
                      >
                        <option value="-" selected>
                          Select New Label
                        </option>
                        <option value="KPP">KPP</option>
                        <option value="Motley Fool">Motley Fool</option>
                        <option value="Value Search">Value Search</option>
                      </select>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary m-1 standard-button"
                        onClick={() => {
                          addLabel(
                            stock.symbol,
                            document.getElementById(
                              stock.symbol + "newSelectedLabel"
                            ).value,
                            portfolioEntry.labels
                          );
                        }}
                      >
                        Add
                      </button>
                    </form>
                    <div className="input-group mt-2">
                      {portfolioEntry !== undefined &&
                        portfolioEntry.labels !== undefined
                        ? portfolioEntry.labels.map((label, i) => (
                          <div className="badge badge-primary m-1">
                            <span>{label}</span>
                            <img
                              className="ml-2 text-icon"
                              src={removeIcon}
                              onClick={() => {
                                removeLabel(stock.symbol, label);
                              }}
                            />
                          </div>
                        ))
                        : ""}
                    </div>
                    <div className={"mt-2 " + (portfolioEntry !== undefined ? (portfolioEntry.status !== undefined && ["own", "tradableOwn", "hold", "speculative"].indexOf(portfolioEntry.status) === -1 ? "" : " d-none") : " d-none")}>
                      <div className="col-md-12 mb-3">
                        <label
                          className="form-check-label"
                          style={{ fontSize: 14 }}
                          htmlFor={"price-target-enabled-" + stock.symbol}
                        >
                          Price Target
                        </label>
                      </div>
                      <form className="d-flex">
                        <div className="form-check">
                          <input
                            className="form-check-input pt-2"
                            type="checkbox"
                            defaultChecked={
                              portfolioEntry !== undefined &&
                                portfolioEntry.priceTargetEnabled !== undefined
                                ? portfolioEntry.priceTargetEnabled
                                : false
                            }
                            id={"price-target-enabled-" + stock.symbol}
                          />
                        </div>

                        <div className="input-group mb-3">
                          <span className="input-group-text">$</span>
                          <input
                            id={"price-target-" + stock.symbol}
                            defaultValue={
                              portfolioEntry !== undefined &&
                                portfolioEntry.priceTarget !== undefined
                                ? Number(portfolioEntry.priceTarget)
                                : 0.00
                            }
                            placeholder={

                              portfolioEntry !== undefined &&
                                portfolioEntry.priceTarget !== undefined
                                ? Number(portfolioEntry.priceTarget)
                                : 0.00

                            }
                            type="number"
                            min="0.00"
                            step="0.01"
                            className="form-control"
                            aria-label="Amount (to the nearest dollar)"
                          />
                        </div>
                      </form>
                    </div>
                    <div className={"input-group mt-2 " + (portfolioEntry !== undefined ? (portfolioEntry.status !== undefined && ["own", "tradableOwn", "hold", "speculative"].indexOf(portfolioEntry.status) !== -1 ? "" : " d-none") : " d-none")}>
                      <div className="col-md-12 mb-3">
                        <label
                          className="form-check-label"
                          style={{ fontSize: 14 }}
                          htmlFor={"sell-target-enabled-" + stock.symbol}
                        >
                          Sell Target
                        </label>
                      </div>
                      <div className="row">
                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultChecked={
                                portfolioEntry !== undefined &&
                                  portfolioEntry.sellTargetEnabled !== undefined
                                  ? portfolioEntry.sellTargetEnabled
                                  : false
                              }
                              id={"sell-target-enabled-" + stock.symbol}
                            />
                          </div>
                        </div>
                        <div className="col-md-9">
                          <div className="input-group mb-3">
                            <span className="input-group-text">$</span>
                            <input
                              id={"sell-target-" + stock.symbol}
                              defaultValue={
                                portfolioEntry !== undefined &&
                                  portfolioEntry.sellTarget !== undefined
                                  ? Number(portfolioEntry.sellTarget)
                                  : 0.0
                              }
                              type="number"
                              min={0.0}
                              step={0.01}
                              className="form-control"
                              aria-label="Amount (to the nearest dollar)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary standard-button"
                    data-bs-dismiss="modal"
                    onClick={() => updatePortfolio(stock.symbol, userID)}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*End: Edit Symbol Modal*/}
          {/*Start: Comment Modal */}
          <div
            className="modal fade"
            id={stock.symbol.replace(".","-") + "commentModal"}
            tabIndex="-1"
            role="dialog"
            aria-labelledby={stock.symbol.replace(".","-") + "commentModalLabel"}
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5
                    className="modal-title"
                    id={stock.symbol.replace(".","-") + "commentModalLabel"}
                  >
                    Comments for{" "}
                    {stock.quote.companyName + " (" + stock.symbol + ")"}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body" style={{ "backgroundColor": "transparent" }}>
                  <div className="card">
                    <ul className="list-group list-group-flush">
                      {portfolioEntry !== undefined &&
                        portfolioEntry.comments !== undefined ? (
                        portfolioEntry.comments.map((comment, i) => (
                          <li className="list-group-item" style={{ "borderColor": "black" }}>
                            <p className="comment-content">
                              {'"' + comment.comment + '"'}
                            </p>
                            <span className="comment-date">{comment.date}</span>
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item">No Comments</li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*End: Comment Modal */}
          {/*Start: Thesis Modal */}
          <div
            className="modal fade"
            id={stock.symbol + "ThesisModal"}
            tabIndex="-1"
            role="dialog"
            aria-labelledby={stock.symbol + "ThesisModalLabel"}
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5
                    className="modal-title"
                    id={stock.symbol + "ThesisModalLabel"}
                  >
                    Thesis for{" "}
                    {stock.quote.companyName + " (" + stock.symbol + ")"}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body" style={{ "backgroundColor": "transparent" }}>

                  <form className="">

                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Thesis Statement</label>
                    <textarea className="form-control" id={stock.symbol + "ThesisInput"}></textarea>

                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary standard-button"
                    data-bs-dismiss="modal"
                    onClick={() => updateThesis(stock.symbol, userID)}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*END: Thesis Modal*/}
        </h5>
        <div className="row">
          {stock.fundamentals !== undefined &&
            stock.fundamentals.country !== undefined &&
            stock.fundamentals.country !== null ? (
            <div className="col-md-12">
              <span>
                <strong>Sector:</strong> {stock.fundamentals.sector} |{" "}
                <strong>Industry:</strong> {stock.fundamentals.industry} |{" "}
                <strong>Country:</strong> {stock.fundamentals.country}
                {stock.fundamentals.companyDescription !== null &&
                  stock.fundamentals.companyDescription !== undefined ? (
                  <span>
                    {" "}
                    <InfoIcon
                      src={infoIcon}
                      className="text-icon mb-1"
                      data-bs-toggle="modal"
                      data-bs-target={"#" + stock.symbol.replace(".","-") + "company-bio-modal"}
                    />
                  </span>
                ) : (
                  ""
                )}
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
        <div
          className="modal fade"
          id={stock.symbol.replace(".","-") + "company-bio-modal"}
          tabIndex="-1"
          aria-labelledby={stock.symbol.replace(".","-") + "company-bio-modal-label"}
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id={stock.symbol.replace(".","-") + "company-bio-modal-label"}
                >
                  {stock.quote.companyName + " (" + stock.symbol + ")"}
                </h5>

                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ fontSize: 14 }}>
                {stock.fundamentals !== undefined &&
                  stock.fundamentals.companyDescription !== undefined &&
                  stock.fundamentals.companyDescription !== null
                  ? stock.fundamentals.companyDescription
                  : "No company description available"}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <p>
              <strong>Price: </strong> ${stock.fundamentals.currentPrice}
              {portfolioEntry !== undefined &&
                ["own", "tradableOwn", "hold", "speculative"].indexOf(portfolioEntry.status) ===
                -1 &&
                portfolioEntry.priceTargetEnabled === true ? (
                portfolioEntry.priceTarget >= stock.fundamentals.currentPrice ?
                  <span className="ml-2 badge badge-primary-outline">{"✅ $" + portfolioEntry.priceTarget.toFixed(2) + "  ✅"}</span> : <span className="ml-2 badge badge-primary-outline">{"🎯 $" + portfolioEntry.priceTarget.toFixed(2) + "  🎯"}</span>
              ) : (
                ""
              )}
              {portfolioEntry !== undefined &&
                ["own", "tradableOwn", "hold", "speculative"].indexOf(portfolioEntry.status) !==
                -1 &&
                portfolioEntry.sellTargetEnabled === true ? (
                portfolioEntry.sellTarget <= stock.fundamentals.currentPrice ?
                  <span className="ml-2 badge badge-primary-outline">{"✅ $" + portfolioEntry.sellTarget.toFixed(2) + "  ✅"}</span> : <span className="ml-2 badge badge-primary-outline">{"🎯 $" + portfolioEntry.sellTarget.toFixed(2) + "  🎯"}</span>
              ) : (
                ""
              )}
            </p>
          </div>
          <div className="col-md-4">
            <p>
              <strong>Target Price: </strong>
              {stock.fundamentals["Target Price"] !== undefined
                ? "$" + Number(stock.fundamentals["Target Price"]).toFixed(2)
                : "-"}
            </p>
          </div>
          <div className="col-md-4">
            {stock.fundamentals !== undefined &&
              stock.fundamentals["Target Price"] >= stock.fundamentals.currentPrice ? (
              <p className="badge badge-success py-1 px-1">
                {(
                  (1 -
                    stock.fundamentals.currentPrice /
                    stock.fundamentals["Target Price"]) *
                  100
                ).toFixed(2) + "% Undervalued"}
              </p>
            ) : stock.fundamentals["Target Price"] === undefined ? (
              ""
            ) : (
              <p className="badge badge-danger py-1 px-1">
                {(
                  (stock.fundamentals.currentPrice /
                    stock.fundamentals["Target Price"] -
                    1) *
                  100
                ).toFixed(2) + "% Overvalued"}
              </p>
            )}
          </div>
        </div>
        <div className="accordion">
          <div
            id={"fiftyTwoWeekPricebar" + stock.symbol}
            className="progress bg-dark collapsed"
            data-bs-target={"#fiftyTwoWeekPriceValues" + stock.symbol.replace(".","-")}
            data-bs-toggle="collapse"
            aria-expanded="false"
            aria-controls={"fiftyTwoWeekPriceValues" + stock.symbol.replace(".","-")}
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width:
                  Math.round(
                    ((stock.fundamentals.currentPrice - stock.quote.week52Low) /
                      (stock.quote.week52High - stock.quote.week52Low)) *
                    100
                  ) + "%",
              }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {"$" + stock.fundamentals.currentPrice}
            </div>
          </div>
        </div>
        <div
          id={"fiftyTwoWeekPriceValues" + stock.symbol.replace(".","-")}
          className="accordion-collapse collapse"
          aria-labelledby={"fiftyTwoWeekPricebar" + stock.symbol.replace(".","-")}
          data-bs-parent={"#fiftyTwoWeekPricebar" + stock.symbol.replace(".","-")}
        >
          <div className="row">
            <div className="col-md-6">
              <span className="badge badge-danger">
                {"52 Week Low: $" + stock.quote.week52Low.toFixed(2)}
              </span>
            </div>
            <div className="col-md-6">
              <span className="badge badge-success">
                {"52 Week High: $" + stock.quote.week52High.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-4">
            <span>
              <strong>Index: </strong>
              {stock.symbolData.exchangeName !== undefined
                ? stock.symbolData.exchangeName
                : "-"}
            </span>
          </div>
          <div className="col-md-4">
            <span>
              <strong>Forward P/E: </strong>
              {stock.fundamentals["Forward P/E"] !== undefined
                ? Number(stock.fundamentals["Forward P/E"]).toFixed(2)
                : "-"}
            </span>
          </div>
          <div className="col-md-4">
            <span>
              <strong>Profit Margin: </strong>
              {stock.fundamentals["Profit Margin (%)"] !== undefined
                ? Number(stock.fundamentals["Profit Margin (%)"]).toFixed(2) + "%"
                : "-"}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <span>
              <strong>Market Cap: </strong>$
              {(stock.fundamentals["Market Cap"]).toFixed(2)} billion
            </span>
          </div>
          <div className="col-md-4">
            <span>
              <strong>Debt/Equity: </strong>
              {stock.fundamentals["Debt/Eq"] !== undefined
                ? stock.fundamentals["Debt/Eq"]
                : "-"}{" "}
            </span>
          </div>
          <div className="col-md-4">
            <span>
              <strong>Price-to-Sales: </strong>
              {stock.fundamentals["P/S"] !== undefined
                ? stock.fundamentals["P/S"]
                : "-"}{" "}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <span>
              <strong>Current P/E: </strong>
              {stock.fundamentals["P/E"] ? stock.fundamentals["P/E"]:"-"}
            </span>
          </div>
          <div className="col-md-4">
            <span>
              <strong>Price-to-Book: </strong>
              {stock.fundamentals["P/B"] !== undefined
                ? stock.fundamentals["P/B"]
                : "-"}{" "}
            </span>
          </div>
          <div
            className="col-md-4"
            data-bs-toggle="modal"
            data-bs-target={"#" + stock.symbol + "movingAverageTrendModal"}
          >
            <span>
              <strong>200 Day Moving Average: </strong>
              <span
                style={{
                  color:
                    stock.fundamentals !== undefined &&
                      stock.fundamentals.mva200 < stock.fundamentals.currentPrice
                      ? (localStorage.getItem("vs-theme") === "dark" ? "#cf6679" : "green")
                      : (localStorage.getItem("vs-theme") === "dark" ? "#03DAC6" : "red"),
                  fontWeight: "bold"
                }}
              >
                {stock.fundamentals.mva200 !== undefined
                  ? "$" + stock.fundamentals.mva200.toFixed(2)
                  : "-"}{" "}
              </span>
            </span>
          </div>
        </div>
        <div className="row">
          <div
            className="col-md-4"
            data-bs-toggle="modal"
            data-bs-target={"#" + stock.symbol + "movingAverageTrendModal"}
          >
            <span>
              <strong>50 Day Moving Average: </strong>
              <span
                style={{
                  color:
                    stock.fundamentals !== undefined &&
                      stock.fundamentals.mva50 < stock.fundamentals.currentPrice
                      ? (localStorage.getItem("vs-theme") === "dark" ? "#cf6679" : "green")
                      : (localStorage.getItem("vs-theme") === "dark" ? "#03DAC6" : "red"),
                  fontWeight: "bold"
                }}
              >
                {stock.fundamentals.mva50 !== undefined
                  ? "$" + stock.fundamentals.mva50.toFixed(2)
                  : "-"}{" "}
              </span>
            </span>
          </div>
          <div className="col-md-4">
            <span>
              <strong>Current EPS: </strong>
              <span>
                {stock.fundamentals["EPS (ttm)"] !== undefined && stock.fundamentals["EPS (ttm)"] !== null
                  ? Number(stock.fundamentals["EPS (ttm)"]).toFixed(2)
                  : "-"}{" "}
              </span>
            </span>
          </div>
          <div className="col-md-4">
            <span>
              <strong>Next Year EPS: </strong>
              <span>
                {stock.fundamentals["EPS next Y"] !== undefined && stock.fundamentals["EPS next Y"] !== undefined
                  ? Number(stock.fundamentals["EPS next Y"]).toFixed(2) +
                  (stock.fundamentals["EPS (ttm)"] <
                    stock.fundamentals["EPS next Y"]
                    ? " ⬆"
                    : " ⬇")
                  : "-"}{" "}
              </span>
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <span>
              <strong>EPS Q/Q: </strong>
              <span>
                {stock.fundamentals["EPS Q/Q (%)"] !== undefined
                  ? Number(stock.fundamentals["EPS Q/Q (%)"]).toFixed(2) + "%"
                  : "-"}{" "}
              </span>
            </span>
          </div>
          <div className="col-md-4">
            <span>
              <strong>EPS next Y: </strong>
              <span>
                {stock.fundamentals["EPS next Y (%)"] !== undefined
                  ? Number(stock.fundamentals["EPS next Y (%)"]).toFixed(2) +
                  "%"
                  : "-"}{" "}
              </span>
            </span>
          </div>
          <div className="col-md-4">
            <span>
              <strong>EPS next 5Y: </strong>
              <span>
                {stock.fundamentals["EPS next 5Y (%)"] !== undefined &&
                  isNaN(Number(stock.fundamentals["EPS next 5Y (%)"])) === false
                  ? Number(stock.fundamentals["EPS next 5Y (%)"]).toFixed(2) +
                  "%"
                  : "-"}{" "}
              </span>
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <span>
              <strong>Price to Earnings Growth (PEG): </strong>
              <span>
                {stock.fundamentals["PEG"] !== undefined && isNaN(stock.fundamentals["PEG"]) === false
                  ? Number(stock.fundamentals["PEG"]).toFixed(2)
                  : "-"}{" "}
              </span>
            </span>
          </div>
          <div className="col-md-4">
            <span>
              <strong>Return on Equity (ROE): </strong>
              <span>
                {stock.fundamentals["ROE (%)"] !== undefined && isNaN(stock.fundamentals["ROE (%)"]) === false
                  ? Number(stock.fundamentals["ROE (%)"]).toFixed(2) +
                  "%"
                  : "-"}{" "}
              </span>
            </span>
          </div>
          <div className="col-md-4">
            <span>
              <strong>Relative Strength Index (RSI): </strong>
              <span>
                {stock.fundamentals["RSI (14)"] !== undefined &&
                  isNaN(Number(stock.fundamentals["RSI (14)"])) === false
                  ? Number(stock.fundamentals["RSI (14)"]).toFixed(2) +
                  "%"
                  : "-"}{" "}
              </span>
            </span>
          </div>
        </div>
        {/* Start MA Trend Modal*/}
        <div
          className="modal fade"
          id={stock.symbol + "movingAverageTrendModal"}
          tabIndex="-1"
          aria-labelledby={stock.symbol + "movingAverageTrendModalLabel"}
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id={stock.symbol + "movingAverageTrendModalLabel"}
                >
                  {"Moving Average Trend for " + stock.symbol}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row text-center">
                  <Line
                    data={{
                      labels: [
                        "52 Week High (" + stock.quote.week52High + ")",
                        "200d MA",
                        "50d MA",
                        "Current Price (" + stock.fundamentals.currentPrice + ")",
                      ],
                      datasets: [
                        {
                          label: "Moving Average Trend",
                          data: [
                            stock.quote.week52High,
                            stock.fundamentals.mva200,
                            stock.fundamentals.mva50,
                            stock.fundamentals.currentPrice,
                          ],
                          fill: false,
                          backgroundColor: "blue",
                          borderColor: "blue",
                          borderWidth: 1,
                          pointRadius: 2,
                          pointHoverRadius: 4
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        y: {
                          min: stock.quote.week52Low,
                          max: Math.round(stock.quote.week52High + (stock.quote.week52High * .05)),
                        },
                      },
                    }}
                  />
                </div>
                <div className="modal-footer"></div>
              </div>
            </div>
          </div>
        </div>
        {/* END: Moving Average Trend Modal */}
        {/* START: Value Search History Modal */}
        <div
          className="modal fade"
          id={stock.symbol.replace(".","-") + "valueSearchHistoryModal"}
          tabIndex="-1"
          aria-labelledby={stock.symbol.replace(".","-") + "valueSearchHistoryLabel"}
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id={stock.symbol.replace(".","-") + "valueSearchHistoryModalLabel"}
                >
                  {"Value Search Score Trend for " + stock.symbol}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row text-center">
                  <Line
                    data={{
                      labels: valueSearchHistoryDates,
                      datasets: [
                        {
                          label: "Value Search Scores",
                          data: valueSearchHistoryScores,
                          fill: false,
                          backgroundColor: "blue",
                          borderColor: "blue",
                          borderWidth: 1,
                          pointRadius: 2,
                          pointHoverRadius: 4
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        y: {
                          min: 0,
                          max: 100,
                        },
                      },
                    }}
                  />
                </div>
                <div className="modal-footer"></div>
              </div>
            </div>
          </div>
        </div>
        {/* END: Value Search History Modal */}
        <div
          className="modal fade"
          id={stock.symbol.replace(".", "-") + "valueSearchScoreModal"}
          tabIndex="-1"
          aria-labelledby={stock.symbol.replace(".", "-") + "valueSearchScoreModalLabel"}
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id={stock.symbol.replace(".", "-") + "valueSearchScoreModalLabel"}
                >
                  {"Value Search Score for " + stock.symbol}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row text-center">
                  {/*
                    healthyPE: 0,
                                healthyPEAttempted: false,
                                healthyFuturePE: 0,
                                healthyFuturePEAttempted: false,
                                forwardPEGreater: 0,
                                forwardPEGreaterAttempted: false,
                                healthyDebtEquity: 0,
                                healthyDebtEquityAttempted: false,
                                healthyPriceBook: 0,
                                healthyPriceBookAttempted: false,
                                healthyPriceSales: 0,
                                healthyPriceSalesAttempted: false,
                                movingAveragesGreaterThanPrice: 0,
                                movingAveragesGreaterThanPriceAttempted: false,
                                movingAverageSupport: 0,
                                movingAverageSupportAttempted: false,
                    */}
                  <p>
                    {stock.valueSearchScore !== undefined
                      ? stock.quote.companyName +
                      " has a score of " +
                      stock.valueSearchScore.totalCalculatedPoints +
                      " out of a possible " +
                      stock.valueSearchScore.totalPossiblePoints +
                      " points, for a score percentage of " +
                      (
                        stock.valueSearchScore.calculatedScorePercentage * 100
                      ).toFixed(2) +
                      "%"
                      : ""}
                  </p>
                  <ul className="list-group">
                    {stock.valueSearchScore !== undefined &&
                      stock.valueSearchScore.healthyPEAttempted === true ? (
                      <li className="list-group-item">
                        {stock.valueSearchScore.healthyPE === 0
                          ? "❌ Unhealthy Current PE Ratio ❌"
                          : "✅ Good Current PE Ratio ✅"}
                      </li>
                    ) : (
                      ""
                    )}
                    {stock.valueSearchScore !== undefined &&
                      stock.valueSearchScore.healthyFuturePEAttempted === true ? (
                      <li className="list-group-item">
                        {stock.valueSearchScore.healthyFuturePE === 0
                          ? "❌ Unhealthy Forward PE Ratio ❌"
                          : "✅ Good Forward PE Ratio ✅"}
                      </li>
                    ) : (
                      ""
                    )}
                    {stock.valueSearchScore !== undefined &&
                      stock.valueSearchScore.profitMarginPositiveAttempted ===
                      true ? (
                      <li className="list-group-item">
                        {stock.valueSearchScore.profitMarginPositive === 0
                          ? "❌ Company not profitable ❌"
                          : "✅ Company is profitable ✅"}
                      </li>
                    ) : (
                      ""
                    )}
                    {stock.valueSearchScore !== undefined &&
                      stock.valueSearchScore.forwardPEGreaterAttempted ===
                      true ? (
                      <li className="list-group-item">
                        {stock.valueSearchScore.forwardPEGreater === 0
                          ? "❌ Forward PE Ratio Lower Than Current ❌"
                          : "✅ Forward PE Ratio Higher Than Current ✅"}
                      </li>
                    ) : (
                      ""
                    )}
                    {stock.valueSearchScore !== undefined &&
                      stock.valueSearchScore.healthyDebtEquityAttempted ===
                      true ? (
                      <li className="list-group-item">
                        {stock.valueSearchScore.healthyDebtEquity === 0
                          ? "❌ Unhealthy Debt to Equity ❌"
                          : "✅ Good Debt to Equity ✅"}
                      </li>
                    ) : (
                      ""
                    )}
                    {stock.valueSearchScore !== undefined &&
                      stock.valueSearchScore.healthyPriceBookAttempted ===
                      true ? (
                      <li className="list-group-item">
                        {stock.valueSearchScore.healthyPriceBook === 0
                          ? "❌ Unhealthy Price to Book ❌"
                          : "✅ Good Price to Book ✅"}
                      </li>
                    ) : (
                      ""
                    )}
                    {stock.valueSearchScore !== undefined &&
                      stock.valueSearchScore.healthyPriceSalesAttempted ===
                      true ? (
                      <li className="list-group-item">
                        {stock.valueSearchScore.healthyPriceSales === 0
                          ? "❌ Unhealthy Price to Sales ❌"
                          : "✅ Good Price to Sales ✅"}
                      </li>
                    ) : (
                      ""
                    )}
                    {stock.valueSearchScore !== undefined &&
                      stock.valueSearchScore.returnOnEquityAttempted ===
                      true ? (
                      <li className="list-group-item">
                        {stock.valueSearchScore.returnOnEquity === 0
                          ? "❌ Unhealthy Return on Equity ❌"
                          : "✅ Good Return on Equity ✅"}
                      </li>
                    ) : (
                      ""
                    )}
                    {stock.valueSearchScore !== undefined &&
                      stock.valueSearchScore.priceToEarningsGrowthAttempted ===
                      true ? (
                      <li className="list-group-item">
                        {stock.valueSearchScore.priceToEarningsGrowth === 0
                          ? "❌ Unhealthy Price to Earnings Growth (PEG) ❌"
                          : "✅ Good Price to Earnings Growth (PEG) ✅"}
                      </li>
                    ) : (
                      ""
                    )}
                    {stock.valueSearchScore !== undefined &&
                      stock.valueSearchScore.relativeStengthIndexAttempted ===
                      true ? (
                      <li className="list-group-item">
                        {stock.valueSearchScore.relativeStengthIndex == 0
                          ? "❌ Unhealthy Relative Strength Index (RSI) ❌"
                          : stock.valueSearchScore.relativeStengthIndex === 1 ? "✅ Good Relative Strength Index (RSI) (30 - 70) ✅" : "✅ Great Relative Strength Index (RSI) (< 30) ✅"
                        }
                      </li>
                    ) : (
                      ""
                    )}
                    {stock.valueSearchScore !== undefined &&
                      stock.valueSearchScore
                        .movingAveragesGreaterThanPriceAttempted === true ? (
                      <li className="list-group-item">
                        {stock.valueSearchScore
                          .movingAveragesGreaterThanPrice === 0
                          ? "❌ Stock trading above it's 200 and 50 day moving averages ❌"
                          : "✅ Stock trading below it's 200 and 50 day moving averages ✅"}
                      </li>
                    ) : (
                      ""
                    )}
                    {stock.valueSearchScore !== undefined &&
                      stock.valueSearchScore.movingAverageSupportAttempted ===
                      true ? (
                      <li className="list-group-item">
                        {stock.valueSearchScore.movingAverageSupport === 0
                          ? "❌ Price hasn't found support with moving averages ❌"
                          : "✅ Stock may have found support with it's moving averages ✅"}
                      </li>
                    ) : (
                      ""
                    )}
                  </ul>
                </div>
                <div className="modal-footer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;