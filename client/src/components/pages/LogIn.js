
import React, { useRef, useState, useEffect, useContext } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useNavigate } from 'react-router-dom'
import { Container } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import pamplinlogo from '../logo-images/pamplin.png';
import { TeamContext } from '../../contexts/TeamContext';
import { CourseContext } from "../../contexts/CourseContext";

//Styling for the page
const containerStyle = {
    backgroundPosition:'center',
    backgroundSize:'cover',
    opacity: 1,
    height:'100%',
    position:'relative'
};
  
const pamplin = {
  width: '18rem',
  height: '5.5rem',
  padding: '0.75rem',
  align : 'center'
};
 

export default function LogIn() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [userDetails, setUserDetails ] = useState([]);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth()
  const {teams, setTeams} = useContext(TeamContext);
  const {courses, setCourses } = useContext(CourseContext);

  

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError("")
      setLoading(true)
      const userCredential = await login(emailRef.current.value, passwordRef.current.value); 
        // User login successful
        const user = userCredential.user;
        // Access the ID token
         const idToken = user && await user.getIdToken();
        // Store the ID token in local storage or state
        localStorage.setItem('firebaseIdToken', idToken);

      //navigate("/home/default");
    } catch {
      setError("Failed to log in")
    }
    await getUserDetails();
    setLoading(false);
  }

  const getUserDetails = async e => {
    try {

      const idToken = localStorage.getItem('firebaseIdToken');
      const id = await currentUser?.email; 
      if (!id) {
        return;
      }
      const body = { id };
      const response = await fetch(
        `http://localhost:5000/fetchUserDetails`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
          
        }
      );
      if (response.ok) {
        const jsonData = await response.json();
        console.log(jsonData[0]);
        setUserDetails(jsonData);

        if (jsonData[0].new) {
          navigate("/newuser");
        } else {
          if (jsonData[0].type === "instructor") {
            await getCourses();

          } else if (jsonData[0].type === "student"){
            await getTeams();
           
          }
        }
      } else {
        if(response.status === 403){
          window.location = '/login';
        }
      }
      

    } catch (err) {
      console.error(err.message);
    }
  };

  const getCourses = async e => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const id =  currentUser.email;
      const body = { id };
      const response = await fetch(
        `http://localhost:5000/courses`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      if (response.ok) {
        const jsonData = await response.json();
        console.log(jsonData);
        await setCourses(jsonData);
        
        console.log(courses);
        if (jsonData?.length < 1){
          navigate("/teammanagement/instructor");
        }
        else{
          navigate(`/InstHome/${jsonData[0]?.course_id}`);

        }

      } else {
        if(response.status === 403){
          window.location = '/login';
        }
      }

    } catch (err) {
      console.error(err.message);
    }
  };

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
        console.log(jsonData);
        await setTeams(jsonData);
        
        console.log(courses);
        if (jsonData?.length < 1){
          navigate("/teammanagement/student");
        }
        else{
          navigate(`/home/${jsonData[0]?.team_id}`);

        }

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
    <head><link href="client/src/assets/fontawesome-free-6.4.0-web/css/solid.css" rel="stylesheet"/></head>
      <div style={containerStyle}>
      
        <div style={{width:'100%', backgroundColor:"white"}}>
          
              
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width:'100%' }}>
              <img className= "mt-2 align-center" src={pamplinlogo} style={pamplin} /> 
              <br></br>
              </div>
          
        </div>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "85vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <h1 className="centered" style={{ marginTop: '2rem', color: "#8f0000", fontFamily:'fantasy', padding:"2%", opacity:'100%', boxShadow:'0px 0px 5px', backgroundColor:'white' }}>ENDEAVORS</h1>
            <Card>
              <Card.Body>
                <h2 className="text-center mb-4">Log In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                  </Form.Group>
                  <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                  </Form.Group>
                  <Button disabled={loading} className="w-100 mt-5" type="submit">
                    Log In
                  </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
              </Card.Body>
              <div className="w-100 text-center  mb-2">
                Or create a new account <Link to="/signup">Sign Up</Link>
              </div>
            </Card>
          </div>
        </Container>
      </div>
   </>
  )
}