import React, { Fragment, useEffect, useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { MdOutlineModeEditOutline } from "react-icons/md"; 
import { AiOutlineDelete } from "react-icons/ai";
import EditObjective from "./EditObjective";
//import AddObjective from "./AddObjective";

import EditTodo from "./EditTodo";

const ListTodos = () => {
  const [todos, setTodos] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [krShown, setKrShown] = useState([]);

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
      {" "}


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
                {/*<button className="btn3 float-right">
                  <MdOutlineModeEditOutline style={{fontSize:'1.25rem'}}></MdOutlineModeEditOutline>
          </button>*/}
                <EditObjective objective={objective}></EditObjective>
              </td>
              <td className ="expand">
                <button className="btn3 float-right">
                  <AiOutlineDelete style={{fontSize:'1.25rem'}}></AiOutlineDelete>
                </button>
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
                      <button className="btn btn1" style={{ float: 'right', marginTop:"1.5rem" }}>Add KR</button>
                    </div>
                    
                    <table className="table mt-3">
                      <tbody>
                          
                          {objective.objective.keyresults.map((kr,index) => (
                            
                            <tr key={kr.kr_id}>
                              {kr.kr_id? (<>
                                  <td>{index+1}</td>
                                  <td style={{paddingLeft:"2rem"}}>{kr.key_result}</td>
                                  <td>
                                    <button className="btn3 float-right">
                                      <MdOutlineModeEditOutline style={{fontSize:'1.25rem'}}></MdOutlineModeEditOutline>
                                    </button>
                                  </td>
                                  <td>
                                    <button className="btn3 float-right">
                                      <AiOutlineDelete style={{fontSize:'1.25rem'}}></AiOutlineDelete>
                                    </button>
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
