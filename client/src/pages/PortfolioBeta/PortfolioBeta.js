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
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import analyticsIcon from "../../images/outline_analytics_white_24dp.png";
import { sha256 } from "js-sha256";
import "./style.css";

import QuoteCard from "../../components/QuoteCard/QuoteCard";
import Navbar from "../../components/Navbar/Navbar";
import DonutSmall from "@mui/icons-material/DonutSmall";
ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioBeta = () => {
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
        setLoading((loading) => false);
      });
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
    let symbolList = [];
    API.findPortfolio(user, selectedStatus).then((res) => {
      if (res.data !== null) {
        setPortfolio((portfolio) => res.data.portfolio);
        renderAnalytics(res.data.portfolio);
        let statusCount = {
          own: 0,
          hold: 0,
          speculative: 0,
          tradableOwn: 0,
        };

        for (let j = 0; j < res.data.portfolio.length; j++) {
          if (res.data.portfolio[j].status === "own") {
            statusCount.own += 1;
          } else if (res.data.portfolio[j].status === "tradableOwn") {
            statusCount.tradableOwn += 1;
          } else if (res.data.portfolio[j].status === "hold") {
            statusCount.hold += 1;
          } else if (res.data.portfolio[j].status === "speculative") {
            statusCount.speculative += 1;
          }
        }
        setPortfolioStatusCounts((portfolioStatusCounts) => statusCount);
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

  const renderAnalytics = (portfolioData) => {
    let ownedSymbols = [];
    let ownedData = [];
    let industries = {
      undefined: 0,
    };
    let sectors = {
      undefined: 0,
    };
    let industriesArray = {
      labels: [],
      datasets: [
        {
          label: "Count of Positions",
          data: [],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    let sectorsArray = {
      labels: [],
      datasets: [
        {
          label: "Count of Positions",
          data: [],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    setIndustriesData((industriesData) => industriesArray);
    setSectorsData((sectorsData) => sectorsArray);

    for (let i = 0; i < portfolioData.length; i++) {
      if (
        portfolioData[i].status === "own" ||
        portfolioData[i].status === "tradableOwn" ||
        portfolioData[i].status === "hold"
      ) {
        ownedSymbols.push(portfolioData[i].symbol);
      }
    }
    API.findPortfolioQuotes(ownedSymbols).then((res) => {
      ownedData = res.data;
      for (let j = 0; j < ownedData.length; j++) {
        if (ownedData[j].fundamentals !== undefined) {
          let currentIndustry = ownedData[j].fundamentals.industry;
          if (industries[currentIndustry] === undefined) {
            industries[currentIndustry] = 1;
          } else {
            industries[currentIndustry] += 1;
          }
        } else {
          sectors.undefined += 1;
        }

        if (ownedData[j].fundamentals !== undefined) {
          let currentSector = ownedData[j].fundamentals.sector;
          if (sectors[currentSector] === undefined) {
            sectors[currentSector] = 1;
          } else {
            sectors[currentSector] += 1;
          }
        } else {
          sectors.undefined += 1;
        }
      }

      for (const key in industries) {
        if (industries.hasOwnProperty(key)) {
          //console.log(`${key}: ${industries[key]}`);
          industriesArray.labels.push(`${key}`.toUpperCase());
          industriesArray.datasets[0].data.push(Number(`${industries[key]}`));
        }
      }

      for (const key in sectors) {
        if (sectors.hasOwnProperty(key)) {
          //console.log(`${key}: ${industries[key]}`);
          sectorsArray.labels.push(`${key}`.toUpperCase());
          sectorsArray.datasets[0].data.push(Number(`${sectors[key]}`));
        }
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
      findPortfolio(userID, selectedStatus);
    });
  };

  const updateThesis = (symbol, userID) => {
    let newThesis = document.getElementById(
      symbol + "ThesisInput"
    ).value;

    console.log(symbol)
    console.log(newThesis)
    console.log(userID)
    
    
    API.updateThesis(userID, newThesis, symbol).then((res) => {
      console.log(res);
      //findPortfolio(userID, selectedStatus);
    });
  };

  //START: Login functions

  const renderAccountName = () => {
    let vsIdCookie = getCookie("vs_id");
    if (vsIdCookie) {
      setUserID((userID) => vsIdCookie);
      API.findUserName(getCookie("vs_id")).then((res) => {
        setFirstname((firstname) => res.data.firstname);
        setLastname((lastname) => res.data.lastname);
        findPortfolio(getCookie("vs_id"));
      });
    }
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
    API.findPortfolioQuotes(symbols, selectedStatus).then((res) => {
      setValueSearchData((valueSearchData) => res.data);
      setLoading((loading) => false);
    });
  };

  const syncWithEtrade = () => {
    var file = document.querySelector("#etradeCSVSelect").files[0];
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
      API.syncPortfolioWithEtrade(etradeSymbols, "own").then((res) => { });
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

                  <div className="row mt-2">
                    <div className="col-md-12 mt-2">
                      <button
                        type="button"
                        className={
                          selectedStatus === "icebox"
                            ? loading === false ? "btn btn-sm btn-light status-button selected-status-button m-1" : "btn btn-sm status-button selected-status-button m-1 disabled"
                            : loading === false ? "btn btn-sm btn-outline-light status-button m-1" : "btn btn-sm selected-status-button status-button m-1 disabled"
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
                            ? loading === false ? "btn btn-sm btn-light status-button selected-status-button m-1" : "btn btn-sm status-button selected-status-button m-1 disabled"
                            : loading === false ? "btn btn-sm btn-outline-light status-button m-1" : "btn btn-sm status-button m-1 disabled"
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
                          selectedStatus === "tradableOwn"
                            ? loading === false ? "btn btn-sm btn-light status-button selected-status-button m-1" : "btn btn-sm status-button selected-status-button m-1 disabled"
                            : loading === false ? "btn btn-sm btn-outline-light status-button m-1" : "btn btn-sm status-button m-1 disabled"
                        }
                        onClick={() => {
                          if (loading === false) {
                            findPortfolio(userID, "tradableOwn");
                            setSelectedStatus((selectedStatus) => "tradableOwn");
                            setLoading((loading) => true);
                          }
                        }}
                      >
                        {"Tradable Own (" + (portfolioStatusCounts.tradableOwn != undefined ? portfolioStatusCounts.tradableOwn : "-") + ")"}
                      </button>
                      <button
                        type="button"
                        className={
                          selectedStatus === "own"
                            ? loading === false ? "btn btn-sm btn-light status-button selected-status-button m-1" : "btn btn-sm status-button selected-status-button m-1 disabled"
                            : loading === false ? "btn btn-sm btn-outline-light status-button m-1" : "btn btn-sm status-button m-1 disabled"
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
                            ? loading === false ? "btn btn-sm btn-light status-button selected-status-button m-1" : "btn btn-sm status-button selected-status-button m-1 disabled"
                            : loading === false ? "btn btn-sm btn-outline-light status-button m-1" : "btn btn-sm status-button m-1 disabled"
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
                            ? loading === false ? "btn btn-sm btn-light status-button selected-status-button m-1" : "btn btn-sm status-button selected-status-button m-1 disabled"
                            : loading === false ? "btn btn-sm btn-outline-light status-button m-1" : "btn btn-sm status-button m-1 disabled"
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
                      <DonutSmall
                      id="portfolioAnalytics"
                      className="medium-icon pointer-hover"
                      src={analyticsIcon}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#analyticsAccordion"
                      aria-expanded="true"
                      aria-controls="analyticsAccordion"
                      />
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
                              className="btn btn-sm btn-outline-primary standard-button mt-2 mb-1"
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
            {selectedStatus === "own" || selectedStatus === "tradableOwn" ?
              <div className="row">
                <div className="col-md-12">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" defaultChecked={sellTargetMet} checked={sellTargetMet} id="sellTargetMetTickbox" onClick={() => {
                      let currentlyChecked = document.getElementById("sellTargetMetTickbox").checked;
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
                    updateThesis={updateThesis}
                    portfolio={portfolio}
                    selectedStatus={selectedStatus}
                    findPortfolio={findPortfolio}
                    watchOnlyPriceTargets={watchOnlyPriceTargets}
                    page={"Portfolio"}
                  />
                  : selectedStatus === "own"
                    && (sellTargetMet === true ? ((portfolio[portfolio.findIndex((portfolio) => portfolio.symbol === stock.symbol)].sellTarget <= stock.quote.latestPrice) && portfolio[portfolio.findIndex((portfolio) => portfolio.symbol === stock.symbol)].sellTargetEnabled === true) : true) ?
                    < QuoteCard
                      stock={stock}
                      userID={userID}
                      updatePortfolio={updatePortfolio}
                      updateThesis={updateThesis}
                      portfolio={portfolio}
                      selectedStatus={selectedStatus}
                      findPortfolio={findPortfolio}
                      watchOnlyPriceTargets={watchOnlyPriceTargets}
                      page={"Portfolio"}
                    />
                    : selectedStatus === "tradableOwn"
                      && (sellTargetMet === true ? ((portfolio[portfolio.findIndex((portfolio) => portfolio.symbol === stock.symbol)].sellTarget <= stock.quote.latestPrice) && portfolio[portfolio.findIndex((portfolio) => portfolio.symbol === stock.symbol)].sellTargetEnabled === true) : true) ?
                      < QuoteCard
                        stock={stock}
                        userID={userID}
                        updatePortfolio={updatePortfolio}
                        updateThesis={updateThesis}
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
                        updateThesis={updateThesis}
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
    </div>
  );
};

export default PortfolioBeta;
