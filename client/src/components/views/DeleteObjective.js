import React, { Fragment, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

const DeleteObjective = ({ objective , updateData }) => {
    const deleteObjective = async e => {
        try {
          const deleteObjective = await fetch(`http://localhost:5000/1/objectives/${objective.objective.objective_id}`, {
            method: "DELETE"
          });
          updateData();
        } catch (err) {
          console.error(err.message);
        }
      };

    return (
        <Fragment>
            <button className="btn3 float-right" data-toggle="modal" data-target={`#objid${objective.objective.objective_id}`}>
              <AiOutlineDelete style={{fontSize:'1.25rem'}}></AiOutlineDelete>
            </button>
                <div class="modal fade" id={`objid${objective.objective.objective_id}`} tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Delete Objective?</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        Deleting this Objective will delete all its corresponding Key Results.<br></br>
                        Are you sure you want to delete this objective?
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                        <button type="button" class="btn btn-primary" onClick={() => deleteObjective(objective)} data-dismiss="modal">Yes</button>
                      </div>
                    </div>
                  </div>
                </div>
        </Fragment>
    );
};

export default DeleteObjective;
