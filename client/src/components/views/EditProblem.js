import React, { Fragment, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const EditProblem = ({ team_id, problem, refreshProblems }) => {
  const [title, setTitle] = useState(problem.problem_title);
  const [description, setDescription] = useState(problem.description);
  const [mitigation, setMitigation] = useState(problem.mitigation);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const editProblems = async e => {
    e.preventDefault();
    
    try {
        const body = { title, description, mitigation };
        const response = await fetch(
          `http://localhost:5000/${team_id}/problems/editproblem/${problem.problem_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
      refreshProblems();
      handleClose();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
        <div style={{width:"95%"}} onClick={handleShow}>     
          { problem.problem_title }       
        </div>
        <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        >
        <form onSubmit={editProblems}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:'#8F0000', fontFamily: 'Lato'}}>Edit Problem</Modal.Title>
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

export default EditProblem;