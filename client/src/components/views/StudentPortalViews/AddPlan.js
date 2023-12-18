import React, { Fragment, useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {Multiselect} from 'multiselect-react-dropdown';

const AddPlan = ({ team_id, refreshPlans, week_start, week_end }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedStudentOptions, setSelectedStudentOptions] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [selectedObjectives, setSelectedObjectives] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setDescription("");
    setTitle("");
    setSelectedObjectives([])
    setSelectedStudentOptions([])
  };

  const handleShow = () => setShow(true);

  const handleStudentOptionSelect = (event) => {
    setSelectedStudentOptions(event);
  };

  const handleObjectivesOptionSelect = (event) => {
    setSelectedObjectives(event);
  };

  useEffect(() => {
    fetchStudentOptions();
  }, []);

  const fetchStudentOptions = async () => {
    try {
      const getstudentname=[];
      const idToken = localStorage.getItem('firebaseIdToken');
      const reqData= await fetch(`http://localhost:5000/${team_id}/studentsdropdown`,
      {
        method: "GET",
        headers: { 'Authorization': `Bearer ${idToken}` },
    });
    if (reqData.ok) {
      const resData= await reqData.json();
      for(let i=0; i<resData.length; i++){
        getstudentname.push(resData[i].full_name);
      }
      setStudentOptions(getstudentname);
    } else {
      if(reqData.status === 403){
        window.location = '/login';
      }
    }
      
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const fetchObjectiveOptions = async () => {
    try {
      const getobjectivetitle=[];
      const idToken = localStorage.getItem('firebaseIdToken');
      const reqData= await fetch(`http://localhost:5000/${team_id}/objectives`,
      {
        method: "GET",
        headers: { 'Authorization': `Bearer ${idToken}` }
    });
    if (reqData.ok) {
      const resData= await reqData.json();
      for(let i=0; i<resData.length; i++)
      {
          getobjectivetitle.push(resData[i].objective_title);
      }
    setObjectives(getobjectivetitle);
    } else {
      if(reqData.status === 403){
        window.location = '/login';
      }
    }
      
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    fetchObjectiveOptions();
  }, []);


  //add plan function
  const addPlan = async e => {
    e.preventDefault();
    if (selectedStudentOptions.length < 1) {
        alert("Please select at least one team mate responsible");
        return;
      }
      if (selectedObjectives.length < 1) {
        alert("Please select at least one related objective");
        return;
      }
    try {
      const body = { title, description, selectedStudentOptions, selectedObjectives };
      const idToken = localStorage.getItem('firebaseIdToken');
      const response = await fetch(
        `http://localhost:5000/${team_id}/report/${week_start}/${week_end}/plan`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      if (response.ok) {
        refreshPlans();
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
        Add Plan
      </button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={addPlan}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:'#8F0000', fontFamily: 'Lato'}}>Add Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <h5 style={{color:'#8F0000', fontFamily: 'Lato'}}>Plan Title</h5>
                <input
                required 
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <br></br>
                <h5 style={{color:'#8F0000', fontFamily: 'Lato'}}>Description of Plan</h5>
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
                <h5 style={{color:'#8F0000', fontFamily: 'Lato'}}>Teammates Responsible</h5>
                <Multiselect 
                  isObject={false}
                  onRemove={handleStudentOptionSelect}
                  onSelect={  handleStudentOptionSelect}
                  options={ studentOptions }
                  required = {true}               
                  showCheckbox
                />   
               <br></br>
                <h5 style={{color:'#8F0000', fontFamily: 'Lato'}}>Select Related Objectives</h5>   
                <Multiselect 
                      isObject={false}
                      onRemove={handleObjectivesOptionSelect}
                      onSelect={  handleObjectivesOptionSelect}
                      options={ objectives }
                      required = {true}               
                      showCheckbox
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

export default AddPlan;