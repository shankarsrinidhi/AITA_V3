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
console.log(" in header team_id "+team_id);
    const [teamName, setTeamName] = useState("");
    const { currentUser, logout } = useAuth()
    const [welcome, setWelcome] = useState(true);
    const {teams, setTeams, selectedTeam} = useContext(TeamContext);

    /*const getTeams = async e => {
      try {
        const id = currentUser.email;
        const body = { id };
        const response = await fetch(
          `http://localhost:5000/teams`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
        const jsonData = await response.json();
        setTeams(jsonData);
      } catch (err) {
        console.error(err.message);
      }
    };
    useEffect(() => {
      getTeams();
    }, []);*/
    //console.log(teams);

    const getWelcome = async () => {
      try {
        const response = await fetch(`http://localhost:5000/userteam/${currentUser.email}`);
        const jsonData = await response.json();
        setWelcome(jsonData.result);
      } catch (err) {
        console.error(err.message);
      }
    };
  
    useEffect(() => {
      getWelcome();
    }, []);


    const getTeamName = async () => {
        try {
          console.log("team id in header "+team_id);
          if (team_id === "default"){
            console.log("In default branch");
            //setTeamName("");
          }
          else{
            console.log("In else branch");
          const response = await fetch(`http://localhost:5000/${team_id}/teamName`);
          const jsonData = await response.json();
          setTeamName(jsonData);
        }
        } catch (err) {
          console.error(err.message);
        }
      };

      useEffect(() => {
        getTeamName();
      }, []);
      //console.log("teamname "+teamName.team_name);


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