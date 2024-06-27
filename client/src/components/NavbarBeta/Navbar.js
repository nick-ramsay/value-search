import React from "react";
import {
  getCookie,
} from "../../sharedFunctions/sharedFunctions";
import "./style.css";
import ValueSearchIcon from "../../images/value_search_icon_1024.png"
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function NavbarBeta(props) {
  let currentTheme = localStorage.getItem("vs-theme");
  const toggleTheme = () => {

    if (currentTheme === undefined || currentTheme === null || currentTheme === "light") {
      localStorage.setItem("vs-theme", "dark");
      document.location.reload();
    } else {
      localStorage.setItem("vs-theme", "light");
      document.location.reload();
    }
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/" style={currentTheme === "dark" ? {"color":"#bb86fc","fontWeight":"bold"}:{"fontWeight":"bold"}}> <img className="pb-1" src={ValueSearchIcon} style={{"height":"40px", "marginRight":"4px"}} />Value Search</a>
        <button className="navbar-toggler mr-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {getCookie("vs_id") !== "" && getCookie("vs_id") !== undefined ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle p-2"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <AccountCircleIcon style={{"height":"20px"}} /> {"Placeholder Name"}
                </a>
                <ul className={currentTheme === "dark" ? "dropdown-menu text-center bg-dark":"dropdown-menu text-center"}>
                  <li>
                    <button
                      type="button"
                      className="btn btn-sm m-2 btn-outline-danger text-center"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <button
                type="button"
                className="btn btn-sm m-2 btn-outline-primary standard-button"
                data-bs-toggle="modal"
                data-bs-target="#signInModal"
              >
                Sign In
              </button>
            )}
            <li className="nav-item">
              <a className="nav-link p-2" onClick={() => toggleTheme()}>{currentTheme === "dark" ? <div><LightModeIcon title="Switch to light theme" style={{"height":"20px"}} /><span className="d-lg-none d-xl-none"> Light Theme</span></div> : <div><DarkModeIcon title="Switch to dark theme" style={{"height":"20px"}} /><span className="d-lg-none d-xl-none"> Dark Theme</span></div>}</a>
            </li>
          </ul>
          <form className="d-flex p-2" role="search">
            <input
              id="searchSymbol"
              className="form-control form-control-sm me-2"
              type="search"
              placeholder="Ticker Symbol"
              defaultValue={""}
              value={props.searchSymbol}
              aria-label="Search"
              onChange={props.handleChange}
            />
            <button
              className="btn btn-sm btn-outline-primary navbar-button"
              type="button"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}

export default NavbarBeta;