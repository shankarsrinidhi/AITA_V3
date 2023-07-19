import TextField from '@mui/material/TextField';
import { MdOutlineModeEditOutline } from "react-icons/md"; 
import { BiSave } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import axios from "axios"
import React, { Fragment, useState, useEffect } from "react";

const Mission = ({team_id}) =>{
    const [mission, setMission] = useState("");
    const [initialMissionValue, setInitialMissionValue] = useState("");
    const [missionEditButtonVisible, setMissionEditButtonVisible] = useState(false);

    useEffect(() => {
      axios.get(`http://localhost:5000/${team_id}/mission`).then((response) => {
        setMission(response.data.mission);
        setInitialMissionValue(response.data.mission);
      });
    }, []); 

    const handleChange = (event) => {
        setMission(event.target.value);
    };

    const handleCancel = () => {
        setMission(initialMissionValue);
        setMissionEditButtonVisible(false);
    };

    const onSaveMission = async e => {
      e.preventDefault();
      try {
        setInitialMissionValue(mission);
        const body = { mission };
        const response = await fetch(`http://localhost:5000/${team_id}/mission`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
      setMissionEditButtonVisible(false);
      } catch (err) {
        console.error(err.message);
      }
  };

  const disableMissionEdit = async e => {
    e.preventDefault();
    try {
      setMissionEditButtonVisible(true);
    } catch (err) {
      console.error(err.message);
    }
  };

return(
    <Fragment>
        <div className="container">
      <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Mission</h4>
      <div className = "form-container">
      <form id="myform">
      <TextField
          label="Enter Mission"
          multiline
          rows={4}
          disabled = {!missionEditButtonVisible}
          value={mission}
          onChange={handleChange}
          style ={{width:'100%'}}
        />
        </form>
        <div>
        {true &&
          <button className="btn2 float-right ml-2 mt-1" visible ={false} disabled = {!missionEditButtonVisible} data-toggle="modal" data-target="#exampleModalCenter"><BiSave  style={{fontSize:'1.5rem'}}/></button>}
          <button className="btn2 float-right ml-2 mt-1" disabled = {!missionEditButtonVisible} onClick={handleCancel}><GrClose style={{fontSize:'1rem'}}/></button>
          <button className="btn2 float-right ml-2 mt-1" disabled = {missionEditButtonVisible} onClick={disableMissionEdit}><MdOutlineModeEditOutline style={{fontSize:'1.5rem'}}/></button>
        </div>
        </div>
        </div>
        <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Change Mission</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to save changes to the mission of your project?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={onSaveMission} data-dismiss="modal">Save changes</button>
              </div>
            </div>
          </div>
        </div>
        </Fragment>
)};

export default Mission;