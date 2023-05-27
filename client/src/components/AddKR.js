import React, { Fragment, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AddKR = ({ updateData , objective }) => {

  const [description, setDescription] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => {setShow(false);
    setDescription("")};
  const handleShow = () => setShow(true);


  //edit description function

  const addKR = async e => {
    e.preventDefault();
    try {
        console.log("objective_id "+objective.objective.objective_id);
      const body = { description };
      const response = await fetch(
        `http://localhost:5000/objectives/${objective.objective.objective_id}/kr`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      updateData();
      handleClose();
      

      //window.location = "/MOKR";
    } catch (err) {
      console.error(err.message);
    }
  };
//34 - data-target={`#id${id}`}  44 - id={`id${id+1}`}

  return (
    <Fragment>
      <button
        type="button"
        class="btn btn1 float-right"
        onClick={handleShow}
        style={{ float: 'right', marginTop:"1.5rem" }}
      >
        Add KR
      </button>

        <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={addKR}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:'#8F0000', fontFamily: 'Lato'}}>Add New Key Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
          {/*<h5 style={{color:'#8F0000', fontFamily: 'Lato'}}>Description of Key Result</h5>
                <input
                required 
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <br></br>*/}
                <h5 style={{color:'#8F0000', fontFamily: 'Lato'}}>Description of Key Result</h5>
                <TextField
                  multiline
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style ={{width:'100%'}}
                  />
          
        </Modal.Body>
        <Modal.Footer>
         
          <Button variant="primary" type="submit" class="btn btn1">Save</Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          
        </Modal.Footer>
        </form>
      </Modal>

      {/* 
        id = id10
      
      <div
        class="modal"
        id="exampleModalCenter1"
        
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <form onSubmit={addKR}>
            <div class="modal-header">
              <h4 class="modal-title" style={{color:'#8F0000', fontFamily: 'Lato'}}>Add Key Result</h4>
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
      </div>*/}
    </Fragment>
  );
};

export default AddKR;