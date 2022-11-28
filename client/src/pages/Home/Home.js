import React, { useState, useEffect } from "react";
import BarLoader from "react-spinners/BarLoader";
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
  var [minPE, setMinPE] = useInput(5);
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
  var [searchSymbol, setSearchSymbol] = useInput("")
  var [currentView, setCurrentView] = useState("valueSearch")
  var [loading, setLoading] = useState(true);

  const setMarketCapSize = (event) => { };
  const selectedInvestmentType = (event) => { };

  const renderValueSearchResults = () => {
    API.findSearchResults(minPE, maxPE, minDebtEquity, maxDebtEquity, minPriceSales, maxPriceSales, minPriceToBook, maxPriceToBook, minCap, maxCap).then(res => { setValueSearchData(valueSearchData => res.data); setLoading(loading => false) });
  };

  const renderSearchResults = () => {
    setLoading(loading => true);
    renderValueSearchResults()
  }

  const findSingleStock = () => {
    console.log("Current Symbol: " + searchSymbol);
    if (searchSymbol !== "") {
      setLoading(loading => true);
      API.findSingleStock(searchSymbol.toUpperCase()).then(res => { setValueSearchData(valueSearchData => res.data); setLoading(loading => false); });
    };
  };

  useEffect(() => {
    renderSearchResults();
  }, []);

  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Value Search</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto">
              <li className="nav-item mt-auto">
                <form class="d-flex pt-1" role="search">
                  <input id="searchSymbol" aria-describedby="searchSymbol" class="form-control mr-sm-2" type="text" placeholder="Ticker Symbol" defaultValue={""} onChange={setSearchSymbol} aria-label="Search" />
                  <button type="button" class="btn btn-outline-primary my-2 my-sm-0" onClick={findSingleStock}>Search</button>
                </form>
              </li>
              <li className="nav-item ml-2 pt-2">
                <form action="http://value-search.herokuapp.com/auth/google">
                  <button type="submit" className="google-button">
                    <span className="google-button__icon">
                      <svg viewBox="0 0 366 372" xmlns="http://www.w3.org/2000/svg"><path d="M125.9 10.2c40.2-13.9 85.3-13.6 125.3 1.1 22.2 8.2 42.5 21 59.9 37.1-5.8 6.3-12.1 12.2-18.1 18.3l-34.2 34.2c-11.3-10.8-25.1-19-40.1-23.6-17.6-5.3-36.6-6.1-54.6-2.2-21 4.5-40.5 15.5-55.6 30.9-12.2 12.3-21.4 27.5-27 43.9-20.3-15.8-40.6-31.5-61-47.3 21.5-43 60.1-76.9 105.4-92.4z" id="Shape" fill="#EA4335" /><path d="M20.6 102.4c20.3 15.8 40.6 31.5 61 47.3-8 23.3-8 49.2 0 72.4-20.3 15.8-40.6 31.6-60.9 47.3C1.9 232.7-3.8 189.6 4.4 149.2c3.3-16.2 8.7-32 16.2-46.8z" id="Shape" fill="#FBBC05" /><path d="M361.7 151.1c5.8 32.7 4.5 66.8-4.7 98.8-8.5 29.3-24.6 56.5-47.1 77.2l-59.1-45.9c19.5-13.1 33.3-34.3 37.2-57.5H186.6c.1-24.2.1-48.4.1-72.6h175z" id="Shape" fill="#4285F4" /><path d="M81.4 222.2c7.8 22.9 22.8 43.2 42.6 57.1 12.4 8.7 26.6 14.9 41.4 17.9 14.6 3 29.7 2.6 44.4.1 14.6-2.6 28.7-7.9 41-16.2l59.1 45.9c-21.3 19.7-48 33.1-76.2 39.6-31.2 7.1-64.2 7.3-95.2-1-24.6-6.5-47.7-18.2-67.6-34.1-20.9-16.6-38.3-38-50.4-62 20.3-15.7 40.6-31.5 60.9-47.3z" fill="#34A853" /></svg>
                    </span>
                    <span className="google-button__text">Sign In</span>
                  </button>
                </form>
              </li>


            </ul>
          </div>
        </div>
      </nav>
      <div className="container text-center">
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
                Value Search Parameters {" "}
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
                              onChange={Number(setMinPE)}
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
          <div className="col-md-12">
            {loading ?
              <div className="row h-100">
                <BarLoader className="my-auto mx-auto" width="100%" height="8px" color="#007bff" /> </div> : ""

            }
            {!loading ?
              <p>{valueSearchData.length} Results Found</p> : ""
            }
            <div className="row mb-1">
              <div className="col-md-12">
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => { renderSearchResults(); setCurrentView(currentView => "valueSearch") }}>Run Value Search</button>
              </div>
            </div>
            {!loading ?
              valueSearchData.map((stock, i) =>
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title row">
                      <div className="col-md-12">
                        <a  href={"https://finviz.com/quote.ashx?t=" + stock.symbol + "&ty=l&ta=0&p=m&tas=0"} target="_blank">{stock.quote.companyName + " (" + stock.symbol + ")"}</a>
                      </div>
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
              : ""
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
