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
import "./style.css";

import Navbar from "../../components/Navbar/Navbar";
import QuoteCard from "../../components/QuoteCard/QuoteCard";

const Home = () => {
  var [valueSearchData, setValueSearchData] = useState([]);
  var [userID, setUserID] = useState("");
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
  var [currentView, setCurrentView] = useState("valueSearch");
  var [loading, setLoading] = useState(true);
  var [portfolio, setPortfolio] = useState([]);

  const setMarketCapSize = (event) => { };
  const selectedInvestmentType = (event) => { };

  var [loginEmail, setLoginEmail] = useInput("");
  var [loginPassword, setLoginPassword] = useInput("");
  var [submissionMessage, setSubmissionMessage] = useState("");

  var [email, setEmail] = useInput("");
  var [submissionMessage, setSubmissionMessage] = useState("");

  var [firstname, setFirstname] = useState("");
  var [lastname, setLastname] = useState("");
  var [phone, setPhone] = useInput("");
  var [email, setEmail] = useInput("");
  var [emailVerificationToken, setEmailVerficationToken] = useInput("");
  var [password, setPassword] = useInput("");
  var [confirmPassword, setConfirmPassword] = useInput("");
  var [submissionMessage, setSubmissionMessage] = useState("");

  const renderValueSearchResults = () => {
    let selectedMarketCapInput =
      document.getElementById("marketCapSizeInput").value;
    let selectedMarketCapMin = 0;
    let selectedMarketCapMax = 1000000000000000000;
    if (selectedMarketCapInput === "all") {
      selectedMarketCapMin = 0;
      selectedMarketCapMax = 1000000000000000000;
    } else if (selectedMarketCapInput === "small") {
      selectedMarketCapMin = 0;
      selectedMarketCapMax = 1999999999;
    } else if (selectedMarketCapInput === "mid") {
      selectedMarketCapMin = 2000000000;
      selectedMarketCapMax = 99999999999;
    } else if (selectedMarketCapInput === "large") {
      selectedMarketCapMin = 10000000000;
      selectedMarketCapMax = 199999999999;
    } else if (selectedMarketCapInput === "mega") {
      selectedMarketCapMin = 200000000000;
      selectedMarketCapMax = 1000000000000000000;
    }

    let profitabilityParameter =
      document.getElementById("profitableCheckbox").checked;
    let minProfitMargin;
    if (profitabilityParameter === true) {
      minProfitMargin = 0;
    } else {
      minProfitMargin = -100;
    }

    console.log(profitabilityParameter);

    let potentialBottomParameterChecked = document.getElementById(
      "potentialBottomCheckbox"
    ).checked;
    console.log(potentialBottomParameterChecked);

    API.findSearchResults(
      minPE,
      maxPE,
      minDebtEquity,
      maxDebtEquity,
      minPriceSales,
      maxPriceSales,
      minPriceToBook,
      maxPriceToBook,
      selectedMarketCapMin,
      selectedMarketCapMax,
      minProfitMargin,
    ).then((res) => {
      console.log(res.data);
      let tempValueSearchData = [];
      if (potentialBottomParameterChecked === true) {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].valueSearchScore.movingAverageSupport === 1) {
            tempValueSearchData.push(res.data[i])
          }
        }
      } else (
        tempValueSearchData = res.data
      )
      setValueSearchData((valueSearchData) => tempValueSearchData);
      setLoading((loading) => false);
    });
  };

  const renderSearchResults = () => {
    setLoading((loading) => true);
    renderValueSearchResults();
  };

  const findSingleStock = () => {
    let selectedSymbol = document.getElementById("searchSymbol").value;
    if (selectedSymbol !== "") {
      setLoading((loading) => true);
      API.findSingleStock(selectedSymbol.toUpperCase()).then((res) => {
        document.getElementById("searchSymbol").value = "";
        let resultSymbol = res.data[0].symbol;
        let portfolioEntry = portfolio.find((element) => element.symbol === res.data[0].symbol);

        if (resultSymbol !== undefined && portfolioEntry !== undefined) {
          console.log(resultSymbol);
          console.log(portfolioEntry.status);
        }

        setValueSearchData((valueSearchData) => res.data);
        setLoading((loading) => false);
      });
    } else if (selectedSymbol === "") {
      renderSearchResults();
    }
  };

  //START: Account Creation Functions
  const checkEmailAvailability = () => {
    if (email !== "") {
      API.checkExistingAccountEmails(email.toLowerCase()).then((res) => {
        if (res.data !== "") {
          setSubmissionMessage(
            (submissionMessage) =>
              "Looks like an account already exists with this e-mail. Try logging in."
          );
        } else {
          API.setEmailVerificationToken(email).then((res) => { });
        }
      });
    } else {
      setSubmissionMessage(
        (submissionMessage) => "Please enter an email address"
      );
    }
  };

  const createNewAccount = () => {
    let currentAccountInfo = {
      email: email,
      phone: phone,
      firstname: firstname,
      lastname: lastname,
      password: sha256(password),
      sessionAccessToken: null,
      passwordResetToken: null,
    };

    if (
      firstname !== "" &&
      lastname !== "" &&
      email !== "" &&
      password !== "" &&
      emailVerificationToken !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword
    ) {
      setSubmissionMessage((submissionMessage) => "");
      API.checkEmailVerificationToken(email, emailVerificationToken).then(
        (res) => {
          if (res.data !== "") {
            API.checkExistingAccountEmails(currentAccountInfo.email).then(
              (res) => {
                if (res.data === "") {
                  API.createAccount(currentAccountInfo).then((res) => {
                    API.deleteEmailVerificationToken(email).then(
                      (res) => (window.location.href = "/")
                    );
                  });
                } else {
                  setSubmissionMessage(
                    (submissionMessage) =>
                      "Sorry... an account already exists for this email."
                  );
                }
              }
            );
          } else {
            setSubmissionMessage(
              (submissionMessage) =>
                "Hmm... reset code doesn't appear correct for email. Please make sure you've properly entered the email and reset code."
            );
          }
        }
      );
    } else if (password !== confirmPassword) {
      setSubmissionMessage(
        (submissionMessage) =>
          "Password and confirm password fields don't match..."
      );
    } else {
      setSubmissionMessage((submissionMessage) => "Not enough info entered...");
    }
  };
  //END: User Account Creation Functions

  const findPortfolio = (user, selectedStatus) => {
    API.findPortfolio(user).then((res) => {
      if (res.data !== null) {
        setPortfolio((portfolio) => res.data.portfolio);
      }
    });
  };

  const updatePortfolio = (symbol, userID) => {
    let newStatus = document.getElementById(
      symbol + "PortfolioStatusInput"
    ).value;

    let newComment = document.getElementById(
      "new-comment-input-" + symbol
    ).value;

    let newPriceTargetEnabled = document.getElementById(
      "price-target-enabled-" + symbol
    ).checked;

    let newPriceTarget = document.getElementById(
      "price-target-" + symbol
    ).value;

    let newSellTargetEnabled = document.getElementById(
      "sell-target-enabled-" + symbol
    ).checked;

    let newSellTarget = document.getElementById("sell-target-" + symbol).value;

    let tempPortfolio = portfolio;
    let symbolIndex = portfolio.map((object) => object.symbol).indexOf(symbol);
    let currentComments =
      tempPortfolio[symbolIndex] !== undefined &&
        tempPortfolio[symbolIndex].comments !== undefined
        ? tempPortfolio[symbolIndex].comments
        : [];

    let updatedComments = currentComments;
    if (newComment !== "") {
      updatedComments.unshift({ date: new Date(), comment: newComment });
    }

    if (symbolIndex !== -1) {
      tempPortfolio[symbolIndex].status = newStatus;
      tempPortfolio[symbolIndex].comments = updatedComments;
      tempPortfolio[symbolIndex].priceTargetEnabled = newPriceTargetEnabled;
      tempPortfolio[symbolIndex].priceTarget = Number(newPriceTarget);
      tempPortfolio[symbolIndex].sellTargetEnabled = newSellTargetEnabled;
      tempPortfolio[symbolIndex].sellTarget = Number(newSellTarget);
      document.getElementById("new-comment-input-" + symbol).value = "";
    } else {
      tempPortfolio.push({
        symbol: symbol,
        status: newStatus,
        comments: updatedComments,
        priceTargetEnabled: newPriceTargetEnabled,
        priceTarget: Number(newPriceTarget),
        sellTargetEnabled: newSellTargetEnabled,
        sellTarget: Number(newSellTarget),
      });
      document.getElementById("new-comment-input-" + symbol).value = "";
    }
    API.updatePortfolio(userID, tempPortfolio).then((res) => {
      findPortfolio(userID);
    });
  };

  const updateThesis = (symbol, userID) => {
    let newThesis = document.getElementById(
      symbol + "ThesisInput"
    ).value;

    console.log(symbol)
    console.log(newThesis)
    console.log(userID)
    
    /*
    API.updatePortfolio(userID, tempPortfolio).then((res) => {
      findPortfolio(userID, selectedStatus);
    });
    */
  };

  //START: Login functions

  const renderAccountName = () => {
    setUserID((userID) => getCookie("vs_id"));
    API.findUserName(getCookie("vs_id")).then((res) => {
      setFirstname((firstname) => res.data.firstname);
      setLastname((lastname) => res.data.lastname);
      findPortfolio(getCookie("vs_id"));
    });
  };

  const login = () => {
    let cookieExpiryDate = moment().add("24", "hours").format();
    console.log(cookieExpiryDate);

    console.log("Called login");

    if (loginEmail && loginPassword) {
      API.login(loginEmail, sha256(loginPassword)).then((res) => {
        if (res.data) {
          console.log(res.data);
          setSubmissionMessage((submissionMessage) => "");
          document.cookie =
            "auth_expiry=" +
            cookieExpiryDate +
            "; expires=" +
            moment(cookieExpiryDate).format("ddd, DD MMM YYYY HH:mm:ss UTC");
          document.cookie =
            "vs_id=" +
            res.data._id +
            "; expires=" +
            moment(cookieExpiryDate).format("ddd, DD MMM YYYY HH:mm:ss UTC");
          document.cookie =
            "session_access_token=" +
            res.data.sessionAccessToken +
            "; expires=" +
            moment(cookieExpiryDate).format("ddd, DD MMM YYYY HH:mm:ss UTC");
          setUserID((userID) => res.data._id);
          document.location = "/";
          renderAccountName();
        } else {
          setSubmissionMessage(
            (submissionMessage) =>
              "Hmm... this is incorrect. Enter your username and password again."
          );
        }
      });
    } else {
      setSubmissionMessage((submissionMessage) => "Please complete all fields");
    }
  };

  //END: Login functions

  useEffect(() => {
    renderSearchResults();
    renderAccountName();
    topOfPage();
  }, []);

  return (
    <div>
      <Navbar
        firstname={firstname}
        lastname={lastname}
        findSingleStock={findSingleStock}
        logout={logout}
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
                        onChange={setLoginEmail}
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
                        onChange={setLoginPassword}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary standard-button"
                      onClick={login}
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
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  id="profitableCheckbox"
                                  defaultChecked={true}
                                />
                                <label
                                  class="form-check-label"
                                  for="profitableCheckbox"
                                >
                                  Company Profitable
                                </label>
                              </div>
                            </div>

                          </div>
                          <div className="col-md-6 mt-auto mb-auto">
                            <div className="form-group">
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  id="potentialBottomCheckbox"
                                  defaultChecked={true}
                                />
                                <label
                                  class="form-check-label"
                                  for="potentialBottomCheckbox"
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
              {loading ? (
                <div className="row h-100">
                  <BarLoader
                    className="my-auto mx-auto loading-bar"
                    width="100%"
                    height="8px"
                    color={localStorage.getItem("vs-theme") === "dark" ? "#bb86fc":"#880085"}
                  />{" "}
                </div>
              ) : (
                ""
              )}
              <div className="row mb-1 mt-2">
                <div className="col-md-12">
                  {userID !== "" ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary standard-button m-1"
                      onClick={() => (window.location.href = "/portfolio")}
                    >
                      View Portfolio
                    </button>
                  ) : (
                    ""
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary standard-button m-1"
                    onClick={() => {
                      renderSearchResults();
                      setCurrentView((currentView) => "valueSearch");
                    }}
                  >
                    Run Value Search
                  </button>
                </div>
              </div>
              <div className="row">
                {!loading ? (
                  <span>{valueSearchData.length} Results Found</span>
                ) : (
                  ""
                )}
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
              {!loading
                ? valueSearchData.map((stock, i) => (
                  <QuoteCard
                    stock={stock}
                    userID={userID}
                    updatePortfolio={updatePortfolio}
                    updateThesis={updateThesis}
                    portfolio={portfolio}
                    findPortfolio={findPortfolio}
                    page={"Home"}
                  />
                ))
                : ""}
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
