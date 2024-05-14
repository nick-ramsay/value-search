import React, { useState, useEffect } from "react";
import { getCookie, logout, topOfPage, topFunction } from "../../sharedFunctions/sharedFunctions";
import BarLoader from "react-spinners/BarLoader";
import { useInput } from "../../sharedFunctions/sharedFunctions";
import API from "../../utils/API";
import moment from "moment";
import vsLogo from "../../images/logo-png/logo-no-background.png";
import expandMoreIcon from "../../images/outline_expand_more_white_24dp.png";
import expandLessIcon from "../../images/outline_expand_less_white_24dp.png";
import { sha256 } from "js-sha256";
import "./style.css";

import QuoteCard from "../../components/QuoteCard/QuoteCard";

const ScoreSearch = () => {
  var [valueSearchData, setValueSearchData] = useState([]);
  var [userID, setUserID] = useState("");
  var [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  var [metricVariationMultiple, setMetricVariationMultiple] = useState(0);
  var [metricVariationPercentage, setMetricVariationPercentage] = useState(0);
  var [loading, setLoading] = useState(true);
  var [portfolio, setPortfolio] = useState([]);

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
    let maSupportParameter = document.getElementById("maSupportCheckbox").checked;

    API.findScoreSearchResults(
      maSupportParameter
    ).then((res) => {
      setValueSearchData((valueSearchData) => res.data);
      setLoading((loading) => false);
    });

    setLoading((loading) => false)
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
          API.setEmailVerificationToken(email).then((res) => {
          });
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

    let newQueuedForPurchase = document.getElementById(
      "queued-for-purchase-" + symbol
    ).checked;

    let newPriceTargetEnabled = document.getElementById(
      "price-target-enabled-" + symbol
    ).checked;

    let newPriceTarget = document.getElementById(
      "price-target-" + symbol
    ).value;

    let newSellTargetEnabled = document.getElementById(
      "sell-target-enabled-" + symbol
    ).checked;

    let newSellTarget = document.getElementById(
      "sell-target-" + symbol
    ).value;

    let tempPortfolio = portfolio;
    let symbolIndex = portfolio.map((object) => object.symbol).indexOf(symbol);
    let currentComments =
      tempPortfolio[symbolIndex] !== undefined && tempPortfolio[symbolIndex].comments !== undefined
        ? tempPortfolio[symbolIndex].comments
        : [];

    let updatedComments = currentComments;
    if (newComment !== "") {
      updatedComments.unshift({ date: new Date(), comment: newComment });
    }

    if (symbolIndex !== -1) {
      tempPortfolio[symbolIndex].status = newStatus;
      tempPortfolio[symbolIndex].comments = updatedComments;
      tempPortfolio[symbolIndex].queuedForPurchase = newQueuedForPurchase;
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
        queuedForPurchase: newQueuedForPurchase,
        priceTargetEnabled: newPriceTargetEnabled,
        priceTarget: Number(newPriceTarget),
        sellTargetEnabled: newSellTargetEnabled,
        sellTarget: Number(newSellTarget)
      });
      document.getElementById("new-comment-input-" + symbol).value = "";
    }
    API.updatePortfolio(userID, tempPortfolio).then((res) => {
      findPortfolio(userID);
    });
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
    let cookieExpiryDate = moment().add("60", "minutes").format();

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

  useEffect(() => {
    renderSearchResults();
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
                      setAdvancedOptionsOpen((advancedOptionsOpen) => false);
                    }
                }
              >
                Score Search Parameters{" "}
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
                      <div className="row">
                        <div className="col-md-6 mt-auto mb-auto">
                          <div className="form-group">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" id="maSupportCheckbox" defaultChecked="true" />
                              <label className="form-check-label" htmlFor="maSupportCheckbox">
                                M/A Bottom Found
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
            {loading ? (
              <div className="row h-100">
                <BarLoader
                  className="my-auto mx-auto"
                  width="100%"
                  height="8px"
                  color="#007bff"
                />{" "}
              </div>
            ) : (
              ""
            )}
            {!loading ? <p>{valueSearchData.length} Results Found</p> : ""}
            <div className="row mb-1">
              <div className="col-md-12">
                {userID !== "" ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary m-1"
                    onClick={() => (window.location.href = "/portfolio")}
                  >
                    View Portfolio
                  </button>
                ) : (
                  ""
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary m-1"
                  onClick={() => {
                    renderSearchResults();
                  }}
                >
                  Run Score Search
                </button>
              </div>
            </div>
            {!loading
              ? valueSearchData.map((stock, i) => (
                <QuoteCard
                  stock={stock}
                  userID={userID}
                  updatePortfolio={updatePortfolio}
                  portfolio={portfolio}
                  findPortfolio={findPortfolio}
                  page={"ScoreSearch"}
                />
              ))
              : ""}
            <button onClick={() => topFunction()} className="btn btn btn-danger" id="top-button" title="Go to top">Top</button>
          </div>
        </div>
      </div >
    </div >
  );
};

export default ScoreSearch;
