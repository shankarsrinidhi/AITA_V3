import React, { Fragment, useEffect, useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import EditObjective from "./EditObjective";
import AddKR from "./AddKR";
import DeleteObjective from "./DeleteObjective";
import EditKR from "./EditKR";
import DeleteKR from "./DeleteKR";

const ListTodos = ({team_id}) => {
  const [objectives, setObjectives] = useState([]);
  const [krShown, setKrShown] = useState([]);

  const getObjectives = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const response = await fetch(`http://localhost:5000/${team_id}/objectives/check`,
      {
        method: "GET",
        headers: { 'Authorization': `Bearer ${idToken}` }
    });
    if (response.ok) {
      const jsonData = await response.json();
      setObjectives(jsonData);
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
    getObjectives();
  }, []);

  const updateData = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const response = await fetch(`http://localhost:5000/${team_id}/objectives/check`,
      {
        method: "GET",
        headers: { 'Authorization': `Bearer ${idToken}` }
    });
    if (response.ok) {
      const jsonData = await response.json();
      setObjectives(jsonData);
    } else {
      if(response.status === 403){
        window.location = '/login';
      }
    }
      
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };

  const toggleShown = objective_id => {
    const shownState = krShown.slice();
    const index = shownState.indexOf(objective_id);
    if (index >= 0){
      shownState.splice(index, 1);
      setKrShown(shownState);
    }
    else{
      shownState.push(objective_id);
      setKrShown(shownState);
    }
  }

  return (
    <Fragment>
      {objectives.length < 1 ? 
            (<>
                <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
                <h6 className="ml-3">You have not added any objectives yet.</h6>
                <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            </>) :
      <table className="table mt-3">
        <tbody>
          {objectives.map(objective => (
            <Fragment>
            <tr key={objective.objective.objective_id}>
              <td className ="expand">
                <button className="btn3 float-left" onClick = {() => toggleShown(objective.objective.objective_id)}>
                  <MdOutlineArrowForwardIos style={{fontSize:'0.75rem'}}></MdOutlineArrowForwardIos>
                </button>
              </td>
              <td>{objective.objective.objective_title}</td>
              <td className ="expand">
                <EditObjective team_id={team_id} objective={objective} updateData = {updateData} ></EditObjective>
              </td>
              <td className ="expand">
                <DeleteObjective team_id={team_id} objective={objective} updateData = {updateData} ></DeleteObjective>
              </td>
            </tr>
              {krShown.includes(objective.objective.objective_id) && (
                <tr>
                  <td colSpan="2" style={{paddingLeft:"2rem"}}>
                   <h5 colSpan="2" style={{color:"#8f0000"}}>Description</h5>
                    {objective.objective.description}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5 style={{color:"#8f0000", marginTop:"1.5rem"}}>Key Results</h5>
                      <AddKR team_id={team_id} updateData={updateData} objective = {objective}></AddKR>
                    </div>
                    <table className="table mt-3">
                      <tbody>
                          {objective.objective.keyresults.map((kr,index) => (
                            <tr key={kr.kr_id}>
                              {kr.kr_id? (
                              <>
                                  <td className = "expand">{index+1}</td>
                                  <td style={{paddingLeft:"2rem"}}>{kr.key_result}</td>
                                  <td className = "expand">
                                    <EditKR team_id={team_id} objective={objective} kr={kr} updateData={updateData}></EditKR>
                                  </td>
                                  <td className = "expand">
                                    <DeleteKR team_id={team_id} objective={objective} kr={kr} updateData={updateData}></DeleteKR>
                                  </td>
                              </>):(
                                  <td colSpan="3">
                                    <h6 style={{ marginLeft:"1.5rem"}}>No Key Results added</h6>
                                  </td>)}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </td>
                </tr>)
              }
            </Fragment>
      ))}
        </tbody>
      </table>}
    </Fragment>
  );
};

export default ListTodos;
