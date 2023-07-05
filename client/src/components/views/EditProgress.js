import React, { Fragment, useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {Multiselect} from 'multiselect-react-dropdown';

const EditProgress = ({ plan, refreshCompletedTasks }) => {
  const [title, setTitle] = useState(plan.plan_title);
  const [description, setDescription] = useState(plan.description);
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedStudentOptions, setSelectedStudentOptions] = useState(plan.student);
  const [objectives, setObjectives] = useState(plan.related_objectives);
  const [selectedObjectives, setSelectedObjectives] = useState(plan.related_objectives);
  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);
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
      const reqData= await fetch("http://localhost:5000/1/studentsdropdown");
      const resData= await reqData.json();
      for(let i=0; i<resData.length; i++)
    {
      getstudentname.push(resData[i].full_name);
    }
    setStudentOptions(getstudentname);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const fetchObjectiveOptions = async () => {
    try {
      const getobjectivetitle=[];
      const reqData= await fetch("http://localhost:5000/1/objectives");
      const resData= await reqData.json();
      for(let i=0; i<resData.length; i++)
    {
        getobjectivetitle.push(resData[i].objective_title);
    }
    setObjectives(getobjectivetitle);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    fetchObjectiveOptions();
  }, []);

  const editProgress = async e => {
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
        const response = await fetch(
          `http://localhost:5000/1/progress/editcompletedplan/${plan.plan_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
      refreshCompletedTasks();
      handleClose();
    } catch (err) {
      console.error(err.message);
    }
  };

  const displayStudent = (student) => {
    try {
        const getstudentname = [];
        for(let i=0; i<student.length; i++)
    {
      if (i==0) {getstudentname.push(student[0]);}
      else{
      getstudentname.push(", "+student[i]);}
    }
    return getstudentname;
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };

  return (
    <Fragment>
        <div style={{width:"95%"}} onClick={handleShow}>
          { plan.plan_title } ({displayStudent(plan.student)})               
        </div>
        <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={editProgress}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:'#8F0000', fontFamily: 'Lato'}}>Add Progress</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <h5 style={{color:'#8F0000', fontFamily: 'Lato'}}>Progress Title</h5>
                <input
                required 
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <br></br>
                <h5 style={{color:'#8F0000', fontFamily: 'Lato'}}>Description of Progress</h5>
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

export default EditProgress;