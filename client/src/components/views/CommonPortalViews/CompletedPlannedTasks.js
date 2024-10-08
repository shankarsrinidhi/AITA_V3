import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {RxDragHandleDots2} from "react-icons/rx";
import {AiFillCheckCircle} from "react-icons/ai";
import '../../css_components/DraggableCardList.css';
import EditProgress from "./EditProgress";

function CompletedPlannedTasks({team_id, refreshCompletedTasks, refreshUncompletedTasks, week_start, week_end, nonEditable}) {
  const [progress, setProgress] = useState([]);

  const getProgress = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const response = await fetch(`http://localhost:5000/${team_id}/report/${week_start}/${week_end}/completedplans`,
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
  }, []);


  const markUncomplete = async ({plan}) =>{
    try {
      const plan_title = plan.plan_title
      const body = { plan_title };
      const idToken = localStorage.getItem('firebaseIdToken');
      const response = await fetch(
        `http://localhost:5000/${team_id}/progress/markasincomplete/${plan.plan_id}`,
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
                {progress.length > 0 ?(
                <>
                {progress.map((plan, index) => {
                  return (
                    <Draggable key={`compplanid${plan.plan_id}`} draggableId={`compplanid${plan.plan_id}`} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width:"100%" }}>
                            <RxDragHandleDots2 className="float-left mr-2"></RxDragHandleDots2>
                            <EditProgress nonEditable={nonEditable} team_id={team_id} plan={plan} refreshCompletedTasks={refreshCompletedTasks}></EditProgress>
                            {nonEditable? <></>:<button className = "btn3 float-right" onClick={() => markUncomplete({plan})}><AiFillCheckCircle style={{fontSize:'1.25rem'}}></AiFillCheckCircle></button>}
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

export default CompletedPlannedTasks;