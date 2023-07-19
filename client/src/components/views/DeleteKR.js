import React, { Fragment, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

const DeleteKR = ({ team_id, objective , updateData , kr }) => {
    const deleteKR = async e => {
        try {
            console.log("objective id is "+ objective.objective.objective_id);
          const deleteKR = await fetch(`http://localhost:5000/objectives/${objective.objective.objective_id}/kr/${kr.kr_id}`, {
            method: "DELETE"
          });
          updateData();
        } catch (err) {
          console.error(err.message);
        }
      };

    return (
              <Fragment>
                <button className="btn3 float-right" data-toggle="modal" data-target={`#krid${kr.kr_id}`}>
                  <AiOutlineDelete style={{fontSize:'1.25rem', marginLeft:"1rem"}}></AiOutlineDelete>
                </button>
                <div class="modal fade" id={`krid${kr.kr_id}`} tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Delete Key Result?</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        Are you sure you want to delete this Key Result?
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                        <button type="button" class="btn btn-primary" onClick={() => deleteKR()} data-dismiss="modal">Yes</button>
                      </div>
                    </div>
                  </div>
                </div>
            </Fragment>

    );
};

export default DeleteKR;