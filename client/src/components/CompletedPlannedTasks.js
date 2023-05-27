import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {RxDragHandleDots2} from "react-icons/rx";
import {FaExclamation} from "react-icons/fa";
import {AiOutlineDelete} from "react-icons/ai";
import {AiOutlineCheckCircle} from "react-icons/ai";

import './css_components/DraggableCardList.css';


function CompletedPlannedTasks({week_start, week_end}) {
    console.log("week start in completed tasks "+week_start+" week end "+week_end);
  const [progress, setProgress] = useState([]);

  const getProgress = async () => {
    try {
      const response = await fetch(`http://localhost:5000/1/report/${week_start}/${week_end}/completedplans`);
      const jsonData = await response.json();
      

      setProgress(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProgress();
  }, []);
  console.log(progress);


  const updateData = async () => {
    try {
      const response = await fetch("http://localhost:5000/1/report/2/progress");
      const jsonData = await response.json();
      

      setProgress(jsonData);
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
                {progress.map(({plan_id, plan_title}, index) => {
                  return (
                    <Draggable key={`compplanid${plan_id}`} draggableId={`compplanid${plan_id}`} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width:"100%" }}>
                          
                            <RxDragHandleDots2 className="float-left mr-2"></RxDragHandleDots2>
                          
                          
                          <div style={{width:"95%"}} onClick={() => console.log("open modal")}>
                          
                            { plan_title }
                          
                          </div>
                          <button className = "btn3 float-right" onClick={() => console.log("delete row")}><FaExclamation style={{fontSize:'1.25rem'}}></FaExclamation></button>
                          <button className = "btn3 float-right" onClick={() => console.log("delete row")}><AiOutlineCheckCircle style={{fontSize:'1.25rem'}}></AiOutlineCheckCircle></button>
                          <button className = "btn3 float-right" onClick={() => console.log("delete row")}><AiOutlineDelete style={{fontSize:'1.25rem'}}></AiOutlineDelete></button>
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