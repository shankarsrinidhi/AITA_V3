import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {RxDragHandleDots2} from "react-icons/rx";
import {AiOutlineDelete} from "react-icons/ai";
import '../css_components/DraggableCardList.css';
import EditProblem from "./EditProblem";

function ProblemsList({refreshProblems, week_start, week_end}) {
  const [problems, setProblems] = useState([]);

  const getProblems = async () => {
    try {
      const response = await fetch(`http://localhost:5000/1/report/${week_start}/${week_end}/problems`);
      const jsonData = await response.json();
      setProblems(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProblems();
  }, []);

  const deleteProblem = async ({problem}) =>{
    try {
      const problem_id= problem.problem_id;
      const response = await fetch(
        `http://localhost:5000/1/report/problem/${problem_id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      refreshProblems();
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(problems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setProblems(items);
  }

  return (
    <div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="problems">
            {(provided) => (
              <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                {problems.length > 0 ?(<>
                {problems.map((problem, index) => {
                  return (
                    <>
                    <Draggable key={`problemid${problem.problem_id}`} draggableId={`problemid${problem.problem_id}`} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width:"100%" }}>
                            <RxDragHandleDots2 className="float-left mr-2"></RxDragHandleDots2>
                            <EditProblem refreshProblems={refreshProblems} problem={problem}></EditProblem>
                            <button className = "btn3 float-right" data-toggle="modal" data-target={`#ProbDelid${problem.problem_id}`}><AiOutlineDelete style={{fontSize:'1.25rem'}}></AiOutlineDelete></button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                    <div class="modal fade" id={`ProbDelid${problem.problem_id}`} tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered" role="document">
                      <div class="modal-content">
                          <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLongTitle">Delete Problem?</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                          </button>
                          </div>
                          <div class="modal-body">
                          Are you sure you want to delete this problem?
                          </div>
                          <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                          <button type="button" class="btn btn-primary" onClick={() => deleteProblem({problem})} data-dismiss="modal">Yes</button>
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

export default ProblemsList;