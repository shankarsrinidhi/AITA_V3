
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
 

export default function EditTeam() {
  
  const { team_id } = useParams();
  const [teamDetails,setTeamDetails] = useState([]);
  const [instructors, setInstructors] = useState([]);
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
  const [currentMembersRefreshCount, setCurrentMembersRefreshCount] = useState(0);
  const [initialMembers, setInitialMembers] = useState([]);
  const [instructorOptions, setInstructorOptions] = useState([]);
  const [selectedInstructorOptions, setSelectedInstructorOptions] = useState([]);
  const [requestedStudentList, setRequestedStudentList] = useState([]);




  

  const handleChange = (event) => {
    setName(event.target.value);
};

const getTeamDetails = async() =>{
try {
    const reqData= await fetch(`http://localhost:5000/teamdetails/${team_id}`,
      {
        
            method: "GET",
            headers: { "Content-Type": "application/json" }
          
    });
    if (reqData.ok) {
      const resData= await reqData.json();
      console.log(resData[0]);
      setTeamDetails(resData[0]);
      setName(resData[0].team_name);
      setIndustry(resData[0].industry);
      setInitialMembers(resData[0].students);
      setTimeout(() => {
        setShouldRender(true);
      }, 500);
      
      console.log(teamDetails?.students);

      
    } else {
      if(reqData.status === 403){
        window.location = '/login';
      }}
    
} catch (error) {
    console.log(error.message);
    
}
}

const getRequestStudentsList = async() =>{
  try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const reqData= await fetch(`http://localhost:5000/requestsToJoinTeam/${team_id}`,
        {
          
              method: "GET",
              headers: { "Content-Type": "application/json" , 'Authorization': `Bearer ${idToken}`}
            
      });
      if (reqData.ok) {
        const resData= await reqData.json();
        console.log(resData);
        setRequestedStudentList(resData);
        console.log(requestedStudentList);
  
        
      } else {
        if(reqData.status === 403){
          window.location = '/login';
        }}
      
  } catch (error) {
      console.log(error.message);
      
  }
  }


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

  //getstudentemails.push(currentUser.email);

    setSelectedStudentOptions(getstudentemails);
    console.log(selectedStudentOptions);
  };

  useEffect(() => {
    fetchStudentOptions();
    getRequestStudentsList();
  }, []);

  const fetchStudentOptions = async () => {
    try {
      const getstudentname=[];
      const idToken = localStorage.getItem('firebaseIdToken');
      const id =  currentUser.email;
      const body = { id };
      const reqData= await fetch(`http://localhost:5000/teamstudentsdropdown/${team_id}`,
      {
        
            method: "POST",
            headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
            body: JSON.stringify(body)
          
    });
    if (reqData.ok) {
      const resData= await reqData.json();
      
      setStudentOptions(resData);
      //console.log(studentOptions);
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
      getTeamDetails();
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


  const processedOptions = studentOptions.map((option) => option.full_name);
  const processedInstructorOptions = instructorOptions.map((option) => option.full_name);


  const removeStudent = async email => {
    
    try {
      console.log(email);
      const idToken = localStorage.getItem('firebaseIdToken');
      //const id =  currentUser.email;
      const body = { email };
      const reqData= await fetch(`http://localhost:5000/${team_id}/removestudent`,
      {
        
            method: "DELETE",
            headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
            body: JSON.stringify(body)
          
    });
    if (reqData.ok) {
      getTeamDetails();
      //refreshCurrentMembers();
      fetchStudentOptions();
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
      const reqData= await fetch(`http://localhost:5000/${team_id}/rejectStudentRequest`,
      {
        
            method: "PUT",
            headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
            body: JSON.stringify(body)
          
    });
    if (reqData.ok) {
      getTeamDetails();
      fetchStudentOptions();
      getRequestStudentsList();
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
      const reqData= await fetch(`http://localhost:5000/${team_id}/acceptStudentRequest`,
      {
        
            method: "PUT",
            headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
            body: JSON.stringify(body)
          
    });
    if (reqData.ok) {
      getTeamDetails();
      fetchStudentOptions();
      getRequestStudentsList();
    } else {
      if(reqData.status === 403){
        window.location = '/login';
      }
    }
    } catch (error) {
      
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    try {
        const body = { name, industry, selectedStudentOptions };
        const idToken = localStorage.getItem('firebaseIdToken');
        const response = await fetch(
          `http://localhost:5000/editTeam/${team_id}`,
          {
            method: "PUT",
            headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
        if (response.ok) {
          //const jsonData = await response.json();
            //console.log(jsonData);
            window.location = `/editTeam/${team_id}`
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
        <br></br>
        {shouldRender? <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "85vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <Card>
              <Card.Body>
                <h2 className="text-center mb-4">Edit Team</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  
                  <Form.Group id="name">
                    <Form.Label>Team Name</Form.Label>
                    <Form.Control type="text" onChange={handleChange} value={name} required placeholder="Enter a Team Name"/>
                  </Form.Group>
                  <br></br>

                  <Form.Group id="industry">
                    <Form.Label>Industry/Domain of the Project</Form.Label>
                    <Form.Control type="text" onChange={handleChangeIndustry} value={industry} required placeholder="Enter the domain of the project"/>
                  </Form.Group>


                  <br></br>
                  <Form.Group id="members">
                    <Form.Label>Add Teammates</Form.Label>
                    <Multiselect 
                        isObject={false}
                        onRemove={handleStudentOptionSelect}
                        onSelect={  handleStudentOptionSelect}
                        options={ processedOptions }
                        required = {true}               
                        showCheckbox
                        
                        
                        /> 
                    
                  </Form.Group>
                  <br></br>
                  Current Team members :
                  <ol key={`TM${currentMembersRefreshCount}`}>
                    {  teamDetails?.students.map((student,index) =>(
                        <li key= {index} className='li2'>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {student.full_name}
                          {currentUser.email != student.email ? <>
                            <button className="btn3 ml-1 mb-1" onClick={() => {removeStudent(student.email)}}>
                              <RxCross2 style={{fontSize:'1rem'}}></RxCross2>
                            </button>
                          </>:<></>}
                          </div>
                        </li>

                    ))}
                  </ol>
                  <br></br>
                  Requests to join team :
                  <ol key={`TM123`}>
                    {requestedStudentList.length > 0 ?  requestedStudentList.map((student,index) =>(
                        <li key= {index} className='li2'>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {student.full_name}
            
                           <div>
                           <button className="btn3 ml-1 mb-1 float-right" onClick={() => {rejectRequest(student.email, student.request_id)}}>
                              <RxCross2 style={{fontSize:'1rem'}}></RxCross2>
                            </button>
                            <button className="btn3 ml-2 mb-1 float-right" onClick={() => {acceptRequest(student.email, student.request_id)}}>
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
        </Container> :<></>}
      </div>
      <div>
       <Footer team_id={team_id !== "default" ? team_id : (teams.length > 0 ?  teams[0].team_id : "default")}/>
    </div>  
   </>
  )
}