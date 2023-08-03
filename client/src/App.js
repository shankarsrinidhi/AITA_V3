import React, { useState, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import PrivateRoutes from "./routes/PrivateRoutes";

//components
import { Route, Routes } from "react-router-dom";
import MOKR from "./components/pages/MOKR";
import WeeklyReport from "./components/pages/WeeklyReport";
import Home from "./components/pages/Home";
import SignUp from "./components/pages/SignUp";
import LogIn from "./components/pages/LogIn";
import Admin from "./components/pages/Admin";

import { AuthProvider } from "./contexts/AuthContext";
import ForgotPassword from "./components/pages/ForgotPassword";
import { useAuth } from "./contexts/AuthContext";
import { TeamProvider } from "./contexts/TeamContext";
import  { useContext, useEffect } from 'react';
import { TeamContext } from './contexts/TeamContext';


function App() {

  return (
    <AuthProvider>
      <TeamProvider>
        <Fragment>

          <Routes>
            <Route path="/" element={<PrivateRoutes> <Home /> </PrivateRoutes>} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} /> 
            <Route path="/home/:team_id" element={<PrivateRoutes> <Home /> </PrivateRoutes>} />
            <Route path="/weeklyReport/:week_start/team/:team_id" element={<PrivateRoutes> <WeeklyReport /> </PrivateRoutes>} />
            <Route path="/MOKR/:team_id" element={<PrivateRoutes><MOKR /></PrivateRoutes> } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/appadmin" element={<PrivateRoutes> <Admin /> </PrivateRoutes>} />
          </Routes>

        </Fragment>
      </TeamProvider>
    </AuthProvider>
  );
}

export default App;
