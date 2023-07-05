import React, { Fragment, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {FaExclamation} from "react-icons/fa";

const ReportProblem = ({ refreshProblems, week_start, week_end, plan_id }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mitigation, setMitigation] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => {setShow(false);
    setDescription("");
    setTitle("");
    setMitigation("");
  };

  const handleShow = () => setShow(true);

  const addProblem = async e => {
    e.preventDefault();
    try {
      const body = { title, description, mitigation, plan_id};
      const response = await fetch(
        `http://localhost:5000/1/report/${week_start}/${week_end}/problem`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      console.log("problems refressh valuye "+refreshProblems);
      if (refreshProblems) refreshProblems();
      handleClose();
      
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
        <button className = "btn3 float-right" onClick={handleShow}><FaExclamation style={{fontSize:'1.25rem'}}></FaExclamation></button>
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

export default ReportProblem;