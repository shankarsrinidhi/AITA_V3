import React, { Fragment } from "react";
import { AiOutlineDelete } from "react-icons/ai";

const DeleteObjective = ({ team_id, objective , updateData }) => {
    const deleteObjective = async e => {
        try {
          const idToken = localStorage.getItem('firebaseIdToken');
          const deleteObjective = await fetch(`http://localhost:5000/${team_id}/objectives/${objective.objective.objective_id}`, {
          headers:{'Authorization': `Bearer ${idToken}`},  
          method: "DELETE"
          });
          if (deleteObjective.ok) {
            updateData();
          } else {
            if(deleteObjective.status === 403){
              window.location = '/login';
            }
          }
          
        } catch (err) {
          console.error(err.message);
        }
      };

    return (
        <Fragment>
            <button className="btn3 float-right" data-toggle="modal" data-target={`#objid${objective.objective.objective_id}`}>
              <AiOutlineDelete style={{fontSize:'1.25rem'}}></AiOutlineDelete>
            </button>
                <div className="modal fade" id={`objid${objective.objective.objective_id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Delete Objective?</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        Deleting this Objective will delete all its corresponding Key Results.<br></br>
                        Are you sure you want to delete this objective?
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
                        <button type="button" className="btn btn-primary" onClick={() => deleteObjective(objective)} data-dismiss="modal">Yes</button>
                      </div>
                    </div>
                  </div>
                </div>
        </Fragment>
    );
};

export default DeleteObjective;
