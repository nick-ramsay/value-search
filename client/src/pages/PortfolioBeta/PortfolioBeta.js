import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import PuffLoader from "react-spinners/PuffLoader";
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
import expandLessIcon from "../../images/outline_expand_less_white_24dp.png";
import analyticsIcon from "../../images/outline_analytics_white_24dp.png";
import { sha256 } from "js-sha256";
import "./style.css";

import QuoteCard from "../../components/QuoteCard/QuoteCard";
ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioBeta = () => {
  var [valueSearchData, setValueSearchData] = useState([]);
  var [userID, setUserID] = useState("");
  var [accountID, setAccountID] = useState("");
  var [loading, setLoading] = useState(true);
  var [portfolio, setPortfolio] = useState([]);

  var [loginEmail, setLoginEmail] = useInput("");
  var [loginPassword, setLoginPassword] = useInput("");
  var [submissionMessage, setSubmissionMessage] = useState("");

  var [email, setEmail] = useInput("");
  var [submissionMessage, setSubmissionMessage] = useState("");

  var [firstname, setFirstname] = useState("");
  var [lastname, setLastname] = useState("");

  var [submissionMessage, setSubmissionMessage] = useState("");
  var [portfolio, setPortfolio] = useState([]);
  var [industriesData, setIndustriesData] = useState({
    datasets: [{ label: [], data: [] }],
  });
  var [sectorsData, setSectorsData] = useState({
    datasets: [{ label: [], data: [] }],
  });

  var [selectedStatus, setSelectedStatus] = useState("watch");
  var [watchOnlyPriceTargets, setWatchOnlyPriceTargets] = useState(false);
  var [watchOnlyPriceTargetsMet, setWatchOnlyPriceTargetsMet] = useState(false);
  var [sellTargetMet, setSellTargetMet] = useState(false);
  var [portfolioStatusCounts, setPortfolioStatusCounts] = useState({});

  const findSingleStock = () => {
    let selectedSymbol = document.getElementById("searchSymbol").value;
    if (selectedSymbol !== "") {
      setLoading((loading) => true);
      API.findSingleStock(selectedSymbol.toUpperCase()).then((res) => {
        document.getElementById("searchSymbol").value = "";
        setValueSearchData((valueSearchData) => res.data);
        setLoading((loading) => true);
      });
    }
  };

  const findPortfolio = (account_id, selectedStatus) => {
    API.getPortfolio(account_id).then((res) => {
      console.log(res.data);
      setLoading(loading => false)
    });
  };

  const renderAnalytics = (portfolioData) => {

  };

  const updatePortfolio = (symbol, userID) => {

  };

  //START: Login functions

  const renderAccountName = () => {
    API.getAccountID(getCookie("session_access_token")).then((res) => {
      setAccountID(accountID, setAccountID(res.data._id));
      setFirstname((firstname) => res.data.firstname);
      setLastname((lastname) => res.data.lastname);
      findPortfolio(res.data._id, selectedStatus);
    });

  };

  const login = () => {
    let cookieExpiryDate = moment().add("24", "hours").format();

    if (loginEmail && loginPassword) {
      API.login(loginEmail, sha256(loginPassword)).then((res) => {
        if (res.data) {
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

  const renderValueSearchResults = (symbols, selectedStatus) => {

  };

  const syncWithEtrade = () => {

  };

  useEffect(() => {
    renderAccountName();
    topOfPage();
  }, []);

  return (
    <div className="container">
      <nav className="navbar navbar-dark navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src={vsLogo} className="navbar-logo" />
          </a>
          <button
            className="navbar-toggler mb-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
              <form className="d-flex" role="search">
                <input
                  id="searchSymbol"
                  className="form-control form-control-sm me-2"
                  type="search"
                  placeholder="Ticker Symbol"
                  defaultValue={""}
                  aria-label="Search"
                />
                <button
                  className="btn btn-sm btn-outline-primary"
                  type="button"
                  onClick={findSingleStock}
                >
                  Search
                </button>
              </form>
            </ul>
            <ul className="navbar-nav ml-auto mb-2 mb-lg-0 text-center">
              {getCookie("vs_id") !== "" && getCookie("vs_id") !== undefined ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {firstname + " " + lastname}
                  </a>
                  <ul className="dropdown-menu text-center bg-dark">
                    <li>
                      <button
                        type="button"
                        className="btn btn-sm m-2 btn-outline-danger text-center"
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm m-2 btn-outline-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#signInModal"
                >
                  Sign In
                </button>
              )}
            </ul>
          </div>
        </div>
      </nav>
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
                    className="btn btn-sm btn-primary"
                    onClick={login}
                  >
                    Sign In
                  </button>
                  <div className="row mt-2">
                    <a
                      className="link-primary"
                      href="./create-account-request"
                      data-bs-toggle="modal"
                    >
                      Create Account
                    </a>
                  </div>
                  <div className="row">
                    <a className="link-primary" href="./reset-password-request">
                      Reset Password
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div className="mb-3">
              <div className={"portfolio-body"}>

                <div className="row">
                  <div className="col-md-12 mt-2">
                    <button
                      type="button"
                      className={
                        selectedStatus === "icebox"
                          ? loading === false ? "btn btn-sm btn-light status-button m-1" : "btn btn-sm btn-light status-button m-1 disabled"
                          : loading === false ? "btn btn-sm btn-outline-light status-button m-1" : "btn btn-sm btn-outline-light status-button m-1 disabled"
                      }
                      onClick={() => {
                        if (loading === false) {
                          findPortfolio(userID, "icebox");
                          setSelectedStatus((selectedStatus) => "icebox");
                          setLoading((loading) => true);
                        }
                      }}
                    >
                      Icebox
                    </button>
                    <button
                      type="button"
                      className={
                        selectedStatus === "watch"
                          ? loading === false ? "btn btn-sm btn-light status-button m-1" : "btn btn-sm btn-light status-button m-1 disabled"
                          : loading === false ? "btn btn-sm btn-outline-light status-button m-1" : "btn btn-sm btn-outline-light status-button m-1 disabled"
                      }
                      onClick={() => {
                        if (loading === false) {
                          findPortfolio(userID, "watch");
                          setSelectedStatus((selectedStatus) => "watch");
                          setLoading((loading) => true);
                        }
                      }}
                    >
                      Watch
                    </button>
                    <button
                      type="button"
                      className={
                        selectedStatus === "own"
                          ? loading === false ? "btn btn-sm btn-light status-button m-1" : "btn btn-sm btn-light status-button m-1 disabled"
                          : loading === false ? "btn btn-sm btn-outline-light status-button m-1" : "btn btn-sm btn-outline-light status-button m-1 disabled"
                      }
                      onClick={() => {
                        if (loading === false) {
                          findPortfolio(userID, "own");
                          setSelectedStatus((selectedStatus) => "own");
                          setLoading((loading) => true);
                        }
                      }}
                    >
                      {"Own (" + (portfolioStatusCounts.own != undefined ? portfolioStatusCounts.own : "-") + ")"}
                    </button>
                    <button
                      type="button"
                      className={
                        selectedStatus === "hold"
                          ? loading === false ? "btn btn-sm btn-light status-button m-1" : "btn btn-sm btn-light status-button m-1 disabled"
                          : loading === false ? "btn btn-sm btn-outline-light status-button m-1" : "btn btn-sm btn-outline-light status-button m-1 disabled"
                      }
                      onClick={() => {
                        if (loading === false) {
                          findPortfolio(userID, "hold");
                          setSelectedStatus((selectedStatus) => "hold");
                          setLoading((loading) => true);
                        }
                      }}
                    >
                      {"Hold (" + (portfolioStatusCounts.hold != undefined ? portfolioStatusCounts.hold : "-") + ")"}
                    </button>
                    <button
                      type="button"
                      className={
                        selectedStatus === "speculative"
                          ? loading === false ? "btn btn-sm btn-light status-button m-1" : "btn btn-sm btn-light status-button m-1 disabled"
                          : loading === false ? "btn btn-sm btn-outline-light status-button m-1" : "btn btn-sm btn-outline-light status-button m-1 disabled"
                      }
                      onClick={() => {
                        if (loading === false) {
                          findPortfolio(userID, "speculative");
                          setSelectedStatus((selectedStatus) => "speculative");
                          setLoading((loading) => true);
                        }
                      }}
                    >
                      {"Speculative (" +
                        (portfolioStatusCounts.speculative != undefined ? portfolioStatusCounts.speculative : "-") +
                        ")"}
                    </button>
                    <img
                      id="portfolioAnalytics"
                      className="medium-icon pointer-hover"
                      src={analyticsIcon}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#analyticsAccordion"
                      aria-expanded="true"
                      aria-controls="analyticsAccordion"
                    ></img>
                  </div>
                </div>
                <div className="row mb-2">
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
                <div className="accordion-flush" id="accordionFlushExample">
                  <div className="col-md-12 text-center">
                    <div className=" text-center">
                      <a
                        className="text-center collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne"
                        aria-expanded="false"
                        aria-controls="flush-collapseOne"
                        style={{ fontSize: 12 }}
                      >
                        Upload CSV from Etrade
                      </a>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <div
                      id="flush-collapseOne"
                      className="accordion-collapse collapse"
                      aria-labelledby="flush-headingOne"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="accordion-body">
                        <input
                          className="form-control"
                          type="file"
                          id="etradeCSVSelect"
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button
                            className="btn btn-sm btn-outline-primary mt-2 mb-1"
                            onClick={() => syncWithEtrade()}
                          >
                            Sync Portfolio with Etrade
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="analyticsAccordion"
            className="accordion-collapse collapse mb-2"
            data-bs-parent="#portfolioAnalytics"
          >
            <div className="accordion-body">
              <h6>
                <strong>Portfolio Analysis</strong>
              </h6>
              <div
                id="analyticsCarouselControls"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <div className="col-md-12">
                      <Doughnut
                        width={30}
                        height={30}
                        options={{ maintainAspectRatio: false }}
                        data={industriesData}
                      />
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="col-md-12">
                      <Doughnut
                        width={30}
                        height={30}
                        options={{ maintainAspectRatio: false }}
                        data={sectorsData}
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#analyticsCarouselControls"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#analyticsCarouselControls"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
          {selectedStatus === "watch" ?
            <div className="row">
              <div className="col-md-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultChecked={watchOnlyPriceTargets} checked={watchOnlyPriceTargets} id="watchOnlyPriceTargetsTickbox" onClick={() => {
                    let currentlyChecked = document.getElementById("watchOnlyPriceTargetsTickbox").checked;
                    watchOnlyPriceTargetsMet === true && watchOnlyPriceTargetsMet === true ? setWatchOnlyPriceTargetsMet(watchOnlyPriceTargetsMet => currentlyChecked) : setWatchOnlyPriceTargetsMet(watchOnlyPriceTargetsMet => false);
                    setWatchOnlyPriceTargets(watchOnlyPriceTargets => currentlyChecked);
                  }} />
                  <label className="form-check-label" htmlFor="watchOnlyPriceTargetsTickbox">
                    Price Target Set
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultChecked={watchOnlyPriceTargetsMet} checked={watchOnlyPriceTargetsMet} id="watchOnlyPriceTargetsMetTickbox" onClick={() => {
                    let currentlyChecked = document.getElementById("watchOnlyPriceTargetsMetTickbox").checked;
                    watchOnlyPriceTargets === false ? setWatchOnlyPriceTargets(watchOnlyPriceTargets => currentlyChecked) : setWatchOnlyPriceTargets(watchOnlyPriceTargets => true);;
                    setWatchOnlyPriceTargetsMet(watchOnlyPriceTargetsMet => currentlyChecked);
                  }} />
                  <label className="form-check-label" htmlFor="watchOnlyPriceTargetsTickbox">
                    Price Target Met
                  </label>
                </div>
              </div>
            </div>
            : ""}
          {selectedStatus === "own" ?
            <div className="row">
              <div className="col-md-12">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultChecked={sellTargetMet} checked={sellTargetMet} id="sellTargetMetTickbox" onClick={() => {
                    let currentlyChecked = document.getElementById("sellTargetMetTickbox").checked;
                    console.log(sellTargetMet);
                    sellTargetMet === true && sellTargetMet === true ? setSellTargetMet(sellTargetMet => currentlyChecked) : setSellTargetMet(sellTargetMet => false);
                    setSellTargetMet(sellTargetMet => currentlyChecked);
                  }} />
                  <label className="form-check-label" htmlFor="sellTargetMetTickbox">
                    Sell Target Met
                  </label>
                </div>
              </div>
            </div>
            : ""}
          {!loading
            ? valueSearchData.map((stock, i) => (
              selectedStatus === "watch"
                && watchOnlyPriceTargets === true
                && portfolio[portfolio.findIndex((portfolio) => portfolio.symbol === stock.symbol)].priceTargetEnabled === true
                && portfolio[portfolio.findIndex((portfolio) => portfolio.symbol === stock.symbol)].priceTarget !== undefined
                && portfolio[portfolio.findIndex((portfolio) => portfolio.symbol === stock.symbol)].priceTarget >= 0
                && (watchOnlyPriceTargetsMet === true ? portfolio[portfolio.findIndex((portfolio) => portfolio.symbol === stock.symbol)].priceTarget >= stock.quote.latestPrice : true)
                ?
                <QuoteCard
                  stock={stock}
                  userID={userID}
                  updatePortfolio={updatePortfolio}
                  portfolio={portfolio}
                  selectedStatus={selectedStatus}
                  findPortfolio={findPortfolio}
                  watchOnlyPriceTargets={watchOnlyPriceTargets}
                  page={"Portfolio"}
                />
                : selectedStatus === "own"
                  && portfolio[portfolio.findIndex((portfolio) => portfolio.symbol === stock.symbol)].sellTargetEnabled === true
                  && portfolio[portfolio.findIndex((portfolio) => portfolio.symbol === stock.symbol)].sellTarget !== undefined
                  && portfolio[portfolio.findIndex((portfolio) => portfolio.symbol === stock.symbol)].sellTarget >= 0
                  && (sellTargetMet === true ? portfolio[portfolio.findIndex((portfolio) => portfolio.symbol === stock.symbol)].sellTarget <= stock.quote.latestPrice : true) ?
                  < QuoteCard
                    stock={stock}
                    userID={userID}
                    updatePortfolio={updatePortfolio}
                    portfolio={portfolio}
                    selectedStatus={selectedStatus}
                    findPortfolio={findPortfolio}
                    watchOnlyPriceTargets={watchOnlyPriceTargets}
                    page={"Portfolio"}
                  /> :
                  (watchOnlyPriceTargets === false && selectedStatus === "watch") || ["hold", "speculative", "icebox"].indexOf(selectedStatus) !== -1 ? <QuoteCard
                    stock={stock}
                    userID={userID}
                    updatePortfolio={updatePortfolio}
                    portfolio={portfolio}
                    selectedStatus={selectedStatus}
                    findPortfolio={findPortfolio}
                    page={"Portfolio"}
                  /> : ""
            ))
            : ""}
          <div
            id="portfolio-loading"
            className={
              loading === false
                ? "d-none d-flex justify-content-center align-items-center align-middle mt-3"
                : "d-flex justify-content-center mt-3"
            }
          >
            <PuffLoader color="#bb86fc" size="200px" />
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
  );
};

export default PortfolioBeta;
