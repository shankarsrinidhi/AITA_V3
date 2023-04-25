import React, { Fragment } from "react";
import { Container, AppBar, Typography, Grow, Grid } from '@mui/material';
import Header from "./components/Header";
import "./App.css";

//components

import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import MOKR from "./components/pages/MOKR";
import WeeklyReport from "./components/pages/WeeklyReport";
import  Home  from "./components/pages/Home";

function App() {
  return (
    <Fragment>
      
          

        
      <div className="container">
      <Header/>
      <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/weeklyReport" element={<WeeklyReport />} />
          <Route path="/MOKR" element={<MOKR />} />
        </Routes>
        <InputTodo />
        <ListTodos />
        
      </div>
      <div>
          <Footer />
        </div>
      
    </Fragment>
  );
}

export default App;
