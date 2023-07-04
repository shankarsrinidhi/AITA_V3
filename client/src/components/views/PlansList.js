import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {RxDragHandleDots2} from "react-icons/rx";

import {AiOutlineDelete} from "react-icons/ai";


import '../css_components/DraggableCardList.css';
import EditPlans from "./EditPlans";



function PlansList({refreshPlans, week_start, week_end}) {
    
  const [plans, setPlans] = useState([]);

  const getPlans = async () => {
    try {
      const response = await fetch(`http://localhost:5000/1/report/${week_start}/${week_end}/plans`);
      const jsonData = await response.json();
      

      setPlans(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);
  //console.log(plans);


  /*const updateData = async () => {
    try {
      const response = await fetch("http://localhost:5000/1/report/2/progress");
      const jsonData = await response.json();
      

      setProgress(jsonData);
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };*/


  ///:project_id/report/progress/:progress_id
  const deletePlan = async ({plan}) =>{
   // e.preventDefault();
    try {
      const plan_id= plan.plan_id;
      const response = await fetch(
        
        `http://localhost:5000/1/report/plan/${plan_id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          
        }
      );
      refreshPlans();
      
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };
  


  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(plans);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPlans(items);
  }

  return (
    <div>
     
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="progress">
            {(provided) => (
              <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                {plans.length > 0 ?(<>
                {plans.map((plan, index) => {
                  return (
                    <>
                    <Draggable key={`planid${plan.plan_id}`} draggableId={`planid${plan.plan_id}`} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width:"100%" }}>
                          
                            <RxDragHandleDots2 className="float-left mr-2"></RxDragHandleDots2>
                          
                          
                            <EditPlans refreshPlans={refreshPlans} plan={plan}></EditPlans>
                          
                          <button className = "btn3 float-right" data-toggle="modal" data-target={`#PLDelid${plan.plan_id}`}><AiOutlineDelete style={{fontSize:'1.25rem'}}></AiOutlineDelete></button>
                          
                          </div>
                        </li>
                      )}
                    </Draggable>

                      <div class="modal fade" id={`PLDelid${plan.plan_id}`} tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered" role="document">
                      <div class="modal-content">
                          <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLongTitle">Delete Task?</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                          </button>
                          </div>
                          <div class="modal-body">
                          
                          Are you sure you want to delete this task?
                          </div>
                          <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                          <button type="button" class="btn btn-primary" onClick={() => deletePlan({plan})} data-dismiss="modal">Yes</button>
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





export default PlansList;