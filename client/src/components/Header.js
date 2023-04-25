import React, { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FaBars } from "react-icons/fa";

import pamplinlogo from './logo-images/pamplin.png';



const divStyle = {
    color: 'red',
    backgroundColor: 'blue',
    fontSize: '24px'
  };
  
  const pamplin = {
  
  width: '18rem',
  height: '5.5rem',
  padding: '0.75rem',
  align : 'center'
 
  };
  


    

function Header() {
    const [teamName, setTeamName] = useState([]);
    const getTeamName = async () => {
        
        try {
          const response = await fetch("http://localhost:5000/teamName");
          const jsonData = await response.json();
    
          setTeamName(jsonData);
        } catch (err) {
          console.error(err.message);
        }
      };

      useEffect(() => {
        getTeamName();
      }, []);



  return (
    <header>
        <head><link href="client/src/assets/fontawesome-free-6.4.0-web/css/solid.css" rel="stylesheet"/></head>
        <div>
        <img src={pamplinlogo} style={pamplin} /> 
        <div class="float-right"><FaBars style={{color: '#8f0000', fontSize: '50px', padding: '7.5px', marginTop:'25px'}} className="btn"/></div><br></br>
        </div>
        <div>
      <h2 className="centered">{teamName.team_name}</h2>
      </div>
    </header>
  );
}

export default Header;