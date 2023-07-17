import React, { Fragment } from "react";
import "../css_components/nav.css";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

const Footer = ({team_id}) => {
    function CustomLink({ to, children, ...props }) {
        const resolvedPath = useResolvedPath(to);
        const isActive = useMatch({ path: resolvedPath.pathname, end: true });
        return (
            <Link to={to} className={isActive?"nav__link link-active":"nav__link"} {...props}>
              {children}
            </Link>
              )
      };
  
    return (
      <Fragment>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            <nav className="nav">
            <CustomLink to={`/home/${team_id}`}>
                <i className="material-icons nav__icon">home</i>
                <span className="nav__text">Dashboard</span>
            </CustomLink>
            <CustomLink to={`/weeklyReport/${new Date("Mon Jan 31 2022 05:30:00 GMT-0500 (Eastern Standard Time)")}/team/${team_id}`}>
                <i className="material-icons nav__icon">add_circle</i>
                <span className="nav__text">Weekly Report</span>
            </CustomLink>
            <CustomLink to="/MOKR">
                <i className="material-icons nav__icon">key</i>
                <span className="nav__text">MOKR</span>
            </CustomLink>
            </nav>
      </Fragment>
    );
  };
  
  export default Footer;