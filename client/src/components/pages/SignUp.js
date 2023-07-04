
import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { AuthProvider, useAuth } from "../../contexts/AuthContext"
import { Link, useNavigate } from 'react-router-dom'
import { Container } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import pamplinlogo from '../logo-images/pamplin.png';
//import backgroundImage from '../logo-images/huddle.png';

const containerStyle = {
    backgroundImage: `url('./logo-images/huddle.png')`,
    opacity: 1,
  };

const divStyle = {
    color: 'red',
    backgroundColor: 'blue',
    fontSize: '24px'
  };
  
  const pamplin = {
  
  width: '18rem',
  height: '5.5rem',
  padding: '0.75rem',
  align : 'center'
 
  };
  
export default function SignUp() {
    
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const phoneRef = useRef()
    
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      const email = emailRef.current.value;
      const firstName= firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const phone = phoneRef.current.value;
      
      const body = { email, phone, firstName, lastName };
      const response = await fetch(
        `http://localhost:5000/student/new`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      navigate("/login")
    } catch {
      setError("Failed to create an account")
    }

    setLoading(false)
  }

  return (
    <>
    <div style={containerStyle}>
    <div className="container">
    <header>
        <head><link href="client/src/assets/fontawesome-free-6.4.0-web/css/solid.css" rel="stylesheet"/></head>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img className= "mt-2 align-center" src={pamplinlogo} style={pamplin} /> 
        <br></br>
        </div>
        <div>
        
      </div>
    </header>
    </div>

    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "85vh" }}
    >
        
      <div className="w-100" style={{ maxWidth: "400px" }}>
      <h1 className="centered" style={{ marginTop: '2rem', color: "#8f0000", fontFamily:'fantasy', padding:"2%", opacity:'85%', boxShadow:'0px 0px 5px' }}>BRAIN HUDDLE</h1>
      
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4" style={{fontFamily:'Gruppo'}}>Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
          <Form.Group id="first_name">
              <Form.Label>Given Name</Form.Label>
              <Form.Control type="text" ref={firstNameRef} required />
            </Form.Group>
            <Form.Group id="last_name">
              <Form.Label>Surname</Form.Label>
              <Form.Control type="text" ref={lastNameRef} required />
            </Form.Group>
            <Form.Group id="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" ref={phoneRef} required />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            
            <Button disabled={loading} className="w-100 mt-5" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
      </div>
      </Container>
      </div>
    </>
    
  )
}