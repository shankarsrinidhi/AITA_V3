import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {RxDragHandleDots2} from "react-icons/rx";
import {AiOutlineDelete} from "react-icons/ai";
import {AiOutlineCheckCircle} from "react-icons/ai";
import '../../css_components/DraggableCardList.css';
import ReportProblem from "../StudentPortalViews/ReportProblem";
import EditUncompletedPlan from "./EditUncompletedPlan";

function UncompletedPlannedTasks({nonEditable, team_id, refreshCompletedTasks, refreshUncompletedTasks, refreshProblems, week_start, week_end, prevweek_start, prevweek_end}) {
  const [progress, setProgress] = useState([]);

  const getProgress = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const response = await fetch(`http://localhost:5000/${team_id}/report/${prevweek_start}/${prevweek_end}/uncompletedplans`,
      {
        method: "GET",
        headers: { 'Authorization': `Bearer ${idToken}` }
    });
    if (response.ok) {
      const jsonData = await response.json();
      setProgress(jsonData);
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
    getProgress();
    updateStudents();
  }, []);


  const updateStudents = async () => {
    try {
        const getstudentname = [];
        for(let i=0; i<progress.length; i++)
    {
      getstudentname.push(", "+progress[i].student);
    }
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };

  const markAsComplete = async ({plan_id, plan_title, description, student, related_objectives}) =>{
     try {
       const body = { plan_title, description, student, related_objectives};
       const idToken = localStorage.getItem('firebaseIdToken');
       const response = await fetch(
         `http://localhost:5000/${team_id}/progress/${plan_id}/markascomplete/${week_start}/${week_end}`,
         {
           method: "PUT",
           headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
           body: JSON.stringify(body)
         }
       );
       if (response.ok) {
        refreshCompletedTasks();
        refreshUncompletedTasks();
      } else {
        if(response.status === 403){
          window.location = '/login';
        }
      }
       
     } catch (error) {
       console.error('Error fetching updated data:', error);
     }
   };

   const removePlan = async ({plan_id}) =>{
     try {
      const idToken = localStorage.getItem('firebaseIdToken');
       const response = await fetch(
         `http://localhost:5000/${team_id}/progress/remove/${plan_id}`,
         {
           method: "PUT",
           headers: { 'Authorization': `Bearer ${idToken}`,"Content-Type": "application/json" },
           
         }
       );
       if (response.ok) {
        refreshUncompletedTasks();
      } else {
        if(response.status === 403){
          window.location = '/login';
        }
      }
      
     } catch (error) {
       console.error('Error fetching updated data:', error);
     }
   };

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(progress);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setProgress(items);
  }

  return (
    <div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="progress">
            {(provided) => (
              <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                {progress.length > 0 ?(<>
                {progress.map(({plan_id, plan_title, description, student, related_objectives}, index) => {
                  return (
                    <>
                    <Draggable key={`compplanid${plan_id}`} draggableId={`compplanid${plan_id}`} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width:"100%" }}>
                            <RxDragHandleDots2 className="float-left mr-2"></RxDragHandleDots2>
                            <EditUncompletedPlan nonEditable={nonEditable} team_id={team_id} plan_id={plan_id} plan_title={plan_title} plan_description={description} student={student} related_objectives={related_objectives} refreshUncompletedTasks={refreshUncompletedTasks}></EditUncompletedPlan>
                          {nonEditable ? <></> : <><ReportProblem team_id={team_id} plan_id={plan_id} refreshProblems = {refreshProblems} week_start={week_start} week_end={week_end}></ReportProblem>
                          <button className = "btn3 float-right" onClick={() => markAsComplete({plan_id,plan_title, description, student, related_objectives})}><AiOutlineCheckCircle style={{fontSize:'1.25rem'}}></AiOutlineCheckCircle></button>
                          <button className = "btn3 float-right" data-toggle="modal" data-target={`#UPDelid${plan_id}`}><AiOutlineDelete style={{fontSize:'1.25rem'}}></AiOutlineDelete></button></>}
                          </div>
                        </li>
                      )}
                    </Draggable>

                  <div className="modal fade" id={`UPDelid${plan_id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Delete Task?</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div className="modal-body">
                        Are you sure you want to delete this task?
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
                        <button type="button" className="btn btn-primary" onClick={() => removePlan({plan_id})} data-dismiss="modal">Yes</button>
                        </div>
                    </div>
                    </div>
                  </div>
                </>
                  );
                })}</>)
                :<h6 className="ml-3">No Data to show</h6>}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
    </div>
  );
}

export default UncompletedPlannedTasks;