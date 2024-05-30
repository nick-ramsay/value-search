import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from "react-router-dom";
import "./App.css";

import Home from "../src/pages/Home/Home";
import HomeBeta from "../src/pages/HomeBeta/Home";
import ScoreSearch from "../src/pages/ScoreSearch/ScoreSearch";
import Portfolio from "../src/pages/Portfolio/Portfolio";
import PortfolioBeta from './pages/PortfolioBeta/PortfolioBeta';
import Login from '../src/pages/Login/Login';
import CreateAccountRequest from '../src/pages/CreateAccountRequest/CreateAccountRequest';
import CreateAccount from '../src/pages/CreateAccount/CreateAccount';
import ResetPasswordRequest from '../src/pages/ResetPasswordRequest/ResetPasswordRequest';
import ResetPassword from '../src/pages/ResetPassword/ResetPassword';
import Error from '../src/pages/Error/Error';
import NoAccess from '../src/pages/NoAccess/NoAccess';

import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs'

datadogRum.init({
  applicationId: 'f4f1a0a5-0519-4ff5-889d-db1733aad98f',
  clientToken: 'pub9fb08dd8420145635d6d85ef8ace47f7',
  site: 'datadoghq.com',
  service: 'value-search',
  env: 'staging',
  version: '1.0.0', 
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
});

datadogLogs.init({
  clientToken: 'pub9fb08dd8420145635d6d85ef8ace47f7',
  site: 'datadoghq.com',
  forwardErrorsToLogs: true,
  sampleRate: 100,
})

datadogRum.startSessionReplayRecording();

class App extends Component {
  componentDidMount() {
    let theme = localStorage.getItem("vs-theme");
    if (theme === undefined || theme === null) {
      localStorage.setItem("vs-theme", "dark")
      import("./App.css");
    } else if (theme === "dark") {
      import("./App.css")
    } 
    else if (theme === "light") {
      import("./AppLight.css");
    }
  }
  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/home-beta" element={<HomeBeta />} />
          <Route exact path="/score-search" element={<ScoreSearch />} />
          <Route exact path="/portfolio" element={<Portfolio />} />
          <Route exact path="/portfolio-beta" element={<PortfolioBeta />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/create-account-request" element={<CreateAccountRequest />} />
          <Route exact path="/create-account" element={<CreateAccount />} />
          <Route exact path="/reset-password-request" element={<ResetPasswordRequest />} />
          <Route exact path="/reset-password" element={<ResetPassword />} />
          <Route element={<Error />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
