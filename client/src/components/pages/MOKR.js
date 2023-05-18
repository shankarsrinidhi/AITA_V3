
import TextField from '@mui/material/TextField';
import { MdOutlineModeEditOutline } from "react-icons/md"; 
import { BiSave } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import axios from "axios"

import React, { Fragment, useState, useEffect } from "react";
import "../css_components/mokr.css"
import ListTodos from "../ListTodos";
import Mission from '../Mission';
import AddObjective from '../AddObjective';


const MOKR = () => {
  
  

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  

  /*fetch("http://localhost:5000/1/mission")
  .then((response) => response.json())
  .then(console.log("response of mission"))
  .then((data) => setMiss(data.mission))
  .catch((error) => console.log(error));
*/
  //console.log("check");

 // console.log(miss);

  /*const getMiss = async () => {
    try {
      //const response = await fetch("http://localhost:5000/1/mission");
      const response = await fetch(`http://localhost:5000/1/mission`, {
        method: "GET"
      });
      const jsonData = await response.json();
      //const data = JSON.parse(response);
      

      setMiss(jsonData.mission);
      console.log(miss);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getMiss();
  }, []);*/

  

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit form data
    //setInitialValue(value);
  };


  /*useEffect(() => {
    fetch("http://localhost:5000/1/isMOKRSubmitted")
      .then((response) => response.json())
      .then((data) => setIsAuthenticated(data.mokrsubmitted))
      .catch((error) => console.error(error));
  }, []);*/

   console.log(isAuthenticated);

  const isMOKRSubmitted = async e =>{
    try {
      const response = await fetch("http://localhost:5000/1/isMOKRSubmitted");
      const jsonData = await response.json();
      //console.log(jsonData);
      
    } catch (err) {
      console.error(err.message);
    }
  }



  

  

  return (
    <Fragment>
      <h4 className="text-center mt-3" style={{color:'#8F0000', fontFamily: 'Lato'}}>MOKR</h4>
      <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
      
      <Mission></Mission>

        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        <div className='container'>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Objectives</h4>
          
          <AddObjective/>
      </div>
      
      </div> 
       <ListTodos></ListTodos>
      
    </Fragment>
  );
};

export default MOKR;


  