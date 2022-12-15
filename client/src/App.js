import React, { } from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from "react-router-dom";
import './App.css';

import Home from "../src/pages/Home/Home";
import Login from '../src/pages/Login/Login';
import CreateAccountRequest from '../src/pages/CreateAccountRequest/CreateAccountRequest';
import CreateAccount from '../src/pages/CreateAccount/CreateAccount';
import ResetPasswordRequest from '../src/pages/ResetPasswordRequest/ResetPasswordRequest';
import ResetPassword from '../src/pages/ResetPassword/ResetPassword';
import Error from '../src/pages/Error/Error';
import NoAccess from '../src/pages/NoAccess/NoAccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/create-account-request" element={<CreateAccountRequest />}/>
        <Route exact path="/create-account" element={<CreateAccount />} />
        <Route exact path="/reset-password-request" element={<ResetPasswordRequest />} />
        <Route exact path="/reset-password" element={<ResetPassword />} />
        <Route element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
