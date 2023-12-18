
import React, { useRef, useState, useEffect, useContext } from "react"
import { useParams } from 'react-router-dom';
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useNavigate } from 'react-router-dom'
import { Container } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import { TeamContext } from '../../contexts/TeamContext';
import Footer from "../views/Footer";
import {Multiselect} from 'multiselect-react-dropdown';
import Header from '../views/Header';
import { RxCross2 } from "react-icons/rx";
import { AiOutlineCheck } from "react-icons/ai";


//Styling for the page
const containerStyle = {
    backgroundPosition:'center',
    backgroundSize:'cover',
    opacity: 1,
    height:'100%',
    position:'relative'
};
 

export default function EditCourse() {
  const { course_id } = useParams();
  const [shouldRender, setShouldRender] = useState(false);
  const { currentUser, logout } = useAuth()
  const [crn, setCrn] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseModality, setCourseModality] = useState("");
  const [instructorOptions, setInstructorOptions] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [selectedInstructorOptions, setSelectedInstructorOptions] = useState([]);
  const [error, setError] = useState("")
  const navigate = useNavigate();
  const {teams, setTeams} = useContext(TeamContext);
  const [requestedInstructorsList, setRequestedInstructorsList] = useState([]);
  


  setTimeout(() => {
    setShouldRender(true);
  }, 500);

  const handleChange = (event) => {
    setCrn(event.target.value);
};

const getCourseDetails = async() =>{
    try {
        const reqData= await fetch(`http://localhost:5000/coursedetails/${course_id}`,
          {
            
                method: "GET",
                headers: { "Content-Type": "application/json" }
              
        });
        if (reqData.ok) {
          const resData= await reqData.json();
          console.log(resData[0]);
          setCourseDetails(resData[0]);
          //setName(resData[0].team_name);
          //setIndustry(resData[0].industry);
          //setInitialMembers(resData[0].students);
          setTimeout(() => {
            setShouldRender(true);
          }, 500);
          
          console.log(courseDetails?.instructors);
    
          
        } else {
          if(reqData.status === 403){
            window.location = '/login';
          }}
        
    } catch (error) {
        console.log(error.message);
        
    }
    }
    
    const getRequestInstructorsList = async() =>{
      try {
          const idToken = localStorage.getItem('firebaseIdToken');
          const reqData= await fetch(`http://localhost:5000/instructorRequestsToJoinCourse/${course_id}`,
            {
              
                  method: "GET",
                  headers: { "Content-Type": "application/json" , 'Authorization': `Bearer ${idToken}`}
                
          });
          if (reqData.ok) {
            const resData= await reqData.json();
            console.log(resData);
            setRequestedInstructorsList(resData);
            console.log(requestedInstructorsList);
      
            
          } else {
            if(reqData.status === 403){
              window.location = '/login';
            }}
          
      } catch (error) {
          console.log(error.message);
          
      }
      }
 

  const handleInstructorOptionSelect = (event) => {
    const getinstructoremails = [];
    const selectedEmails = event.map((selectedName) => {
      const selectedInstructor = instructorOptions.find(
        (instructor) => instructor.full_name === selectedName
      );
      getinstructoremails.push(selectedInstructor.instructor_email) ;
    });
  
    //getinstructoremails.push(currentUser.email);
  
      setSelectedInstructorOptions(getinstructoremails);
      console.log(getinstructoremails);
    };
  
    useEffect(() => {
      fetchInstructorOptions();
      getCourseDetails();
    }, []);
  
    const fetchInstructorOptions = async () => {
      try {
        const idToken = localStorage.getItem('firebaseIdToken');
        const id =  currentUser.email;
        const body = { id };
        const reqData= await fetch(`http://localhost:5000/fullinstructorsdropdown`,
        {
          
              method: "POST",
              headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
              body: JSON.stringify(body)
            
      });
      if (reqData.ok) {
        const resData= await reqData.json();
        
        setInstructorOptions(resData);
      } else {
        if(reqData.status === 403){
          window.location = '/login';
        }
      }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

  const processedInstructorOptions = instructorOptions.map((option) => option.full_name);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
        const email = currentUser.email;
        setSelectedInstructorOptions(selectedInstructorOptions => [...selectedInstructorOptions, email]);
        const body = { crn, courseCode, courseTitle, courseModality, selectedInstructorOptions, email };
        const idToken = localStorage.getItem('firebaseIdToken');
        const response = await fetch(
          `http://localhost:5000/newCourse`,
          {
            method: "POST",
            headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
        if (response.ok) {
          const jsonData = await response.json();
            console.log(jsonData);
         // navigate(`/home/${jsonData.team_id}`)
        } else {
          if(response.status === 403){
            window.location = '/login';
          }
        }
     
      
    } catch (err) {
      console.error(err.message);
    }
      
    }
    
    const removeInstructor = async email => {
    
        try {
          console.log(email);
          const idToken = localStorage.getItem('firebaseIdToken');
          //const id =  currentUser.email;
          const body = { email };
          const reqData= await fetch(`http://localhost:5000/${course_id}/removeinstructor`,
          {
            
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
                body: JSON.stringify(body)
              
        });
        if (reqData.ok) {
          getCourseDetails();
          fetchInstructorOptions();
        } else {
          if(reqData.status === 403){
            window.location = '/login';
          }
        }
        } catch (error) {
          
        }
      }
    
      const rejectRequest = async (email, request_id) => {
        
        try {
          console.log(email);
          const idToken = localStorage.getItem('firebaseIdToken');
          //const id =  currentUser.email;
          const body = { email, request_id };
          const reqData= await fetch(`http://localhost:5000/${course_id}/rejectInstructorRequest`,
          {
            
                method: "PUT",
                headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
                body: JSON.stringify(body)
              
        });
        if (reqData.ok) {
          getCourseDetails();
          fetchInstructorOptions();
          getRequestInstructorsList();
        } else {
          if(reqData.status === 403){
            window.location = '/login';
          }
        }
        } catch (error) {
          
        }
      }
    
      const acceptRequest = async (email, request_id) => {
        
        try {
          console.log(email);
          const idToken = localStorage.getItem('firebaseIdToken');
          //const id =  currentUser.email;
          const body = { email, request_id };
          const reqData= await fetch(`http://localhost:5000/${course_id}/acceptInstructorRequest`,
          {
            
                method: "PUT",
                headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
                body: JSON.stringify(body)
              
        });
        if (reqData.ok) {
          getCourseDetails();
          fetchInstructorOptions();
          getRequestInstructorsList();
        } else {
          if(reqData.status === 403){
            window.location = '/login';
          }
        }
        } catch (error) {
          
        }
      }


  return (
    <>
      <div style={containerStyle}>
        <div className="container">
        {shouldRender? <Header noTitle={true} team_id={  "default"}/> : null}
        </div>
        <Container
          className="d-flex align-items-center justify-content-center mt-5"
          style={{ minHeight: "85vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <Card>
              <Card.Body>
                <h2 className="text-center mb-4">Create New Course</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  
                <Form.Group id="crn">
                    <Form.Label>Course Registration Number (CRN)</Form.Label>
                    <Form.Control type="text" onChange={handleChange} value={crn} required placeholder="Enter the CRN"/>
                  </Form.Group>
                  <br></br>
                  <Form.Group id="course_code">
                    <Form.Label>Course Code</Form.Label>
                    <Form.Control type="text" onChange={(event) =>{setCourseCode(event.target.value)}} value={courseCode} required placeholder="Enter the course code"/>
                  </Form.Group>
                  <br></br>
                  <Form.Group id="course_description">
                    <Form.Label>Title of the Course</Form.Label>
                    <Form.Control type="text" onChange={(event) =>{setCourseTitle(event.target.value)}} value={courseTitle} required placeholder="Enter the course title"/>
                  </Form.Group>
                  <br></br>
                 
                  <Form.Group id="members">
                    <Form.Label>Modality of Classes</Form.Label>
                    <select class="form-select" aria-label="Default select example" value={courseModality} onChange={(event) =>{setCourseModality(event.target.value)}} required>
                    <option selected>Select from options</option>
                    <option value="F2F">Face to Face</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Online">Virtual</option>
                  </select>
                  </Form.Group>
                  <br></br>
                  <Form.Group id="members">
                    <Form.Label>Add other Instructors or TA's</Form.Label>
                    <Multiselect 
                        isObject={false}
                        onRemove={handleInstructorOptionSelect}
                        onSelect={  handleInstructorOptionSelect}
                        options={ processedInstructorOptions }
                        required = {true}               
                        showCheckbox
                        /> 
                  </Form.Group>
                  <br></br>

                  Current Instructors :
                  <ol key={`TM12`}>
                    {courseDetails?.length > 0 ?<> {  courseDetails.instructors.map((instructor,index) =>(
                        <li key= {index} className='li2'>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {instructor.full_name}
                          {currentUser.email != instructor.email ? <>
                            <button className="btn3 ml-1 mb-1" onClick={() => {removeInstructor(instructor.email)}}>
                              <RxCross2 style={{fontSize:'1rem'}}></RxCross2>
                            </button>
                          </>:<></>}
                          </div>
                        </li>

                    ))}</> : <></>}
                  </ol>
                  <br></br>
                  Requests from Instructors to join course :
                  <ol key={`TM1234`}>
                    {requestedInstructorsList.length > 0 ?  requestedInstructorsList.map((instructor,index) =>(
                        <li key= {index} className='li2'>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {instructor.full_name}
            
                           <div>
                           <button className="btn3 ml-1 mb-1 float-right" onClick={() => {rejectRequest(instructor.email, instructor.request_id)}}>
                              <RxCross2 style={{fontSize:'1rem'}}></RxCross2>
                            </button>
                            <button className="btn3 ml-2 mb-1 float-right" onClick={() => {acceptRequest(instructor.email, instructor.request_id)}}>
                              <AiOutlineCheck style={{fontSize:'1rem'}}></AiOutlineCheck>
                            </button>
                            
                            </div>
                            </div>
                        </li>

                    )) : <></> }
                  </ol>
                  
                  <Button  className="btn-warning float-left mt-5"  onClick={()=> {window.location.reload()}}>
                    Discard
                  </Button>
                  <Button className="btn1 float-right mt-5" type="submit">
                    Save Details
                  </Button>
                </Form>
                
              </Card.Body>
             
            </Card>
          </div>
        </Container>
      </div>
      <div>
       <Footer team_id= "default"/>
    </div>  
   </>
  )
}