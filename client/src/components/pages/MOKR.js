import React, { Fragment, useState, useEffect } from "react";
import "../css_components/mokr.css"
import ListTodos from "../views/ListTodos";
import Mission from '../views/Mission';
import AddObjective from '../views/AddObjective';
import Footer from '../views/Footer';
import Header from '../views/Header';
import { useAuth } from "../../contexts/AuthContext"


const MOKR = () => {

  const { currentUser, logout } = useAuth()
  const [welcome, setWelcome] = useState(true);

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

  const isMOKRSubmitted = async e =>{
    try {
      const response = await fetch("http://localhost:5000/1/isMOKRSubmitted");
      const jsonData = await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Fragment>
      <div className='container'>
        <Header/>
        <h4 className="text-center mt-3" style={{color:'#8F0000', fontFamily: 'Lato'}}>MOKR</h4>
        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        {welcome? (<><Mission></Mission>
        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        <div className='container'>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Objectives</h4>
              <AddObjective/>
          </div>
        </div> 
        <ListTodos></ListTodos></>):(<h5 className="ml-3">Welcome! You are currently not added to any team. Please wait to be added or reach out to the admin</h5>)}
      </div>
      <br></br>
      <Footer></Footer>
    </Fragment>
  );
};

export default MOKR;


  