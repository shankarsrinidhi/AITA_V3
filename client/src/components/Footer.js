import React, { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FaBars } from "react-icons/fa";
import "./css_components/nav.css";
//import HomeIcon from '@mui/icons-material/Home';
import { Link, useMatch, useResolvedPath } from "react-router-dom";

const Footer = () => {
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
        
            <nav class="nav">
            <CustomLink to="/">
                <i class="material-icons nav__icon">home</i>
                <span class="nav__text">Dashboard</span>
            </CustomLink>
            <CustomLink to="weeklyReport">
                <i class="material-icons nav__icon">add_circle</i>
                <span class="nav__text">Weekly Report</span>
            </CustomLink>
            <CustomLink to="MOKR">
                <i class="material-icons nav__icon">key</i>
                <span class="nav__text">MOKR</span>
            </CustomLink>
            
           
            </nav>
      </Fragment>
    );
  };
  
  export default Footer;