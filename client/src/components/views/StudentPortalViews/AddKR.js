import React, { Fragment, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AddKR = ({ team_id, updateData , objective }) => {
  const [description, setDescription] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setDescription("")
  };

  const handleShow = () => setShow(true);

  //add key result function
  const addKR = async e => {
    e.preventDefault();
    try {
      const body = { description };
      const idToken = localStorage.getItem('firebaseIdToken');
      const response = await fetch(
        `http://localhost:5000/objectives/${objective.objective.objective_id}/kr`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      if (response.ok) {
        updateData();
       handleClose();
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
    </Fragment>
  );
};

export default AddKR;