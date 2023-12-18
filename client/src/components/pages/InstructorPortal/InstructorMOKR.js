import React, { Fragment, useState, useEffect, useContext } from "react";
import "../../css_components/mokr.css"
import ListTodos from "../../views/CommonPortalViews/ListTodos";
import Mission from '../../views/CommonPortalViews/Mission';
import Footer from '../../views/CommonPortalViews/Footer';
import Header from '../../views/CommonPortalViews/Header';
import { useAuth } from "../../../contexts/AuthContext"
import { TeamContext } from '../../../contexts/TeamContext';
import { useParams } from 'react-router-dom';

const InstructorMOKR = () => {
  const [viewTeam, setViewTeam] = useState("");
  const [courseTeams, setCourseTeams] = useState([]);
  const [shouldRender, setShouldRender] = useState(false);
  const {teams, setTeams} = useContext(TeamContext);
  const { currentUser, logout } = useAuth();
  const { course_id } = useParams();
  const [team_id] = useState();
  const [refreshCount, setRefreshCount] = useState(0);

  setTimeout(() => {
    setShouldRender(true);
  }, 500);

 

  const getCourseTeams = async e => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const id =  currentUser.email;
      const body = { id };
      const response = await fetch(
        `http://localhost:5000/courseteams/${course_id}`,
        {
          method: "GET",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" }
          
        }
      );
      if (response.ok) {
        const jsonData = await response.json();
        setCourseTeams(jsonData);
      } else {
        if(response.status === 403){
          window.location = '/login';
        }
      }
      

    } catch (err) {
      console.error(err.message);
    }
  };

  const getTeams = async e => {
    try {
      if (team_id === "default"){
        return;
      }
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
    getCourseTeams();
  },[]);

  const refreshComponents = () =>{
    setRefreshCount(refreshCount+1);
  }

 
  return (
    <Fragment>
      <div className='container'>
            

      {shouldRender? <Header course_id={course_id}/> : null}
        <h4 className="text-center mt-3" style={{color:'#8F0000', fontFamily: 'Lato'}}>MOKR</h4>
        <h6>Select the Team's MOKR you want to view</h6>
        <select class="form-select" aria-label="Default select example" value={viewTeam} onChange={(event) =>{setViewTeam(event.target.value); refreshComponents();}} required>
                    <option selected>Select option</option>
                    {courseTeams.map(team => (
                        <option value={team.team_id}>{team.team_name}</option>
                    ))}
            </select>
        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        {viewTeam === "" || viewTeam === "Select option" ? <></> : <>
        {teams.length && team_id !== "default" > 0 ? (<>
        {shouldRender? <><Mission key={`VT${refreshCount}`} nonEditable={true} team_id={viewTeam}></Mission>
        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        <div className='container'>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Objectives</h4>
          </div>
        </div> 
        <ListTodos key={`LT${refreshCount}`} team_id={viewTeam} nonEditable={true}></ListTodos></>: null}</>):(<h5 className="ml-3 text-center">Welcome! You are currently not added to any team. Please wait to be added or reach out to the admin</h5>)}
        </>}
        
      </div>
      <br></br>
      <Footer course_id={ course_id }></Footer>
    </Fragment>
  );
};

export default InstructorMOKR;


  