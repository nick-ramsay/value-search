import React, { useState, useEffect } from "react";
import {
  getCookie,
  logout,
  topOfPage,
  topFunction,
} from "../../sharedFunctions/sharedFunctions";
import BarLoader from "react-spinners/BarLoader";
import { useInput } from "../../sharedFunctions/sharedFunctions";
import API from "../../utils/API";
import moment from "moment";
import vsLogo from "../../images/logo-png/logo-no-background.png";
import finvizLogo from "../../images/finviz-logo.png";
import iexCloudLogo from "../../images/iex-cloud-logo.png";
import expandMoreIcon from "../../images/outline_expand_more_white_24dp.png";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import expandLessIcon from "../../images/outline_expand_less_white_24dp.png";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { sha256 } from "js-sha256";
//import "./style.css";

import QuoteCard from "../../components/QuoteCard/QuoteCard";
import NavbarBeta from "../../components/NavbarBeta/Navbar";

const Home = () => {

  let [searchSymbol, setSearchSymbol] = useState("");
  let [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  let [metricVariationPercentage, setMetricVariationPercentage] = useState(0);
  let [metricVariationMultiple, setMetricVariationMultiple] = useState(1);

  const handleChange = (event) => {
    setSearchSymbol(event.target.value);
  };
  
  useEffect(() => {

  }, []);

  return (
    <div>
      <NavbarBeta 
      handleChange={handleChange} 
      searchSymbol={searchSymbol}
      />
      <div className="container">
        <div className="container text-center">
          <div
            className="modal fade"
            id="signInModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="exampleInputEmail1" className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                      />
                      <div id="emailHelp" className="form-text">
                        We'll never share your email with anyone else.
                      </div>
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-sm"
                        id="exampleInputPassword1"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                    >
                      Sign In
                    </button>
                    <div className="row mt-2">
                      <a
                        className="link-primary link-primary-light"
                        href="./create-account-request"
                        data-bs-toggle="modal"
                      >
                        Create Account
                      </a>
                    </div>
                    <div className="row">
                      <a className="link-primary link-primary-light" href="./reset-password-request">
                        Reset Password
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="accordion mt-2" id="accordionExample">
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
                        setAdvancedOptionsOpen((advancedOptionsOpen) => false);
                      }
                  }
                >
                  Value Search Parameters{" "}
                  {advancedOptionsOpen === true ? (
                    <ExpandLessIcon
                      className="text-icon"
                      alt="expandLessIcon"
                    />
                  ) : (
                    <ExpandMoreIcon
                      className="text-icon"
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
                              <label htmlFor="minPEInput">
                                Min Forward PE Ratio
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="minPEInput"
                                aria-describedby="minPEInput"
                                placeholder="Minimum PE Ratio"
                                defaultValue={10}
                              //onChange={Number(setMinPE)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <label htmlFor="maxPEInput">
                                Max Forward PE Ratio
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                id="maxPEInput"
                                aria-describedby="maxPEInput"
                                placeholder="Maximum PE Ratio"
                                defaultValue={15}
                              //onChange={setMaxPE}
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
                                className="form-control form-control-sm"
                                id="minDebtEquityInput"
                                aria-describedby="minDebtEquityInput"
                                placeholder="Minimum Debt/Equity"
                                defaultValue={0.0}
                                step="0.01"
                              //onChange={setMinDebtEquity}
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
                                className="form-control form-control-sm"
                                id="maxDebtEquityInput"
                                aria-describedby="maxDebtEquityInput"
                                placeholder="Maximum Debt/Equity"
                                defaultValue={2.0}
                                step="0.01"
                              //onChange={setMaxDebtEquity}
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
                                className="form-control form-control-sm"
                                id="minPriceToBookInput"
                                aria-describedby="minPriceToBookInput"
                                placeholder="Minimum Price-to-Book"
                                defaultValue={0.95}
                                step="0.01"
                              //onChange={setMinPriceToBook}
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
                                className="form-control form-control-sm"
                                id="maxPriceToBookInput"
                                aria-describedby="maxPriceToBookInput"
                                placeholder="Maximum Price-to-Book"
                                defaultValue={1.1}
                                step="0.01"
                              //onChange={setMaxPriceToBook}
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
                                className="form-control form-control-sm"
                                id="minPriceSalesInput"
                                aria-describedby="minPriceSalesInput"
                                placeholder="Minimum Price-to-Sales"
                                defaultValue={0.0}
                                step="0.01"
                              //onChange={setMinPriceSales}
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
                                className="form-control form-control-sm"
                                id="maxPriceSalesInput"
                                aria-describedby="maxPriceSalesInput"
                                placeholder="Maximum Price-to-Sales"
                                defaultValue={2.0}
                                step="0.01"
                              //onChange={setMaxPriceSales}
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
                                id="marketCapSizeInput"
                                className="form-control"
                                /*onClick={(event) => {
                                  setMarketCapSize(event);
                                }}*/
                                defaultValue="all"
                              >
                                <option value="all">All</option>
                                <option value="small">Small Cap</option>
                                <option value="mid">Mid Cap</option>
                                <option value="large">Large</option>
                                <option value="mega">Mega</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <label htmlFor="investmentTypeLookup">
                                Investment Type
                              </label>
                              <select
                                id="selectedInvestmentTypeInput"
                                className="form-control"
                              /*onClick={(event) => {
                            selectedInvestmentType(event);
                          }}
                          */
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
                                <option value="struct">Structured Product</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="row pr-3 pl-3">
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="profitableCheckbox"
                                  defaultChecked={true}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="profitableCheckbox"
                                >
                                  Company Profitable
                                </label>
                              </div>
                            </div>

                          </div>
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="potentialBottomCheckbox"
                                  defaultChecked={true}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="potentialBottomCheckbox"
                                >
                                  Potential Bottom
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 mt-3 mb-0 d-none">
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
              <div className="row w-100 justify-content-center mb-1">
                <span style={{ fontSize: 14 }}>
                  <strong>
                    {(metricVariationPercentage.toString() * 100).toFixed(0)}%
                    Variance Range
                  </strong>
                </span>
              </div>
            </div>
            <div className="col-md-12">
              <div className="row mb-1 mt-2">
                <div className="col-md-12">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary m-1"
                    onClick={() => (window.location.href = "/portfolio-beta")}
                  >
                    View Portfolio
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary m-1"
                  >
                    Run Value Search
                  </button>
                </div>
              </div>
              <div className="row mb-2 mt-1">
                <span style={{ fontSize: 10 }}>
                  All data sourced from{" "}
                  <a href="https://www.iexcloud.io/" target="_blank">
                    <img style={{ height: 11 }} src={iexCloudLogo} />
                  </a>{" "}
                  and{" "}
                  <a href="https://finviz.com/" target="_blank">
                    {" "}
                    <img style={{ height: 8 }} src={finvizLogo} />
                  </a>
                </span>
              </div>
              <button
                onClick={() => topFunction()}
                className="btn btn btn-danger"
                id="top-button"
                title="Go to top"
              >
                Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
