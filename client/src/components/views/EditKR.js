import React, { Fragment, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { MdOutlineModeEditOutline } from "react-icons/md"; 

const EditKR = ({ updateData , objective, kr }) => {
  const [description, setDescription] = useState(kr.key_result);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  //edit Key Result function
  const editKR = async e => {
    e.preventDefault();
    try {
      const body = { description };
      const response = await fetch(
        `http://localhost:5000/objectives/${objective.objective.objective_id}/kr/${kr.kr_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      updateData();
      handleClose();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>                   
      <button
        type="button"
        class="btn3 float-right"
        onClick={handleShow}
      >
        <MdOutlineModeEditOutline style={{fontSize:'1.25rem', marginLeft:"1.5rem"}}></MdOutlineModeEditOutline>
      </button>
        <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={editKR}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:'#8F0000', fontFamily: 'Lato'}}>Edit Key Result</Modal.Title>
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

export default EditKR;