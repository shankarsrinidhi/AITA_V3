import React, { Fragment, useState, useEffect, useContext } from "react";
import Header from "../views/Header";
import Footer from "../views/Footer";
import { useAuth } from "../../contexts/AuthContext"
import { TeamContext } from '../../contexts/TeamContext';
import { useParams } from 'react-router-dom';
import { IoIosAddCircleOutline } from "react-icons/io";
import { Form, Button, Card, Alert, Container } from "react-bootstrap"


export default function StudentTeamManagement() {


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
  const [shouldRender, setShouldRender] = useState(false);

  

  const { currentUser, logout } = useAuth()
  const {teams, setTeams,  selectedTeam, count} = useContext(TeamContext);
  const [error, setError] = useState("");
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
        setTeams(jsonData);
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
    getTeams();
  },[]);


// Simulating a delay before rendering the component
setTimeout(() => {
  setShouldRender(true);
}, 500);

  const { team_id } = useParams();
  
  const [welcome, setWelcome] = useState(true);
  const [courseList, setCourseList] = useState([]);
 
  const [teamsList, setTeamsList] = useState([]);

  const getTeamsList = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const email =  currentUser.email;
      const body = { email };
      const response = await fetch(
        `http://localhost:5000/course/allTeams`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

      
      const jsonData = await response.json();
      setTeamsList(jsonData);

    } catch (err) {
      console.error(err.message);
    }
  };

  

  useEffect(() => {
    getTeamsList();
  }, []);

  const [selectedOption, setSelectedOption] = useState('');
  const [showTeams, setShowTeams] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCloseError = () => setShowError(false);

  const handleShowError = () => setShowError(true);

  const [selectedOptionCourse, setSelectedOptionCourse] = useState('');

  const handleOptionChangeCourse = (event) => {
    setSelectedOptionCourse(event.target.value);
  };

  const continueToNextScreen = (event) => {
    if (selectedOption === "" || (selectedOption === "student" && selectedOptionCourse === "")){
      handleShowError();
      return;
     }
    setShowTeams(true);
  };


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
    
<><h4 style={{fontFamily: 'Lato' }} className="mt-5 text-center">You are currently not added to any team. You can create a new team</h4>

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button style={{ borderRadius: '10px', padding: '10px 20px' , margin:'2rem', backgroundColor:'#8f0000', color :'white', borderColor:'white'}} onClick={() => {window.location ='/newTeam/default'}}><IoIosAddCircleOutline style={{fontSize:'1.5rem', marginRight:"0.5rem"}}></IoIosAddCircleOutline>Create New Team</button>
</div>
<h4 style={{fontFamily: 'Lato' }} className="text-center">Or request to join an existing team</h4>




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
                <input type="text" id="myInput" onKeyUp={() => filterFunction()} placeholder="Search with team names" style={filterStyle}/>
                 
                    <table id="myUL" className="table mt-3">
                    <tbody>
                      {teamsList?.map((team, index) => (
                        <tr>
                        <th scope="row">{index+1}</th>
                        <td>{team.team_name}</td>
                        <td>
                            <Button className="btn-success float-right">Request to join</Button>
                        </td>
                        </tr>
                      ))}
                      {teamsList.length >0 ? <></> : <>No Data to show</>}
                        
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