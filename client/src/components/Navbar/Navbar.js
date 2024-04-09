import React from "react";
import {
    getCookie,
    logout,
    topOfPage,
    topFunction,
  } from "../../sharedFunctions/sharedFunctions";
import "./style.css";


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
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand pl-2" href="/">Value Search</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
          <a class="nav-link p-2" onClick={() => toggleTheme()}>{currentTheme === "dark" ? "Light Theme":"Dark Theme"}</a>
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
                    className="btn btn-sm m-2 btn-outline-primary"
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
                            className="btn btn-sm btn-outline-primary"
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