import React, { Fragment, useState, useEffect, useContext } from "react";
import { useAuth } from "../../contexts/AuthContext"
import { IoIosAddCircleOutline } from "react-icons/io";
import { Form, Button, Card, Alert, Container } from "react-bootstrap"


export default function InstructorTeamManagement() {


const containerStyle = {
    backgroundPosition:'center',
    backgroundSize:'cover',
    opacity: 1,
    height:'100%',
    position:'relative'
};

const filterStyle = {
    backgroundImage: "url('/css/searchicon.png')",
    backgroundPosition: '10px 12px', 
    backgroundRepeat: 'no-repeat', 
    width: '100%', 
    fontSize: '16px',
    padding: '12px 20px 12px 40px',
    border: '1px solid #ddd',
    marginBottom: '12px',
  
}

  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [requestedCourseList, setRequestedCourseList] = useState([]);
  const [ledCoursesList, setLedCoursesList] = useState([]);


  const getCourseList = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const email =  currentUser.email;
      const body = { email };
      const response = await fetch(
        `http://localhost:5000/unrequestedCourses`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body : JSON.stringify(body)
        });

      const jsonData = await response.json();
      setCourseList(jsonData);

    } catch (err) {
      console.error(err.message);
    }
  };

  const getRequestedCourseList = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const email =  currentUser.email;
      const body = { email };
      const response = await fetch(
        `http://localhost:5000/requestedCourses`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

      
      const jsonData = await response.json();
      setRequestedCourseList(jsonData);

    } catch (err) {
      console.error(err.message);
    }
  };

  const getLedCoursesList = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const email =  currentUser.email;
      const body = { email };
      const response = await fetch(
        `http://localhost:5000/ledCourses`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

      
      const jsonData = await response.json();
      setLedCoursesList(jsonData);

    } catch (err) {
      console.error(err.message);
    }
  };


  useEffect(() => {
    getCourseList();
    getLedCoursesList();
    getRequestedCourseList();
  }, []);

  const requestToJoinCourse = async (course_id) => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const email =  currentUser.email;
      const body = { email };
      const response = await fetch(
        `http://localhost:5000/${course_id}/requestToJoinCourse`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (response.ok) {
          const jsonData = await response.json();
          getRequestedCourseList();
          getCourseList();
        } else {
          if(response.status === 403){
            window.location = '/login';
          }
        }

    } catch (err) {
      console.error(err.message);
    }
  }

  const cancelRequest = async (course_id) => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const email =  currentUser.email;
      const body = { email };
      const response = await fetch(
        `http://localhost:5000/${course_id}/cancelRequestCourse`,
        {
          method: "PUT",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (response.ok) {
          const jsonData = await response.json();
          getRequestedCourseList();
          getCourseList();
        } else {
          if(response.status === 403){
            window.location = '/login';
          }
        }

    } catch (err) {
      console.error(err.message);
    }
  }

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
 



  return(
  <Fragment>
    
<><h4 style={{fontFamily: 'Lato' }} className="mt-5 text-center">You are currently not added to any courses. You can create a new course</h4>

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button style={{ borderRadius: '10px', padding: '10px 20px' , margin:'2rem', backgroundColor:'#8f0000', color :'white', borderColor:'white'}} onClick={() => {window.location ='/newCourse/default'}}><IoIosAddCircleOutline style={{fontSize:'1.5rem', marginRight:"0.5rem"}}></IoIosAddCircleOutline>Create New Course</button>
</div>
<h4 style={{fontFamily: 'Lato' }} className="text-center">Or request to join an existing course</h4>

<div style={containerStyle}>
<Container
      className="d-flex  justify-content-center mt-5"
      style={{ minHeight: "85vh" }}
    >
      <div className="w-100" style={{ maxWidth: "800px" }}>
        <Card>
          <Card.Body>
            
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={()=>{}}>
             
              <Form.Group id="members">
                <input type="text" id="myInput" onKeyUp={() => filterFunction()} placeholder="Search existing courses" style={filterStyle}/>
                 
                    <table id="myUL" className="table mt-3">
                    <tbody>
                      {courseList?.map((course, index) => (
                        <tr>
                        <th scope="row">{index+1}</th>
                        <td>{course.course_code} - {course.course_description}</td>
                        <td>
                            <Button className="btn-success float-right" onClick={() => {requestToJoinCourse(course.course_id)}}>Request to join</Button>
                        </td>
                        </tr>
                      ))}
                      {courseList.length >0 ? <></> : <>No Data to show</>}
                        
                    </tbody>
                    </table>
               </Form.Group>
            </Form>
          </Card.Body>
        </Card>

        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        <h4 style={{color:'#8F0000', fontFamily: 'Lato'}} className="text-center">Courses Requested to Join</h4>
        <Card className=" mt-4">
          <Card.Body>
              <table id="requestedTeams" className="table mt-3">
                    <tbody>
                      {requestedCourseList?.map((course, index) => (
                        <tr>
                        <th scope="row">{index+1}</th>
                        <td>{course.course_code} - {course.course_description}</td>
                        <td>
                            <Button className="btn-warning float-right" onClick = {() => cancelRequest(course.course_id)}>Cancel Request</Button>
                        </td>
                        </tr>
                      ))}
                      {requestedCourseList.length >0 ? <></> : <>No Data to show</>}
                    </tbody>
              </table>
          </Card.Body>
        </Card>
        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        <h4 style={{color:'#8F0000', fontFamily: 'Lato'}} className="text-center">Courses lead by you</h4>
        <Card className=" mt-4">
          <Card.Body>
                <table id="LedTeams" className="table mt-3">
                    <tbody>
                      {ledCoursesList?.map((course, index) => (
                        <tr>
                        <th scope="row">{index+1}</th>
                        <td>{course.course_code} - {course.course_description}</td>
                        <td>
                            <Button className="btn float-right" style={{backgroundColor:'gray'}} onClick = {() => {}}>Edit Course</Button>
                        </td>
                        </tr>
                      ))}
                      {ledCoursesList.length >0 ? <></> : <>No Data to show</>}
                    </tbody>
                </table>
            </Card.Body>
         </Card>
        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>

      </div>
    </Container>
</div></> 
  </Fragment>
  )
  }