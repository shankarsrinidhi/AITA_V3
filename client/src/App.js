import React, { useState, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import PrivateRoutes from "./routes/PrivateRoutes";

//components
import { Route, Routes } from "react-router-dom";
import MOKR from "./components/pages/StudentPortal/MOKR";
import InstructorMOKR from "./components/pages/InstructorPortal/InstructorMOKR";
import WeeklyReport from "./components/pages/StudentPortal/WeeklyReport";
import InstructorWeeklyReport from "./components/pages/InstructorPortal/InstructorWeeklyReport";
import  Home  from "./components/pages/StudentPortal/Home";
import SignUp from "./components/pages/CommonPages/SignUp";
import LogIn from "./components/pages/CommonPages/LogIn";

import { AuthProvider } from "./contexts/AuthContext";
import ForgotPassword from "./components/pages/CommonPages/ForgotPassword";
import { TeamProvider } from "./contexts/TeamContext";
import { CourseProvider } from "./contexts/CourseContext";
import NewTeam from "./components/pages/StudentPortal/NewTeam";
import EditTeam from "./components/pages/StudentPortal/EditTeam";
import TeamManagement from "./components/pages/CommonPages/TeamManagement";
import NewUser from "./components/pages/CommonPages/NewUser";
import NewCourse from "./components/pages/InstructorPortal/NewCourse";
import EditCourse from "./components/pages/InstructorPortal/EditCourse";
import InstructorHome from "./components/pages/InstructorPortal/InstructorHome";


function App() {

  return (
    <AuthProvider>
      <TeamProvider>
      <CourseProvider>
        <Fragment>
          <Routes>
            
              <Route path="/signup" element={<SignUp />} />
              <Route path="/newuser" element={<PrivateRoutes><NewUser /></PrivateRoutes>} />
              <Route path="/teammanagement/:userType" element={<PrivateRoutes><TeamManagement /></PrivateRoutes>  } />
              
                <Route path="/login" element={<LogIn />} />
                <Route path="/home/:team_id" element={<PrivateRoutes> <Home /> </PrivateRoutes>} />
                <Route path="/weeklyReport/:week_start/team/:team_id" element={<PrivateRoutes> <WeeklyReport /> </PrivateRoutes>} />
                <Route path="/MOKR/:team_id" element={<PrivateRoutes><MOKR /></PrivateRoutes> } />
                <Route path="/editTeam/:team_id" element={<PrivateRoutes> <EditTeam /> </PrivateRoutes>} />
                <Route path="/newTeam/:team_id" element={<PrivateRoutes> <NewTeam /> </PrivateRoutes>} />
              
              
                <Route path="/login" element={<LogIn />} />
                <Route path="/InstHome/:course_id" element={<PrivateRoutes><InstructorHome /></PrivateRoutes> } />
                <Route path="/InstMOKR/:course_id" element={<PrivateRoutes><InstructorMOKR /></PrivateRoutes> } />
                <Route path="/InstWeeklyReport/:week_start/course/:course_id" element={<PrivateRoutes> <InstructorWeeklyReport /> </PrivateRoutes>} />
                <Route path="/InstWeeklyReport/:week_start/course/:course_id/selectedteam/:team_id" element={<PrivateRoutes> <InstructorWeeklyReport /> </PrivateRoutes>} />
                <Route path="/newCourse/:team_id" element={<PrivateRoutes> <NewCourse /> </PrivateRoutes>} />
                <Route path="/editCourse/:course_id" element={<PrivateRoutes> <EditCourse /> </PrivateRoutes>} />
              
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
        </Fragment>
        </CourseProvider>
        </TeamProvider>
    </AuthProvider>
  );
}

export default App;
