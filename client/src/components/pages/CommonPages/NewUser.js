import React, { Fragment, useState, useEffect } from "react";
import Header from "../../views/CommonPortalViews/Header";
import Footer from "../../views/CommonPortalViews/Footer";
import { useAuth } from "../../../contexts/AuthContext"
import { AiOutlineArrowRight } from "react-icons/ai";
import { Button } from "react-bootstrap"
import Modal from 'react-bootstrap/Modal';




export default function NewUser() {

  const [shouldRender, setShouldRender] = useState(false);
  const { currentUser } = useAuth()
  const [selectedOption, setSelectedOption] = useState('');
  const [showError, setShowError] = useState(false);
  const [selectedOptionCourse, setSelectedOptionCourse] = useState('');
  const [courseList, setCourseList] = useState([]);



setTimeout(() => {
  setShouldRender(true);
}, 500);



  const getCourseList = async e => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const response = await fetch(
        `http://localhost:5000/courses`,
        {
          method: "GET",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" }
        }
      );
      if (response.ok) {
        const jsonData = await response.json();
        setCourseList(jsonData);
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
    getCourseList();
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCloseError = () => setShowError(false);

  const handleShowError = () => setShowError(true);


  const handleOptionChangeCourse = (event) => {
    setSelectedOptionCourse(event.target.value);
  };

  const continueToNextScreen = async (event) => {
    if (selectedOption === "" || (selectedOption === "student" && selectedOptionCourse === "")){
      handleShowError();
      return;
     }
     try {
        if (selectedOption === "instructor"){
          const email = currentUser.email;
          const idToken = localStorage.getItem('firebaseIdToken');
          const instructorBody = { email }
          const addInstructor = await fetch(
              `http://localhost:5000/newInstructor`,
              {
                method: "POST",
                headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
                body: JSON.stringify(instructorBody)
              }
            );
  
        const body = { email, selectedOption };
        const response = await fetch(
          `http://localhost:5000/newuser`,
          {
            method: "PUT",
            headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
        if (response.ok) {
            window.location = `/teammanagement/${selectedOption}`;
        } else {
          if(response.status === 403){
            window.location = '/login';
          }
        }

      }
      else if (selectedOption === "student"){
        const email = currentUser.email;
        const idToken = localStorage.getItem('firebaseIdToken');
        const body = { email, selectedOption, selectedOptionCourse };
        const response = await fetch(
          `http://localhost:5000/newuser`,
          {
            method: "PUT",
            headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
        if (response.ok) {
            window.location = `/teammanagement/${selectedOption}`;
        } else {
          if(response.status === 403){
            window.location = '/login';
          }
        }
      }

      
     
      
    } catch (err) {
      console.error(err.message);
    }

  };

 



  



  return(
  <Fragment>
    {shouldRender?<div className='container'>
    <Header team_id={  undefined }/> 
      <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
    </div> : null}
    <div className="container"><h2  style={{color:'#8F0000', fontFamily: 'Lato'}} className="ml-3 text-center">Welcome to Endeavors!</h2>
    <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
    <>
    <h4 style={{fontFamily: 'Lato' }} className="mb-3 text-center">Tell us about yourself to get started</h4>
    <h5 style={{fontFamily: 'Lato' }}>Purpose of using the tool</h5>
    <div>
      <label className="ml-3">
        <input
          type="radio"
          value="student"
          checked={selectedOption === 'student'}
          onChange={handleOptionChange}
          className="mr-2"
        />
        Student signing up as part of a course 
      </label>
      <br />
      <label className="ml-3">
        <input
          type="radio"
          value="instructor"
          checked={selectedOption === 'instructor'}
          onChange={handleOptionChange}
          className="mr-2"
        />
        Instructor wanting to use the tool for a class
      </label>
      <br />
      <label className="ml-3">
        <input
          type="radio"
          value="cohort"
          checked={selectedOption === 'cohort'}
          onChange={handleOptionChange}
          className="mr-2"
        />
        Working professional looking to use for better management
      </label>
      <br /><br />
    </div>
    {selectedOption ==='student' ? <><h5 style={{fontFamily: 'Lato' }}>Select the Course you are part of</h5>


    <div>
      <label className="ml-3">Select an option:</label>
      <select className="ml-3" value={selectedOptionCourse} onChange={handleOptionChangeCourse}>
        <option value="">Select an option</option>
        {courseList.map((course) => (
          <option value={course.course_id}>{course.course_code} - {course.course_description}</option>
        ))}

      </select>
      
  </div>
    </>
    :<></>}

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <button  style={{ borderRadius: '10px', padding: '10px 20px' , margin:'2rem', backgroundColor:'#8f0000', color :'white', borderColor:'white'}} onClick={continueToNextScreen}>Continue<AiOutlineArrowRight style={{fontSize:'1.5rem', marginLeft:"0.5rem"}}></AiOutlineArrowRight></button>
    </div>
    
    </>

    </div>

        <Modal
          show={showError}
          onHide={handleCloseError}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ color:'red',fontFamily: 'Lato'}}>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5 style={{ fontFamily: 'Lato'}}>Please select an option</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseError}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

    
    <div>
       <Footer team_id={ undefined }/>
    </div>         
  </Fragment>
  )
  }