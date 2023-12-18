import React, { Fragment, useState, useEffect, useContext } from "react";
import Header from "../../views/CommonPortalViews/Header";
import Footer from "../../views/CommonPortalViews/Footer";
import { useAuth } from "../../../contexts/AuthContext"
import { TeamContext } from '../../../contexts/TeamContext';
import { useParams } from 'react-router-dom';
import StudentTeamManagement from "../../views/StudentPortalViews/StudentTeamManagement";
import InstructorTeamManagement from "../../views/InstructorPortalViews/InstructorTeamManagement";


export default function TeamManagement() {
  const { team_id } = useParams(); 
  const [teamsList, setTeamsList] = useState([]);
  const { userType } = useParams();
  const [shouldRender, setShouldRender] = useState(false);
  const { currentUser } = useAuth()
  const { teams, setTeams } = useContext(TeamContext);

  const getTeams = async e => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const id =  currentUser.email;
      const body = { id };
      const response = await fetch(
        `http://localhost:5000/teams`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      if (response.ok) {
        const jsonData = await response.json();
        setTeams(jsonData);
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
    getTeams();
  },[]);


setTimeout(() => {
  setShouldRender(true);
}, 500);



  const getTeamsList = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const email =  currentUser.email;
      const body = { email };
      const response = await fetch(
        `http://localhost:5000/course/allTeams`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
      const jsonData = await response.json();
      setTeamsList(jsonData);

    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTeamsList();
  }, []);
 

  return(
  <Fragment>
    {shouldRender?<div className='container'>
    <Header team_id={"default"}/> 
      <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
    </div> : null}
    <div className="container"><h2  style={{color:'#8F0000', fontFamily: 'Lato'}} className="ml-3 text-center">Welcome to Endeavors!</h2>
    <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
    </div>
    {userType === 'student' ? <StudentTeamManagement></StudentTeamManagement> : <></>}
    {userType === 'instructor' ? <InstructorTeamManagement></InstructorTeamManagement> : <></>}
    <div>
       <Footer team_id={team_id !== "default" ? team_id : (teams.length > 0 ?  teams[0].team_id : "default")}/>
    </div>         
  </Fragment>
  )
  }