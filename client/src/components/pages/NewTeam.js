
import React, { useRef, useState, useEffect, useContext } from "react"
import { useParams } from 'react-router-dom';
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useNavigate } from 'react-router-dom'
import { Container } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import pamplinlogo from '../logo-images/pamplin.png';
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
 

export default function NewTeam() {
  const { team_id } = useParams();
  const [shouldRender, setShouldRender] = useState(false);
  const { currentUser, logout } = useAuth()
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const {teams, setTeams} = useContext(TeamContext);
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedStudentOptions, setSelectedStudentOptions] = useState([]);
  const [instructorOptions, setInstructorOptions] = useState([]);
  const [selectedInstructorOptions, setSelectedInstructorOptions] = useState([]);


  setTimeout(() => {
    setShouldRender(true);
  }, 500);

  const handleChange = (event) => {
    setName(event.target.value);
};

const handleChangeIndustry = (event) => {
  setIndustry(event.target.value);
};

const handleStudentOptionSelect = (event) => {
  const getstudentemails = [];
  //console.log(event);
  const selectedEmails = event.map((selectedName) => {
    const selectedStudent = studentOptions.find(
      (student) => student.full_name === selectedName
    );
    getstudentemails.push(selectedStudent.email) ;
  });

  getstudentemails.push(currentUser.email);

    setSelectedStudentOptions(getstudentemails);
    console.log(selectedStudentOptions);
  };

  useEffect(() => {
    fetchStudentOptions();
  }, []);

  const fetchStudentOptions = async () => {
    try {
      const getstudentname=[];
      const idToken = localStorage.getItem('firebaseIdToken');
      const id =  currentUser.email;
      const body = { id };
      const reqData= await fetch(`http://localhost:5000/fullstudentsdropdown`,
      {
        
            method: "POST",
            headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
            body: JSON.stringify(body)
          
    });
    if (reqData.ok) {
      const resData= await reqData.json();
      
      setStudentOptions(resData);
      console.log(studentOptions);
    } else {
      if(reqData.status === 403){
        window.location = '/login';
      }
    }
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };


  const handleInstructorOptionSelect = (event) => {
    const getinstructoremails = [];
    //console.log(event);
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
        const getinstructorname=[];
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
        console.log(instructorOptions);
      } else {
        if(reqData.status === 403){
          window.location = '/login';
        }
      }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

  const processedStudentOptions = studentOptions.map((option) => option.full_name);
  const processedInstructorOptions = instructorOptions.map((option) => option.full_name);

  const handleSubmit = async e => {
    e.preventDefault();
    if (selectedStudentOptions.length < 1) {
        alert("Please add at least one team member");
        return;
      }
      
    try {
        const body = { name, industry, selectedStudentOptions, selectedInstructorOptions };
        const idToken = localStorage.getItem('firebaseIdToken');
        const response = await fetch(
          `http://localhost:5000/newTeam`,
          {
            method: "POST",
            headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
        if (response.ok) {
          const jsonData = await response.json();
            console.log(jsonData);
          navigate(`/home/${jsonData.team_id}`)
        } else {
          if(response.status === 403){
            window.location = '/login';
          }
        }
     
      
    } catch (err) {
      console.error(err.message);
    }
  };


  return (
    <>
      <div style={containerStyle}>
        <div className="container">
        {shouldRender? <Header noTitle={true} team_id={ team_id !== "default" ? team_id : (teams?.length > 0 ?  teams[0]?.team_id : "default")}/> : null}
        </div>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "85vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <Card>
              <Card.Body>
                <h2 className="text-center mb-4">Create New Team</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  
                  <Form.Group id="name">
                    <Form.Label>Team Name</Form.Label>
                    <Form.Control type="text" onChange={handleChange} value={name} required placeholder="Enter a Team Name"/>
                  </Form.Group>


                  <br></br>
                  <Form.Group id="members">
                    <Form.Label>Add Teammates</Form.Label>
                    <Multiselect 
                        isObject={false}
                        onRemove={handleStudentOptionSelect}
                        onSelect={  handleStudentOptionSelect}
                        options={ processedStudentOptions }
                        required = {true}               
                        showCheckbox
                        
                        
                        /> 
                    
                  </Form.Group>
                  <br></br>
                  {/*<Form.Group id="members">
                    <Form.Label>Add your Instructor</Form.Label>
                    <Multiselect 
                        isObject={false}
                        onRemove={handleInstructorOptionSelect}
                        onSelect={  handleInstructorOptionSelect}
                        options={ processedInstructorOptions }
                        required = {true}               
                        showCheckbox
                        
                        
                        /> 
                    
                  </Form.Group>
                  <br></br>*/}
                  <Form.Group id="industry">
                    <Form.Label>Industry of the Project</Form.Label>
                    <Form.Control type="text" onChange={handleChangeIndustry} value={industry} required placeholder="e.g. Finance"/>
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