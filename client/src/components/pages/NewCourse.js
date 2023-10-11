
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


//Styling for the page
const containerStyle = {
    backgroundPosition:'center',
    backgroundSize:'cover',
    opacity: 1,
    height:'100%',
    position:'relative'
};
 

export default function NewCourse() {
  const { team_id } = useParams();
  const [shouldRender, setShouldRender] = useState(false);
  const { currentUser, logout } = useAuth()
  const [name, setName] = useState("");
  const [error, setError] = useState("")
  const navigate = useNavigate();
  const {teams, setTeams} = useContext(TeamContext);
  const [instructorOptions, setInstructorOptions] = useState([]);
  const [selectedInstructorOptions, setSelectedInstructorOptions] = useState([]);


  setTimeout(() => {
    setShouldRender(true);
  }, 500);

  const handleChange = (event) => {
    setName(event.target.value);
};
 

  const handleInstructorOptionSelect = (event) => {
    const getinstructoremails = [];
    const selectedEmails = event.map((selectedName) => {
      const selectedInstructor = instructorOptions.find(
        (instructor) => instructor.full_name === selectedName
      );
      getinstructoremails.push(selectedInstructor.email) ;
    });
  
    //getinstructoremails.push(currentUser.email);
  
      setSelectedInstructorOptions(getinstructoremails);
      console.log(getinstructoremails);
    };
  
    useEffect(() => {
      fetchInstructorOptions();
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
      
    } 


  return (
    <>
      <div style={containerStyle}>
        <div className="container">
        {shouldRender? <Header noTitle={true} team_id={ team_id !== "default" ? team_id : (teams?.length > 0 ?  teams[0]?.team_id : "default")}/> : null}
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
                    <Form.Control type="text" onChange={handleChange} value={name} required placeholder="Enter the CRN"/>
                  </Form.Group>
                  <br></br>
                  <Form.Group id="course_code">
                    <Form.Label>Course Code</Form.Label>
                    <Form.Control type="text" onChange={handleChange} value={name} required placeholder="Enter the course code"/>
                  </Form.Group>
                  <br></br>
                  <Form.Group id="course_description">
                    <Form.Label>Title of the Course</Form.Label>
                    <Form.Control type="text" onChange={handleChange} value={name} required placeholder="Enter the course title"/>
                  </Form.Group>
                  <br></br>
                 
                  <Form.Group id="members">
                    <Form.Label>Modality of Classes</Form.Label>
                    <select class="form-select" aria-label="Default select example">
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
       <Footer team_id={team_id !== "default" ? team_id : (teams.length > 0 ?  teams[0].team_id : "default")}/>
    </div>  
   </>
  )
}