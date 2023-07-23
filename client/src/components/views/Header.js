import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import pamplinlogo from '../logo-images/pamplin.png';
import NavigationDropdown from "./NavigationDropdown";
import { useAuth } from "../../contexts/AuthContext"
import  { useContext } from 'react';
import { TeamContext } from '../../contexts/TeamContext';


  const pamplin = {
  width: '18rem',
  height: '5.5rem',
  padding: '0.75rem',
  align : 'center'
  }; 

function Header({team_id}) {
//console.log(" in header team_id "+team_id);
    const [teamName, setTeamName] = useState("");
    const { currentUser, logout } = useAuth()
    const [welcome, setWelcome] = useState(true);
    const {teams, setTeams, selectedTeam} = useContext(TeamContext);



    const getTeamName = async () => {
        try {
        
          if (team_id === "default" && teams?.length === 0){
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

      useEffect(() => {
        getTeamName();
      }, []);
      


  return (
    <header>
        <div  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img className= "mt-2" src={pamplinlogo} style={pamplin} /> 
        <NavigationDropdown></NavigationDropdown>
        </div>
        <div>
      <h4 className="centered">{teamName.team_name}</h4>
      </div>
    </header>
  );
}

export default Header;