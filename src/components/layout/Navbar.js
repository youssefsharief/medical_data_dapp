import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";

const NavBarLink = ({ to, label }) => (
  <li className="nav-item" style={{ marginRight: "20px" }}>
    <NavLink activeClassName="active" to={to} className="nav-link">
      {label}
    </NavLink>
  </li>
);

export const PNavbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
    <NavLink className="navbar-brand" to="/">
      {" "}
      Medical ©{" "}
    </NavLink>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto">
        {true ? (
          <React.Fragment>
            <NavBarLink to="/doctors" label="Doctors" />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <NavBarLink to="/map" label="Login" />
            <NavBarLink to="/signup" label="Signup" />
          </React.Fragment>
        )}
        {<h1> A  </h1>}
      </ul>
    </div>
  </nav>
);

const mapStateToProps = state => ({
  // myId: state.authStoreState.id,
  // isAuthenticated: state.authStoreState.isAuthenticated,
  // isManager: state.authStoreState.role === "manager"
});

const mapDispatchToProps = dispatch => ({
  logout: () => {

  }
});

export const Navbar = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PNavbar);
