import React, { useState, useEffect } from "react";
import { useInput } from "../../sharedFunctions/sharedFunctions";
import API from "../../utils/API";
import moment from "moment";
import logo from "../../../src/logo.svg";
import GithubLogo from "../../images/github_logos/GitHub_Logo_White.png";
import mongoLogo from "../../images/mongo_logo.png";
import expandMoreIcon from "../../images/baseline_expand_more_black_48dp.png";
import expandLessIcon from "../../images/baseline_expand_less_black_48dp.png";
import "./style.css";

const Home = () => {
  var [valueSearchData, setValueSearchData] = useState([]);
  var [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  var [minPE, setMinPE] = useInput(10);
  var [maxPE, setMaxPE] = useInput(15);
  var [minDebtEquity, setMinDebtEquity] = useInput(0.0);
  var [maxDebtEquity, setMaxDebtEquity] = useInput(2.0);
  var [minPriceSales, setMinPriceSales] = useInput(0.0);
  var [maxPriceSales, setMaxPriceSales] = useInput(2.0);
  var [minPriceToBook, setMinPriceToBook] = useInput(0.95);
  var [maxPriceToBook, setMaxPriceToBook] = useInput(1.1);
  var [minCap, setMinCap] = useState(0);
  var [maxCap, setMaxCap] = useState(10000000000);
  var [metricVariationPercentage, setMetricVariationPercentage] = useState(0);
  var [metricVariationMultiple, setMetricVariationMultiple] = useState(1);
  var [investmentType, setInvestmentType] = useState("cs");
  var [valueSearchResultCount, setValueSearchResultCount] = useState(-1);
  var [currentSort, setCurrentSort] = useState("");
  var [loading, setLoading] = useState(true);
  
  const setMarketCapSize = (event) => {};
  const selectedInvestmentType = (event) => {};

  /*
    const renderMessages = () => {
        API.findAllMessages().then(
            (res) => {
                setMessages(messages => res.data);
            }
        );
    }

    const saveMessage = (event) => {
        if (newMessage !== "") {
            API.createMessage(newMessage, new Date()).then(
                (res) => {
                    renderMessages();
                    document.getElementById('messageInput').value = "";
                }
            );
        }
    };

    const deleteMessage = (event) => {
        let messageDeletionID = event.currentTarget.dataset.message_id;
        API.deleteOneMessage(messageDeletionID).then(
            (res) => {
                renderMessages();
            }
        );
    }*/

  useEffect(() => {
    //renderMessages();
  }, []);

  return (
    <div>
      <div className="App">
        <header className="App-header p-4">
          <h1>Value Search</h1>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/pages/Home/Home.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <div className="container">
          <div>
            <div className="accordion" id="accordionExample">
              <div>
                <a
                  className="text-center"
                  href="#"
                  data-toggle="collapse"
                  data-target="#collapseOne"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                  onClick={
                    advancedOptionsOpen === false
                      ? () => {
                          setAdvancedOptionsOpen((advancedOptionsOpen) => true);
                        }
                      : () => {
                          setAdvancedOptionsOpen(
                            (advancedOptionsOpen) => false
                          );
                        }
                  }
                >
                  Search Parameters{" "}
                  {advancedOptionsOpen === true ? (
                    <img
                      className="text-icon"
                      src={expandLessIcon}
                      alt="expandLessIcon"
                    />
                  ) : (
                    <img
                      className="text-icon"
                      src={expandMoreIcon}
                      alt="expandMoreIcon"
                    />
                  )}
                </a>
                <div
                  id="collapseOne"
                  className="collapse m-1"
                  aria-labelledby="headingOne"
                  data-parent="#accordionExample"
                >
                  <div className="card mt-1">
                    <div className="card-body">
                      <form>
                        <div className="row pr-3 pl-3">
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <label htmlFor="minPEInput">Min PE Ratio</label>
                              <input
                                type="number"
                                className="form-control"
                                id="minPEInput"
                                aria-describedby="minPEInput"
                                placeholder="Minimum PE Ratio"
                                defaultValue={10}
                                onChange={setMinPE}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <label htmlFor="maxPEInput">Max PE Ratio</label>
                              <input
                                type="number"
                                className="form-control"
                                id="maxPEInput"
                                aria-describedby="maxPEInput"
                                placeholder="Maximum PE Ratio"
                                defaultValue={15}
                                onChange={setMaxPE}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row pr-3 pl-3">
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <label htmlFor="minDebtEquityInput">
                                Min Debt/Equity
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="minDebtEquityInput"
                                aria-describedby="minDebtEquityInput"
                                placeholder="Minimum Debt/Equity"
                                defaultValue={0.0}
                                step="0.01"
                                onChange={setMinDebtEquity}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <label htmlFor="maxDebtEquityInput">
                                Max Debt/Equity
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="maxDebtEquityInput"
                                aria-describedby="maxDebtEquityInput"
                                placeholder="Maximum Debt/Equity"
                                defaultValue={2.0}
                                step="0.01"
                                onChange={setMaxDebtEquity}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row pr-3 pl-3">
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <label htmlFor="minPriceToBookInput">
                                Min Price-to-Book
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="minPriceToBookInput"
                                aria-describedby="minPriceToBookInput"
                                placeholder="Minimum Price-to-Book"
                                defaultValue={0.95}
                                step="0.01"
                                onChange={setMinPriceToBook}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <label htmlFor="maxPriceToBookInput">
                                Max Price-to-Book
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="maxPriceToBookInput"
                                aria-describedby="maxPriceToBookInput"
                                placeholder="Maximum Price-to-Book"
                                defaultValue={1.1}
                                step="0.01"
                                onChange={setMaxPriceToBook}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row pr-3 pl-3">
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <label htmlFor="minPriceSalesInput">
                                Min Price-to-Sales
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="minPriceSalesInput"
                                aria-describedby="minPriceSalesInput"
                                placeholder="Minimum Price-to-Sales"
                                defaultValue={0.0}
                                step="0.01"
                                onChange={setMinPriceSales}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <label htmlFor="maxPriceSalesInput">
                                Max Price-to-Sales
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="maxPriceSalesInput"
                                aria-describedby="maxPriceSalesInput"
                                placeholder="Maximum Price-to-Sales"
                                defaultValue={2.0}
                                step="0.01"
                                onChange={setMaxPriceSales}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row pr-3 pl-3">
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <label htmlFor="investmentTypeLookup">
                                Cap Size
                              </label>
                              <select
                                className="form-control"
                                onClick={(event) => {
                                  setMarketCapSize(event);
                                }}
                              >
                                <option value="all" selected>
                                  All
                                </option>
                                <option value="small">Small Cap</option>
                                <option value="mid">Mid Cap</option>
                                <option value="large">Large</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <label htmlFor="investmentTypeLookup">
                                Investment Type
                              </label>
                              <select
                                className="form-control"
                                onClick={(event) => {
                                  selectedInvestmentType(event);
                                }}
                              >
                                <option value="cs" selected>
                                  Common Stock
                                </option>
                                <option value="ad">ADR</option>
                                <option value="gdr">GDR</option>
                                <option value="re">REIT</option>
                                <option value="ce">Closed End Fund</option>
                                <option value="si">Secondary Issue</option>
                                <option value="lp">Limited Partnership</option>
                                <option value="et">ETF</option>
                                <option value="wt">Warrant</option>
                                <option value="rt">Right</option>
                                <option value="oef">Open Ended Fund</option>
                                <option value="cef">Closed Ended Fund</option>
                                <option value="ps">Preferred Stock</option>
                                <option value="ut">Unit</option>
                                <option value="struct">
                                  Structured Product
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 mt-3">
              <div className="row w-100">
                <input
                  type="range"
                  className="form-range w-100"
                  id="customRange1"
                  defaultValue="0"
                  step="5"
                  onChange={(event) => {
                    setMetricVariationPercentage(
                      event.target.value !== 0
                        ? Number(event.target.value) / 100
                        : 0
                    );
                    setMetricVariationMultiple(
                      event.target.value !== 0
                        ? 1 + Number(event.target.value) / 100
                        : 1
                    );
                  }}
                />
              </div>
              <div className="row w-100 justify-content-center">
                <p>
                  <strong>
                    {(metricVariationPercentage.toString() * 100).toFixed(0)}%
                    Variance Range
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
