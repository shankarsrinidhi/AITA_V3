import React, { Fragment } from "react";
import { Container, AppBar, Typography, Grow, Grid } from '@mui/material';
import Header from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

//components

import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import MOKR from "./components/pages/MOKR";
import WeeklyReport from "./components/pages/WeeklyReport";
import  Home  from "./components/pages/Home";
import SignUp from "./components/SignUp";

function App() {
  return (
    <Fragment>
      
          

        
      <div className="container">
      <Header/>
      <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/weeklyReport/:week_start" element={<WeeklyReport />} />
          
          <Route path="/MOKR" element={<MOKR />} />
        </Routes>
        
        
        
      </div>
      <div>
          <Footer />
        </div>
      
    </Fragment>
  );
}

export default App;
