import React, { Fragment, useState } from "react";
import "../css_components/mokr.css"
import ListTodos from "../views/ListTodos";
import Mission from '../views/Mission';
import AddObjective from '../views/AddObjective';
import Footer from '../views/Footer';
import Header from '../views/Header';


const MOKR = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        <Mission></Mission>
        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        <div className='container'>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Objectives</h4>
              <AddObjective/>
          </div>
        </div> 
        <ListTodos></ListTodos>
      </div>
      <br></br>
      <Footer></Footer>
    </Fragment>
  );
};

export default MOKR;


  