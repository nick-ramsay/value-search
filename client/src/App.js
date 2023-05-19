import React, { } from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from "react-router-dom";
import './App.css';

import Home from "../src/pages/Home/Home";
import ScoreSearch from "../src/pages/ScoreSearch/ScoreSearch";
import Portfolio from "../src/pages/Portfolio/Portfolio";
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
    service:'value-search',
    
    // Specify a version number to identify the deployed version of your application in Datadog 
    // version: '1.0.0',
    sampleRate: 100,
    sessionReplaySampleRate: 20,
    trackInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel:'mask-user-input'
});

datadogLogs.init({
  clientToken: 'pub9fb08dd8420145635d6d85ef8ace47f7',
  site: 'datadoghq.com',
  forwardErrorsToLogs: true,
  sampleRate: 100,
})
    
datadogRum.startSessionReplayRecording();

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/score-search" element={<ScoreSearch />} />
        <Route exact path="/portfolio" element={<Portfolio />} />
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

export default App;
