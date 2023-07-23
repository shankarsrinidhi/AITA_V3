import React, { Fragment, useState, useEffect, useContext } from "react";
import "../css_components/mokr.css"
import ListTodos from "../views/ListTodos";
import Mission from '../views/Mission';
import AddObjective from '../views/AddObjective';
import Footer from '../views/Footer';
import Header from '../views/Header';
import { useAuth } from "../../contexts/AuthContext"
import { TeamContext } from '../../contexts/TeamContext';
import { useParams } from 'react-router-dom';

const MOKR = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const {teams, setTeams,  selectedTeam, count} = useContext(TeamContext);
  const { currentUser, logout } = useAuth()
  const [welcome, setWelcome] = useState(true);
  const { team_id } = useParams();

  setTimeout(() => {
    setShouldRender(true);
  }, 500);

 

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
  },[]);

  const isMOKRSubmitted = async e =>{
    try {
      const response = await fetch(`http://localhost:5000/${team_id}/isMOKRSubmitted`);
      const jsonData = await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Fragment>
      <div className='container'>
      {shouldRender? <Header team_id={ team_id !== "default" ? team_id : (teams?.length > 0 ?  teams[0]?.team_id : "default")}/> : null}
        <h4 className="text-center mt-3" style={{color:'#8F0000', fontFamily: 'Lato'}}>MOKR</h4>
        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        {teams.length && team_id !== "default" > 0 ? (<>{shouldRender? <><Mission team_id={team_id}></Mission>
        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        <div className='container'>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Objectives</h4>
              <AddObjective team_id={team_id}/>
          </div>
        </div> 
        <ListTodos team_id={team_id}></ListTodos></>: null}</>):(<h5 className="ml-3 text-center">Welcome! You are currently not added to any team. Please wait to be added or reach out to the admin</h5>)}
      </div>
      <br></br>
      <Footer team_id={team_id !== "default" ? team_id : (teams.length > 0 ?  teams[0].team_id : "default")}></Footer>
    </Fragment>
  );
};

export default MOKR;


  