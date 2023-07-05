import React, { Fragment, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { MdOutlineModeEditOutline } from "react-icons/md";

const EditObjective = ({ objective , updateData }) => {
  const [description, setDescription] = useState(objective.objective.description);
  const [title, setTitle] = useState(objective.objective.objective_title);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const updateObjective = async e => {
    e.preventDefault();
    try {
      const body = { title, description };
      const response = await fetch(
        `http://localhost:5000/1/objectives/${objective.objective.objective_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      await updateData();
      handleClose();
      
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
        <button className="btn3 float-right" onClick={handleShow}
         >
          <MdOutlineModeEditOutline style={{fontSize:'1.25rem'}}></MdOutlineModeEditOutline>
        </button>
        <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={updateObjective}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:'#8F0000', fontFamily: 'Lato'}}>Edit Objective</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" class="btn btn1">Save</Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
        </form>
      </Modal>
    </Fragment>
  );
};

export default EditObjective;