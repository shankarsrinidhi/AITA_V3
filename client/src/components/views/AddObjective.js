import React, { Fragment, useState } from "react";
import TextField from '@mui/material/TextField';

const AddObjective = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

//add objective function
  const addObjective = async e => {
    e.preventDefault();
    try {
      const body = { title, description };
      const response = await fetch(
        `http://localhost:5000/1/objectives`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      window.location = "/MOKR";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        class="btn btn1 float-right"
        data-toggle="modal"
        data-target="#exampleModalCenter1"
      >
        Add Row
      </button>
      <div
        class="modal"
        id="exampleModalCenter1"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <form onSubmit={addObjective}>
            <div class="modal-header">
              <h4 class="modal-title" style={{color:'#8F0000', fontFamily: 'Lato'}}>Add Objective</h4>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
              >
                &times;
              </button>
            </div>
            <div class="modal-body">
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
            <div class="modal-footer">
              <button
                type="submit"
                class="btn btn1"
                data-dismiss= {{description} && {title} ? "" : "modal"}
              >
                Save
              </button>
              <button
                type="button"
                class="btn btn-danger"
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