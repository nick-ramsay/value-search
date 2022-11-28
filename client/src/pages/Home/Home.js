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
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Value Search</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item mt-auto">
                <form className="d-flex pt-1" role="search">
                  <input id="searchSymbol" aria-describedby="searchSymbol" className="form-control form-control-sm mr-sm-2" type="text" placeholder="Ticker Symbol" defaultValue={""} onChange={setSearchSymbol} aria-label="Search" />
                  <button type="button" className="btn btn-sm btn-outline-primary my-2 my-sm-0" onClick={findSingleStock}>Search</button>
                </form>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item mt-auto">
                <form className="d-flex pt-1" role="search">
                  <button type="button" className="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#signInModal">
                    Sign In
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container text-center">
        <div className="modal fade" id="signInModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control form-control-sm" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                  </div>
                  <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control form-control-sm" id="exampleInputPassword1" />
                  </div>
                  <button type="submit" className="btn btn-sm btn-primary">Sign In</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="accordion" id="accordionExample">
            <div>
              <a
                className="text-center"
                href="#"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
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
                        <a href={"https://finviz.com/quote.ashx?t=" + stock.symbol + "&ty=l&ta=0&p=m&tas=0"} target="_blank">{stock.quote.companyName + " (" + stock.symbol + ")"}</a>
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
