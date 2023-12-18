import React, { Fragment, useState, useEffect, useContext } from "react";
import { useAuth } from "../../../contexts/AuthContext"
import { TeamContext } from '../../../contexts/TeamContext';
import { IoIosAddCircleOutline } from "react-icons/io";
import { Button, Card, Alert, Container } from "react-bootstrap"


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


  const { currentUser } = useAuth()
  const { setTeams } = useContext(TeamContext);
  const [error, setError] = useState("");
  const [teamsList, setTeamsList] = useState([]);
  const [requestedTeamsList, setRequestedTeamsList] = useState([]);
  const [ledTeamsList, setLedTeamsList] = useState([]);

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

  const getRequestedTeamsList = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const email =  currentUser.email;
      const body = { email };
      const response = await fetch(
        `http://localhost:5000/course/requestedTeams`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

      
      const jsonData = await response.json();
      setRequestedTeamsList(jsonData);

    } catch (err) {
      console.error(err.message);
    }
  };

  const getLedTeamsList = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const email =  currentUser.email;
      const body = { email };
      const response = await fetch(
        `http://localhost:5000/course/ledTeams`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

      
      const jsonData = await response.json();
      setLedTeamsList(jsonData);

    } catch (err) {
      console.error(err.message);
    }
  };

  

  useEffect(() => {
    getTeamsList();
    getLedTeamsList();
    getRequestedTeamsList();
  }, []);


  const requestToJoinTeam = async (team_id) => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const email =  currentUser.email;
      const body = { email };
      const response = await fetch(
        `http://localhost:5000/${team_id}/requestToJoin`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (response.ok) {
          const jsonData = await response.json();
          getRequestedTeamsList();
          getTeamsList();
        } else {
          if(response.status === 403){
            window.location = '/login';
          }
        }

    } catch (err) {
      console.error(err.message);
    }
  }

  const cancelRequest = async (team_id) => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const email =  currentUser.email;
      const body = { email };
      const response = await fetch(
        `http://localhost:5000/${team_id}/cancelRequest`,
        {
          method: "PUT",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (response.ok) {
          const jsonData = await response.json();
          getRequestedTeamsList();
          getTeamsList();
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
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('tr');
  
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
                        <input type="text" id="myInput" onKeyUp={() => filterFunction()} placeholder="Search with team names" style={filterStyle}/>
                        
                            <table id="myUL" className="table mt-3">
                            <tbody>
                              {teamsList?.map((team, index) => (
                                <tr>
                                <th scope="row">{index+1}</th>
                                <td>{team.team_name}</td>
                                <td>
                                    <Button className="btn-success float-right" onClick={() => {requestToJoinTeam(team.team_id)}}>Request to join</Button>
                                </td>
                                </tr>
                              ))}
                              {teamsList.length >0 ? <></> : <>No Data to show</>}
                                
                            </tbody>
                            </table>
                  </Card.Body>
                </Card>
                <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
                <h4 style={{color:'#8F0000', fontFamily: 'Lato'}} className="text-center">Teams Requested to Join</h4>
                <Card className=" mt-4">
                  <Card.Body>
                <table id="requestedTeams" className="table mt-3">
                            <tbody>
                              {requestedTeamsList?.map((team, index) => (
                                <tr>
                                <th scope="row">{index+1}</th>
                                <td>{team.team_name}</td>
                                <td>
                                    <Button className="btn-warning float-right" onClick = {() => cancelRequest(team.team_id)}>Cancel Request</Button>
                                </td>
                                </tr>
                              ))}
                              {requestedTeamsList.length >0 ? <></> : <>No Data to show</>}
                                
                            </tbody>
                            </table>
                            </Card.Body>
                            </Card>
                <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
                <h4 style={{color:'#8F0000', fontFamily: 'Lato'}} className="text-center">Teams lead by you</h4>
                <Card className=" mt-4">
                  <Card.Body>
                        <table id="LedTeams" className="table mt-3">
                            <tbody>
                              {ledTeamsList?.map((team, index) => (
                                <tr>
                                <th scope="row">{index+1}</th>
                                <td>{team.team_name}</td>
                                <td>
                                    <Button className="btn float-right" style={{backgroundColor:'gray'}} onClick = {() => window.location = `/editTeam/${team.team_id}`}>Edit Team</Button>
                                </td>
                                </tr>
                              ))}
                              {ledTeamsList.length >0 ? <></> : <>No Data to show</>}
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