import React, { Fragment, useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { MdOutlineModeEditOutline } from "react-icons/md";
import {Multiselect} from 'multiselect-react-dropdown';

const EditNewAddedProgress = ({ progress, refreshAdditionalCompletedTasks }) => {
  //console.log("in edit objective "+objective.objective.objective_id);
  
  const [title, setTitle] = useState(progress.progress_title);
  const [description, setDescription] = useState(progress.description);
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedStudentOptions, setSelectedStudentOptions] = useState(progress.student);
  const [objectives, setObjectives] = useState(progress.related_objectives);
  const [selectedObjectives, setSelectedObjectives] = useState(progress.related_objectives);
  const [show, setShow] = useState(false);
  

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleStudentOptionSelect = (event) => {
    setSelectedStudentOptions(event);
    //console.log("value of students "+selectedStudentOptions)
  };

  const handleObjectivesOptionSelect = (event) => {
    setSelectedObjectives(event);
    //console.log("value of objectives "+selectedObjectives);
  };

  /*const fetchProgressDetails = async () => {
    try {
      
      const reqData= await fetch(`http://localhost:5000/${plan_id}/progress`);
      const resData= await reqData.json();
      setProgress(resData);
      setTitle(progress.progress_title);
     // console.log("fetch progress tutle "+title);
      
    }catch (error) {
        console.error("Error fetching options:", error);
      }
    };*/

    const displayStudent = (student) => {
      try {
          const getstudentname = [];
          for(let i=0; i<student.length; i++)
      {
        if (i==0) {getstudentname.push(student[0]);}
        else{
        getstudentname.push(", "+student[i]);}
      }
          
            //return students;
            //console.log("students value "+getstudentname);
            return getstudentname;
      } catch (error) {
        console.error('Error fetching updated data:', error);
      }
    };



  useEffect(() => {
    fetchStudentOptions();
  }, []);

  const fetchStudentOptions = async () => {
    try {
      //const response = await axios.get("http://localhost:5000/1/studentsdropdown"); 
      const getstudentname=[];

      const reqData= await fetch("http://localhost:5000/1/studentsdropdown");
      const resData= await reqData.json();
      //console.log(resData);
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
      //console.log(resData);
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
          
          `http://localhost:5000/1/progress/editadditionalprogress/${progress.progress_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
        //refreshCompletedTasks();
        //refreshUncompletedTasks();
        refreshAdditionalCompletedTasks();
      handleClose();
      
    } catch (err) {
      console.error(err.message);
    }
  };



  /*const updateProgress = async e => {
    e.preventDefault();
    try {
      console.log("checking to see if edit is called everytime "+objective.objective.objective_id)
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
  };*/

  return (
    <Fragment>
        
        <div style={{width:"95%"}} onClick={handleShow}>
                          
                            { progress.progress_title } ({displayStudent(progress.student)})
                          
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

export default EditNewAddedProgress;