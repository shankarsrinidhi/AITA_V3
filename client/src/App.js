import React, { Fragment } from "react";
import { Container, AppBar, Typography, Grow, Grid } from '@mui/material';
import Header from "./components/views/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

//components

import Footer from "./components/views/Footer";
import { Route, Routes } from "react-router-dom";
import MOKR from "./components/pages/MOKR";
import WeeklyReport from "./components/pages/WeeklyReport";
import  Home  from "./components/pages/Home";
import SignUp from "./components/pages/SignUp";
import LogIn from "./components/pages/LogIn";

import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
    <Fragment>
      
          

        
      
      
      <Routes>
         <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Home />} />
          <Route path="/weeklyReport/:week_start" element={<WeeklyReport />} />
          
          <Route path="/MOKR" element={<MOKR />} />
        </Routes>
        
        
        
      
     
      
    </Fragment>
    </AuthProvider>
  );
}

export default App;
