import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import pamplinlogo from '../logo-images/pamplin.png';
import StudentNavigationDropdown from "./StudentNavigationDropdown";
import { useAuth } from "../../contexts/AuthContext"
import  { useContext } from 'react';
import { TeamContext } from '../../contexts/TeamContext';
import { CourseContext } from "../../contexts/CourseContext";
import InstructorNavigationDropdown from "./InstructorNavigationDropdown";


  const pamplin = {
  width: '18rem',
  height: '5.5rem',
  padding: '0.75rem',
  align : 'center'
  }; 

function Header({team_id, noTitle, course_id}) {
//console.log(" in header team_id "+team_id);
    const [teamName, setTeamName] = useState("");
    const [courseName, setCourseName] = useState("");
    const { currentUser, logout } = useAuth()
    const [welcome, setWelcome] = useState(true);
    const {teams, setTeams, selectedTeam} = useContext(TeamContext);
    const {courses, setCourses} = useContext(CourseContext);



    const getTeamName = async () => {
        try {
        
          if ((team_id === "default" && teams?.length === 0) || team_id === undefined){
            return;
          }

          
            //console.log("In else branch");
            const idToken = localStorage.getItem('firebaseIdToken');
          const response = await fetch(`http://localhost:5000/${team_id}/teamName`,
          {
            method: "GET",
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        if (response.ok) {
          const jsonData = await response.json();
          setTeamName(jsonData);
        } else {
          if(response.status === 403){
            window.location = '/login';
          }
        }
          
        
        } catch (err) {
          console.error(err.message);
        }
      };

      const getCourseName = async () => {
        try {
        
          if ((!course_id && team_id) || ((course_id === "default" && courses?.length === 0) || course_id === undefined)){
            return;
          }

          
            //console.log("In else branch");
            const idToken = localStorage.getItem('firebaseIdToken');
          const response = await fetch(`http://localhost:5000/${course_id}/courseName`,
          {
            method: "GET",
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        if (response.ok) {
          const jsonData = await response.json();
          setCourseName(jsonData);
        } else {
          if(response.status === 403){
            window.location = '/login';
          }
        }
          
        
        } catch (err) {
          console.error(err.message);
        }
      };

      useEffect(() => {
        getTeamName();
        getCourseName();
      }, []);
      


  return (
    <header>
        <div  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img className= "mt-2" src={pamplinlogo} style={pamplin} /> 
        {course_id && !team_id ? <InstructorNavigationDropdown></InstructorNavigationDropdown>: <StudentNavigationDropdown team_id={team_id}></StudentNavigationDropdown>}
        </div>
       {noTitle ? null : 
      (<>{course_id && !team_id ? <div>
        <h4 className="centered">{courseName.course_code} - {courseName.course_description}</h4>
      </div> : <><div>
        <h4 className="centered">{teamName.team_name}</h4>
      </div></>}</>)} 
    </header>
  );
}

export default Header;