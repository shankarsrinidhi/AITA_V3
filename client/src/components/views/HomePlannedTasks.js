import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {RxDragHandleDots2} from "react-icons/rx";
import {AiOutlineDelete} from "react-icons/ai";
import {AiOutlineCheckCircle} from "react-icons/ai";
import {AiFillCheckCircle} from "react-icons/ai";
import '../css_components/DraggableCardList.css';
import ReportProblem from "./ReportProblem";
import EditUncompletedPlan from "./EditUncompletedPlan";


function HomePlannedTasks({ refreshHomeTasks, week_start, week_end, prevweek_start, prevweek_end, team_id}) {
  const [progress, setProgress] = useState([]);
  const [students, setStudents] = useState("");

  const getProgress = async () => {
    try {
      if (team_id === "default"){
        return;
      }
      const response = await fetch(`http://localhost:5000/${team_id}/home/${prevweek_start}/${prevweek_end}/plannedtasks`);
      const jsonData = await response.json();
      setProgress(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProgress();
    updateStudents();
    
  }, []);
  //console.log("progress "+progress);

  useEffect(() => {
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


  const displayStudent = (student) => {
    try {
        const getstudentname = [];
        for(let i=0; i<student.length; i++)
    {
      if (i==0) {getstudentname.push(student[0]);}
      else{
      getstudentname.push(", "+student[i]);}
    }
          return getstudentname;
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };
  

  const markAsComplete = async ({plan_id, plan_title, description, student, related_objectives}) =>{
     try {
      if (team_id === "default"){
        return;
      }
       const body = { plan_title, description, student, related_objectives};
       const response = await fetch(
         `http://localhost:5000/${team_id}/progress/${plan_id}/markascomplete/${week_start}/${week_end}`,
         {
           method: "PUT",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(body)
         }
       );
       refreshHomeTasks();
     } catch (error) {
       console.error('Error fetching updated data:', error);
     }
   };

   const removePlan = async ({plan_id}) =>{
     try {
      if (team_id === "default"){
        return;
      }
        const response = await fetch(
            `http://localhost:5000/{team_id}/report/plan/${plan_id}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              
            }
          );
       refreshHomeTasks();
     } catch (error) {
       console.error('Error fetching updated data:', error);
     }
   };


   const markUncomplete = async ({plan_id,plan_title}) =>{
     try {
      if (team_id === "default"){
        return;
      }
       const body = { plan_title };
       const response = await fetch(
         `http://localhost:5000/${team_id}/progress/markasincomplete/${plan_id}`,
         {
           method: "PUT",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(body)
         }
       );
       refreshHomeTasks();
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
    <>
    <div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="progress">
            {(provided) => (
              <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                {progress.length > 0 ?(<>
                {progress.map(({plan_id, plan_title, description, student, related_objectives, marked_complete}, index) => {
                  return (
                    <>
                    <Draggable key={`homeplanid${plan_id}`} draggableId={`homeplanid${plan_id}`} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width:"100%" }}>
                            <RxDragHandleDots2 className="float-left mr-2"></RxDragHandleDots2>
                            <EditUncompletedPlan plan_id={plan_id} plan_title={plan_title} plan_description={description} student={student} related_objectives={related_objectives} marked_complete={marked_complete} refreshHomeTasks={refreshHomeTasks} team_id={team_id}></EditUncompletedPlan>
                            {marked_complete ? (<></>):(<ReportProblem team_id={team_id} plan_id={plan_id} week_start={week_start} week_end={week_end}></ReportProblem>) }
                            {marked_complete ? (<button className = "btn3 float-right" onClick={() => markUncomplete({plan_id,plan_title})}><AiFillCheckCircle style={{fontSize:'1.25rem'}}></AiFillCheckCircle></button>):(<button className = "btn3 float-right" onClick={() => markAsComplete({plan_id,plan_title, description, student, related_objectives})}><AiOutlineCheckCircle style={{fontSize:'1.25rem'}}></AiOutlineCheckCircle></button>) }
                          <button className = "btn3 float-right" data-toggle="modal" data-target={`#HSDelid${plan_id}`} ><AiOutlineDelete style={{fontSize:'1.25rem'}}></AiOutlineDelete></button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                    <div className="modal fade" id={`HSDelid${plan_id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
  </>
  );
}

export default HomePlannedTasks;