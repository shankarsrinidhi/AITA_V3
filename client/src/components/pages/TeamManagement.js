import React, { Fragment, useState, useEffect, useContext } from "react";
import Header from "../views/Header";
import Footer from "../views/Footer";
import { useAuth } from "../../contexts/AuthContext"
import { TeamContext } from '../../contexts/TeamContext';
import { useParams } from 'react-router-dom';
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import {Multiselect} from 'multiselect-react-dropdown';
import Modal from 'react-bootstrap/Modal';
import StudentTeamManagement from "../views/StudentTeamManagement";
import InstructorTeamManagement from "../views/InstructorTeamManagement";




export default function TeamManagement() {
  const { userType } = useParams();

const containerStyle = {
    backgroundPosition:'center',
    backgroundSize:'cover',
    opacity: 1,
    height:'100%',
    position:'relative'
};


const filterStyle = {
    backgroundPosition: '10px 12px', 
    backgroundRepeat: 'no-repeat', 
    width: '100%', 
    fontSize: '16px',
    padding: '12px 20px 12px 40px',
    border: '1px solid #ddd',
    marginBottom: '12px',
  
}
  const [shouldRender, setShouldRender] = useState(false);

  

  const { currentUser, logout } = useAuth()
  const {teams, setTeams,  selectedTeam, count} = useContext(TeamContext);
  const [error, setError] = useState("");
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


// Simulating a delay before rendering the component
setTimeout(() => {
  setShouldRender(true);
}, 500);

  const { team_id } = useParams();
  
  const [welcome, setWelcome] = useState(true);
  const [courseList, setCourseList] = useState([]);
 
  const [teamsList, setTeamsList] = useState([]);

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

  const [selectedOption, setSelectedOption] = useState('');
  const [showTeams, setShowTeams] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCloseError = () => setShowError(false);

  const handleShowError = () => setShowError(true);

  const [selectedOptionCourse, setSelectedOptionCourse] = useState('');

  const handleOptionChangeCourse = (event) => {
    setSelectedOptionCourse(event.target.value);
  };

  const continueToNextScreen = (event) => {
    if (selectedOption === "" || (selectedOption === "student" && selectedOptionCourse === "")){
      handleShowError();
      return;
     }
    setShowTeams(true);
  };


  function filterFunction() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('tr');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("td")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

  function myFunction() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

 



  



  return(
  <Fragment>
    {shouldRender?<div className='container'>
    <Header team_id={ team_id !== "default" ? team_id : (teams?.length > 0 ?  teams[0]?.team_id : "default")}/> 
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