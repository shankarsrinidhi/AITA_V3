
import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useNavigate } from 'react-router-dom'
import { Container } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import pamplinlogo from '../logo-images/pamplin.png';

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
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      navigate("/")
    } catch {
      setError("Failed to log in")
    }
    setLoading(false)
  }

  return (
    <>
      <div style={containerStyle}>
        <div style={{width:'100%', backgroundColor:"white"}}>
          <header>
              <head><link href="client/src/assets/fontawesome-free-6.4.0-web/css/solid.css" rel="stylesheet"/></head>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width:'100%' }}>
              <img className= "mt-2 align-center" src={pamplinlogo} style={pamplin} /> 
              <br></br>
              </div>
          </header>
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