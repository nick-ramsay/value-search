import React from "react";
import {
  getCookie,
} from "../../sharedFunctions/sharedFunctions";
import "./style.css";
import ValueSearchIcon from "../../images/value_search_icon.png"
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

function Navbar(props) {
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
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link p-2" onClick={() => toggleTheme()}>{currentTheme === "dark" ? <LightModeIcon title="Switch to light theme" style={{"height":"20px"}} /> : <DarkModeIcon title="Switch to dark theme" style={{"height":"20px"}} />}</a>
            </li>
            {getCookie("vs_id") !== "" && getCookie("vs_id") !== undefined ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle p-2"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {props.firstname + " " + props.lastname}
                </a>
                <ul className="dropdown-menu text-center bg-dark">
                  <li>
                    <button
                      type="button"
                      className="btn btn-sm m-2 btn-outline-danger text-center"
                      onClick={props.logout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <button
                type="button"
                className="btn btn-sm m-2 standard-button"
                data-bs-toggle="modal"
                data-bs-target="#signInModal"
              >
                Sign In
              </button>
            )}
          </ul>
          <form className="d-flex p-2" role="search">
            <input
              id="searchSymbol"
              className="form-control form-control-sm me-2"
              type="search"
              placeholder="Ticker Symbol"
              defaultValue={""}
              aria-label="Search"
            />
            <button
              className="btn btn-sm btn-outline-primary navbar-button"
              type="button"
              onClick={props.findSingleStock}
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;