import React, { Fragment, useEffect, useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import EditObjective from "./EditObjective";
import AddKR from "./AddKR";

//import DeleteObjective from "./DeleteObjective";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

//import AddObjective from "./AddObjective";

import EditTodo from "./EditTodo";
import DeleteObjective from "./DeleteObjective";
import EditKR from "./EditKR";
import DeleteKR from "./DeleteKR";

const ListTodos = () => {
  const [todos, setTodos] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [krShown, setKrShown] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //delete todo function

  const deleteTodo = async id => {
    try {
      const deleteTodo = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE"
      });

      setTodos(todos.filter(todo => todo.todo_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteObjective = async objective_id => {
    try {
      const deleteObjective = await fetch(`http://localhost:5000/1/objectives/${objective_id}`, {
        method: "DELETE"
      });

      updateData();
      handleClose();
    } catch (err) {
      console.error(err.message);
    }
  };

  const getTodos = async () => {
    try {
      const response = await fetch("http://localhost:5000/todos");
      const jsonData = await response.json();
      

      setTodos(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  console.log(todos);

  const getObjectives = async () => {
    try {
      const response = await fetch("http://localhost:5000/1/objectives/check");
      const jsonData = await response.json();
      

      setObjectives(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getObjectives();
  }, []);
  console.log(objectives);


  const updateData = async () => {
    try {
      const response = await fetch("http://localhost:5000/1/objectives/check");
      const jsonData = await response.json();
      

      setObjectives(jsonData);
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
      


      <table class="table mt-3">
        
        <tbody>
          {/*<tr>
            <td>John</td>
            <td>Doe</td>
            <td>john@example.com</td>
          </tr> */}
          
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
                <EditObjective objective={objective} updateData = {updateData} ></EditObjective>
              </td>
              <td className ="expand">
                <DeleteObjective objective={objective} updateData = {updateData} ></DeleteObjective>
              </td>
              
              {/*<td>
                <EditTodo todo={todo} />
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTodo(todo.todo_id)}
                >
                  Delete
                </button>
          </td>*/}

            </tr>
              {krShown.includes(objective.objective.objective_id) && (
                <tr>
                  
                  <td colSpan="2" style={{paddingLeft:"2rem"}}>
                   <h5 colSpan="2" style={{color:"#8f0000"}}>Description</h5>
                    {objective.objective.description}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5 style={{color:"#8f0000", marginTop:"1.5rem"}}>Key Results</h5>
                      
                      <AddKR updateData={updateData} objective = {objective}></AddKR>
                    </div>
                    
                    <table className="table mt-3">
                      <tbody>
                          
                          {objective.objective.keyresults.map((kr,index) => (
                            
                            <tr key={kr.kr_id}>
                              {kr.kr_id? (<>
                                
                                  <td className = "expand">{index+1}</td>
                                  <td style={{paddingLeft:"2rem"}}>{kr.key_result}</td>
                                  
                                  <td className = "expand">
                                    <EditKR objective={objective} kr={kr} updateData={updateData}></EditKR>
                                  </td>
                                  <td className = "expand">
                                    <DeleteKR objective={objective} kr={kr} updateData={updateData}></DeleteKR>
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
      </table>
    </Fragment>
  );
};

export default ListTodos;
