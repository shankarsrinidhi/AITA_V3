import React, { Fragment, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AddProblem = ({ team_id, refreshProblems, week_start, week_end }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mitigation, setMitigation] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setDescription("");
    setTitle("");
    setMitigation("");
  };

  const handleShow = () => setShow(true);

  //add Problem function
  const addProblem = async e => {
    e.preventDefault();
    try {
      const body = { title, description, mitigation };
      const idToken = localStorage.getItem('firebaseIdToken');
      const response = await fetch(
        `http://localhost:5000/${team_id}/report/${week_start}/${week_end}/problem`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      if (response.ok) {
        refreshProblems();
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
        className="btn btn1 float-right"
        onClick={handleShow}
        style={{ float: 'right'}}
      >
        Add Problem
      </button>
        <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={addProblem}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:'#8F0000', fontFamily: 'Lato'}}>Add Problem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <h5 style={{color:'#8F0000', fontFamily: 'Lato'}}>Problem Title</h5>
                <input
                required 
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <br></br>
                <h5 style={{color:'#8F0000', fontFamily: 'Lato'}}>Description of Problem</h5>
                <TextField
                  multiline
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style ={{width:'100%'}}
                  />
                   <br></br>
                   <br></br>
                <h5 style={{color:'#8F0000', fontFamily: 'Lato'}}>Steps to be taken to mitigate the problem</h5>
                <TextField
                  multiline
                  required
                  rows={4}
                  value={mitigation}
                  onChange={e => setMitigation(e.target.value)}
                  style ={{width:'100%'}}
                  />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" className="btn btn1">Save</Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
        </form>
      </Modal>
    </Fragment>
  );
};

export default AddProblem;