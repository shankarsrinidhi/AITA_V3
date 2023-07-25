import React, { Fragment, useState } from "react";
import TextField from '@mui/material/TextField';

const AddObjective = ({team_id}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

//add objective function
  const addObjective = async e => {
    e.preventDefault();
    try {
      const body = { title, description };
      const idToken = localStorage.getItem('firebaseIdToken');
      const response = await fetch(
        `http://localhost:5000/${team_id}/objectives`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      if (response.ok) {
        window.location = `/MOKR/${team_id}`;
      } else {
        if(response.status === 403){
          window.location = '/login';
        }
      }
      
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn1 float-right"
        data-toggle="modal"
        data-target="#exampleModalCenter1"
      >
        Add Row
      </button>
      <div
        className="modal"
        id="exampleModalCenter1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={addObjective}>
            <div className="modal-header">
              <h4 className="modal-title" style={{color:'#8F0000', fontFamily: 'Lato'}}>Add Objective</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <h5 style={{color:'#8F0000', fontFamily: 'Lato'}}>Title</h5>
              <input
              required 
                type="text"
                className="form-control"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <br></br>
              <h5 style={{color:'#8F0000', fontFamily: 'Lato'}}>Description</h5>
              <TextField
                multiline
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                style ={{width:'100%'}}
                />
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn1"
                data-dismiss= {{description} && {title} ? "" : "modal"}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={() => {setDescription(""); setTitle("")}}
              >
                Close
              </button>
            </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AddObjective;