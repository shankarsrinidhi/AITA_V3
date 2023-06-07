import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {RxDragHandleDots2} from "react-icons/rx";
import {AiOutlineDelete} from "react-icons/ai";
import {AiOutlineCheckCircle} from "react-icons/ai";

import './css_components/DraggableCardList.css';
import ReportProblem from "./ReportProblem";


function UncompletedPlannedTasks({refreshCompletedTasks, refreshUncompletedTasks, refreshProblems, week_start, week_end, prevweek_start, prevweek_end}) {
   // console.log("week start in uncompleted tasks "+week_start+" week end "+week_end);
  const [progress, setProgress] = useState([]);
  const [students, setStudents] = useState("");

  
  //console.log("students value "+students);

  const getProgress = async () => {
    try {
      const response = await fetch(`http://localhost:5000/1/report/${prevweek_start}/${prevweek_end}/uncompletedplans`);
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
  console.log(progress);

  useEffect(() => {
    updateStudents();
    
  }, []);
  console.log(students);


  const updateData = async () => {
    try {
      const response = await fetch("http://localhost:5000/1/report/2/progress");
      const jsonData = await response.json();
      

      setProgress(jsonData);
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };

  const updateStudents = async () => {
    try {
        const getstudentname = [];
        for(let i=0; i<progress.length; i++)
    {
      getstudentname.push(", "+progress[i].student);
    }
        /*const strstudent = "";
        for (let i = 0; i<progress.length; i++){
            const studentFullname = progress[i].student;
            console.log("students full name array value "+studentFullname);
            for (const j =0; j<studentFullname;j++){
                console.log("students full name value "+studentFullname[j]);
                strstudent = strstudent + ", " + studentFullname[j];
            }
          }*/
          //return students;
          console.log("students value "+getstudentname);
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };
  

  const markAsComplete = async ({plan_id, plan_title, description, student, related_objectives}) =>{
    // e.preventDefault();
     try {
        //progress/:plan_id/markascomplete/:start_date/:end_date
       const body = { plan_title, description, student, related_objectives};
       const response = await fetch(
         
         `http://localhost:5000/1/progress/${plan_id}/markascomplete/${week_start}/${week_end}`,
         {
           method: "PUT",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(body)
         }
       );
       refreshCompletedTasks();
       refreshUncompletedTasks();
     } catch (error) {
       console.error('Error fetching updated data:', error);
     }
   };


   
   const removePlan = async ({plan_id}) =>{
    // e.preventDefault();
     try {
       const response = await fetch(
         
         `http://localhost:5000/1/progress/remove/${plan_id}`,
         {
           method: "PUT",
           headers: { "Content-Type": "application/json" },
           
         }
       );
       //refreshCompletedTasks();
       refreshUncompletedTasks();
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
                    <Draggable key={`compplanid${plan_id}`} draggableId={`compplanid${plan_id}`} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width:"100%" }}>
                          
                            <RxDragHandleDots2 className="float-left mr-2"></RxDragHandleDots2>
                          
                          
                          <div style={{width:"95%"}} onClick={() => console.log("open modal")} onLoad={updateStudents}>
                          
                            { plan_title }  ({students})
                          
                          </div>
                          <ReportProblem plan_id={plan_id} refreshProblems = {refreshProblems} week_start={week_start} week_end={week_end}></ReportProblem>
                          <button className = "btn3 float-right" onClick={() => markAsComplete({plan_id,plan_title, description, student, related_objectives})}><AiOutlineCheckCircle style={{fontSize:'1.25rem'}}></AiOutlineCheckCircle></button>
                          <button className = "btn3 float-right" onClick={() => removePlan({plan_id})}><AiOutlineDelete style={{fontSize:'1.25rem'}}></AiOutlineDelete></button>
                          </div>
                        </li>
                      )}
                    </Draggable>
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