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


  const getCourseList = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const email =  currentUser.email;
      const response = await fetch(
        `http://localhost:5000/courses`,
        {
          method: "GET",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" }
        });

      const jsonData = await response.json();
      setCourseList(jsonData);

    } catch (err) {
      console.error(err.message);
    }
  };


  useEffect(() => {
    getCourseList();
  }, []);

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
                            <Button className="btn-success float-right">Request to join</Button>
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
      </div>
    </Container>
</div></> 
  </Fragment>
  )
  }