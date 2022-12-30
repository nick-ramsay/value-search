import React, { useState, useEffect } from "react";
import { getCookie, logout } from "../../sharedFunctions/sharedFunctions";
import BarLoader from "react-spinners/BarLoader";
import { useInput } from "../../sharedFunctions/sharedFunctions";
import API from "../../utils/API";
import moment from "moment";
import expandMoreIcon from "../../images/outline_expand_more_white_24dp.png";
import expandLessIcon from "../../images/outline_expand_less_white_24dp.png";
import { sha256 } from "js-sha256";
import "./style.css";

import QuoteCard from "../../components/QuoteCard/QuoteCard";

const Portfolio = () => {
  var [valueSearchData, setValueSearchData] = useState([]);
  var [userID, setUserID] = useState("");
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
  var [portfolio, setPortfolio] = useState([]);

  var [selectedStatus, setSelectedStatus] = useState("watch");

  const findSingleStock = () => {
    let selectedSymbol = document.getElementById("searchSymbol").value;
    if (selectedSymbol !== "") {
      setLoading((loading) => true);
      API.findSingleStock(selectedSymbol.toUpperCase()).then((res) => {
        document.getElementById("searchSymbol").value = "";
        setValueSearchData((valueSearchData) => res.data);
        setLoading((loading) => false);
      });
    }
  };

  //START: Account Creation Functions
  const checkEmailAvailability = () => {
    if (email !== "") {
      API.checkExistingAccountEmails(email.toLowerCase()).then((res) => {
        console.log("Check Existing: " + res);
        if (res.data !== "") {
          setSubmissionMessage(
            (submissionMessage) =>
              "Looks like an account already exists with this e-mail. Try logging in."
          );
        } else {
          API.setEmailVerificationToken(email).then((res) => {
            console.log(res.data);
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
            console.log(res.data);
            API.checkExistingAccountEmails(currentAccountInfo.email).then(
              (res) => {
                console.log("Matching Emails at Creation??? -> " + res.data);
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
    let symbolList = [];
    API.findPortfolio(user, selectedStatus).then((res) => {
      if (res.data !== null) {
        setPortfolio((portfolio) => res.data.portfolio);
        for (let i = 0; i < res.data.portfolio.length; i++) {
          if (
            res.data.portfolio[i].status !== "-" &&
            res.data.portfolio[i].status === selectedStatus
          ) {
            symbolList.push(res.data.portfolio[i].symbol);
          }
        }
        renderValueSearchResults(symbolList, selectedStatus);
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
    let tempPortfolio = portfolio;
    let symbolIndex = portfolio.map((object) => object.symbol).indexOf(symbol);
    let currentComments =
      tempPortfolio[symbolIndex].comments !== undefined
        ? tempPortfolio[symbolIndex].comments
        : [];

    let updatedComments = currentComments;
    if (newComment !== "") {
      updatedComments.unshift({ date: new Date(), comment: newComment });
    }

    console.log(currentComments);
    console.log(updatedComments);
    console.log(newComment);

    if (symbolIndex !== -1) {
      tempPortfolio[symbolIndex].status = newStatus;
      tempPortfolio[symbolIndex].comments = updatedComments;
      document.getElementById("new-comment-input-" + symbol).value = "";
    } else {
      tempPortfolio.push({
        symbol: symbol,
        status: newStatus,
        comments: updatedComments,
      });
      document.getElementById("new-comment-input-" + symbol).value = "";
    }
    API.updatePortfolio(userID, tempPortfolio).then((res) => {
      console.log(res.data);
      console.log(userID);
      findPortfolio(userID, selectedStatus);
    });
  };

  //START: Login functions

  const renderAccountName = () => {
    setUserID((userID) => getCookie("vs_id"));
    API.findUserName(getCookie("vs_id")).then((res) => {
      setFirstname((firstname) => res.data.firstname);
      setLastname((lastname) => res.data.lastname);
      findPortfolio(getCookie("vs_id"), selectedStatus);
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

  const renderValueSearchResults = (symbols, selectedStatus) => {
    API.findPortfolioQuotes(symbols, selectedStatus).then((res) => {
      console.log(res.data);
      setValueSearchData((valueSearchData) => res.data);
      setLoading((loading) => false);
    });
  };

  const syncWithEtrade = () => {
    console.log("Called Sync with Etrade");

    //let filePath = document.getElementById("etradeCSVSelect").value;
    //console.log(filePath);

    var file = document.querySelector("#etradeCSVSelect").files[0];
    console.log(file);
    var reader = new FileReader();
    reader.readAsText(file);

    //if you need to read a csv file with a 'ISO-8859-1' encoding
    /*reader.readAsText(file,'ISO-8859-1');*/

    //When the file finish load
    reader.onload = function (event) {
      //get the file.
      var csv = event.target.result;

      //split and get the rows in an array
      var cols;
      var rows = csv.split("\n");

      var symbolCount = 0;
      var etradeSymbols = [];

      //move line by line
      for (var i = 1; i < rows.length; i++) {
        //split by separator (,) and get the columns
        cols = rows[i].split(",");

        //move column by column
        for (var j = 0; j < 1; j++) {
          /*the value of the current column.
          Do whatever you want with the value*/
          var value = cols[j];
          if (value === "Symbol" && symbolCount <= 2) {
            symbolCount += 1;
          } else if (
            value !== "Symbol" &&
            value !== "\r" &&
            value.slice(0, 9) !== "Generated" &&
            symbolCount === 2
          ) {
            etradeSymbols.push(value);
          }
        }
      }
      etradeSymbols.splice(etradeSymbols.length - 2, 2);
      API.syncPortfolioWithEtrade(etradeSymbols, "own").then((res) =>
        console.log(res.data)
      );
      let tempPortfolio = portfolio;
      for (let i = 0; i < etradeSymbols.length; i++) {
        if (
          portfolio.map((object) => object.symbol).indexOf(etradeSymbols[i]) ===
          -1
        ) {
          tempPortfolio.push({
            symbol: etradeSymbols[i],
            status: "own",
          });
        }
      }
      //If symbol is in portfolio and NOT in etrade, set symbol to "watch" status
      for (let j = 0; j < tempPortfolio.length; j++) {
        if (
          etradeSymbols.indexOf(tempPortfolio[j].symbol) === -1 &&
          (tempPortfolio[j].status === "own" ||
            tempPortfolio[j].status === "hold" ||
            tempPortfolio[j].status === "speculative")
        ) {
          console.log(tempPortfolio[j].symbol);
          tempPortfolio[j].status = "watch";
        }
      }
      API.updatePortfolio(userID, tempPortfolio).then((res) => {
        findPortfolio(userID);
      });
    };
  };

  useEffect(() => {
    renderAccountName();
  }, []);

  return (
    <div className="container">
      <nav class="navbar navbar-dark navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            Value Search
          </a>
          <button
            class="navbar-toggler mb-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto mb-2 mb-lg-0">
            <form class="d-flex" role="search">
              <input
                id="searchSymbol"
                class="form-control form-control-sm me-2"
                type="search"
                placeholder="Ticker Symbol"
                defaultValue={""}
                aria-label="Search"
              />
              <button
                class="btn btn-sm btn-outline-primary"
                type="button"
                onClick={findSingleStock}
              >
                Search
              </button>
            </form>
            </ul>
            <ul class="navbar-nav ml-auto mb-2 mb-lg-0 text-center">
              {getCookie("vs_id") !== "" && getCookie("vs_id") !== undefined ? (
                <li class="nav-item dropdown">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {firstname + " " + lastname}
                  </a>
                  <ul class="dropdown-menu text-center bg-dark">
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
            <div class="mb-3">

              <div class=" accordion-flush" id="accordionFlushExample">
                <div className="col-md-12 text-center">
                  <div className=" text-center">

                    <a
                      class="text-center collapsed"
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
                <div class="accordion-item">
                  <div
                    id="flush-collapseOne"
                    class="accordion-collapse collapse"
                    aria-labelledby="flush-headingOne"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div class="accordion-body">
                      <input
                        class="form-control"
                        type="file"
                        id="etradeCSVSelect"
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <button
                          className="btn btn-sm btn-outline-primary mt-2"
                          onClick={() => syncWithEtrade()}
                        >
                          Sync Portfolio with Etrade
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 mt-2">
                  <button
                    type="button"
                    class={
                      selectedStatus === "icebox"
                        ? "btn btn-sm btn-light status-button m-1"
                        : "btn btn-sm btn-outline-light status-button m-1"
                    }
                    onClick={() => {
                      findPortfolio(userID, "icebox");
                      setSelectedStatus((selectedStatus) => "icebox");
                    }}
                  >
                    Icebox
                  </button>
                  <button
                    type="button"
                    class={
                      selectedStatus === "watch"
                        ? "btn btn-sm btn-light status-button m-1"
                        : "btn btn-sm btn-outline-light status-button m-1"
                    }
                    onClick={() => {
                      findPortfolio(userID, "watch");
                      setSelectedStatus((selectedStatus) => "watch");
                    }}
                  >
                    Watch
                  </button>
                  <button
                    type="button"
                    class={
                      selectedStatus === "own"
                        ? "btn btn-sm btn-light status-button m-1"
                        : "btn btn-sm btn-outline-light status-button m-1"
                    }
                    onClick={() => {
                      findPortfolio(userID, "own");
                      setSelectedStatus((selectedStatus) => "own");
                    }}
                  >
                    Own
                  </button>
                  <button
                    type="button"
                    class={
                      selectedStatus === "hold"
                        ? "btn btn-sm btn-light status-button m-1"
                        : "btn btn-sm btn-outline-light status-button m-1"
                    }
                    onClick={() => {
                      findPortfolio(userID, "hold");
                      setSelectedStatus((selectedStatus) => "hold");
                    }}
                  >
                    Hold
                  </button>
                  <button
                    type="button"
                    class={
                      selectedStatus === "speculative"
                        ? "btn btn-sm btn-light status-button m-1"
                        : "btn btn-sm btn-outline-light status-button m-1"
                    }
                    onClick={() => {
                      findPortfolio(userID, "speculative");
                      setSelectedStatus((selectedStatus) => "speculative");
                    }}
                  >
                    Speculative
                  </button>
                </div>
              </div>
            </div>
          </div>
          {!loading
            ? valueSearchData.map((stock, i) => (
              <QuoteCard
                stock={stock}
                userID={userID}
                updatePortfolio={updatePortfolio}
                portfolio={portfolio}
              />
            ))
            : ""}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
