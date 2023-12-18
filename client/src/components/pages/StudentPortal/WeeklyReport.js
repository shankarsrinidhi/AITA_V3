import React, { Fragment, useState, useEffect, useContext } from "react";
import { AiFillCaretRight } from "react-icons/ai";
import { AiFillCaretLeft } from "react-icons/ai";
import '../../css_components/WeeklyReport.css'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Header from "../../views/CommonPortalViews/Header";
import Footer from "../../views/CommonPortalViews/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import CompletedPlannedTasks from "../../views/CommonPortalViews/CompletedPlannedTasks";
import UncompletedPlannedTasks from "../../views/CommonPortalViews/UncompletedPlannedTasks";
import AdditionalCompletedTasks from "../../views/CommonPortalViews/AdditionalCompletedTasks";
import AddProgressRow from "../../views/StudentPortalViews/AddProgressRow";
import PlansList from "../../views/CommonPortalViews/PlansList";
import AddPlan from "../../views/StudentPortalViews/AddPlan";
import ProblemsList from "../../views/CommonPortalViews/ProblemsList";
import AddProblem from "../../views/StudentPortalViews/AddProblem";
import { useParams } from 'react-router-dom';
import { useAuth } from "../../../contexts/AuthContext"
import { TeamContext } from '../../../contexts/TeamContext';
  
function WeeklyReport() {
    
    const { week_start, team_id } = useParams();
    const [currentDate, setCurrentDate] = useState(new Date(week_start));
    const [started,setStarted] = useState(false);
    const [submitted,setSubmitted] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [completedTasksRefreshCount, setCompletedTasksRefreshCount] = useState(0);
    const [uncompletedTasksRefreshCount, setUncompletedTasksRefreshCount] = useState(0);
    const [additionalTasksRefreshCount, setAdditionalTasksRefreshCount] = useState(0);
    const [plansRefreshCount,setPlansRefreshCount] = useState(0);
    const [problemsRefreshCount,setProblemsRefreshCount] = useState(0);
    const { currentUser } = useAuth();
    const {teams, setTeams} = useContext(TeamContext);
    const [shouldRender, setShouldRender] = useState(false);

    setTimeout(() => {
      setShouldRender(true);
    }, 500);

    const getTeams = async e => {
      try {
        if (team_id === "default"){
          return;
        }
        const id =  currentUser.email;
        const body = { id };
        const idToken = localStorage.getItem('firebaseIdToken');
        const response = await fetch(
          `http://localhost:5000/teams`,
          {
            method: "POST",
            headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
        if (response.ok) {
          const jsonData = await response.json();
          setTeams(jsonData);
        } else {
          if(response.status === 403){
            window.location = '/login';
          }
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    
    useEffect(() => {
      getTeams();
    },[]);




    const handleCloseError = () => setShowError(false);

    const handleShowError = () => setShowError(true);

    const handleCloseSuccess = () => setShowSuccess(false);

    const handleShowSuccess = () => setShowSuccess(true);

    const getSubmitted = async (week_start,week_end) => {
      try {
        if (team_id === "default"){
          return;
        }
        const idToken = localStorage.getItem('firebaseIdToken');
        const response = await fetch(`http://localhost:5000/${team_id}/reportsubmitted/${week_start}/${week_end}`,
        {
            method: "GET",
            headers: { 'Authorization': `Bearer ${idToken}` },
        });
        if (response.ok) {
          const jsonData = await response.json();
        setSubmitted(jsonData.result);
        } else {
          if(response.status === 403){
            window.location = '/login';
          }
        }
        
      } catch (err) {
        console.error(err.message);
      }
    };

    useEffect(() => {
      getSubmitted(formatDate(getWeekStartDate()),formatDate(getWeekEndDate()));
    }, []);
    
    const getStarted = async (week_start,week_end) => {
      try {
        if (team_id === "default"){
          return;
        }
        const idToken = localStorage.getItem('firebaseIdToken');
        const response = await fetch(`http://localhost:5000/${team_id}/reportstarted/${week_start}/${week_end}`,
        {
          method: "GET",
          headers: { 'Authorization': `Bearer ${idToken}` },
       });
       if (response.ok) {
        const jsonData = await response.json();
        setStarted(jsonData.result);
      } else {
        if(response.status === 403){
          window.location = '/login';
        }
      }
        
      } catch (err) {
        console.error(err.message);
      }
    };
  
    useEffect(() => {
      getStarted(formatDate(getWeekStartDate()),formatDate(getWeekEndDate()));
    }, []);
    
    const getPlans = async (week_start,week_end) => {
      try {
        const idToken = localStorage.getItem('firebaseIdToken');
        const response = await fetch(`http://localhost:5000/${team_id}/report/${week_start}/${week_end}/plans`,
        {
          method: "GET",
          headers: { 'Authorization': `Bearer ${idToken}` },
      });
      if (response.ok) {
        const jsonData = await response.json();
        return jsonData;
      } else {
        if(response.status === 403){
          window.location = '/login';
        }
      }
        
      } catch (err) {
        console.error(err.message);
      }
    };

    const refreshCompletedTasks = () => {
      setCompletedTasksRefreshCount(completedTasksRefreshCount + 1);
    };
  
    const refreshUncompletedTasks = () => {
      setUncompletedTasksRefreshCount(uncompletedTasksRefreshCount + 1);
    };

    const refreshAdditionalCompletedTasks = () => {
      setAdditionalTasksRefreshCount(additionalTasksRefreshCount + 1);
    };

    const refreshPlans = () => {
      setPlansRefreshCount(plansRefreshCount + 1);
    };

    const refreshProblems = () => {
      setProblemsRefreshCount(problemsRefreshCount + 1);
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const handlePreviousWeek = () => {
      const previousWeek = new Date(currentDate);
      previousWeek.setDate(currentDate.getDate() - 7);
      setCurrentDate(previousWeek);
      setCompletedTasksRefreshCount(completedTasksRefreshCount + 1);
      setUncompletedTasksRefreshCount(uncompletedTasksRefreshCount + 1);
      setAdditionalTasksRefreshCount(additionalTasksRefreshCount+1);
      setPlansRefreshCount(plansRefreshCount+1);
      setProblemsRefreshCount(problemsRefreshCount + 1);
      getStarted(formatDate(prevWeekStartDate()),formatDate(prevWeekEndDate()));
      getSubmitted(formatDate(prevWeekStartDate()),formatDate(prevWeekEndDate()));
    };
  
    const handleNextWeek = () => {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(currentDate.getDate() + 7);
      setCurrentDate(nextWeek);
      setCompletedTasksRefreshCount(completedTasksRefreshCount + 1);
      setUncompletedTasksRefreshCount(uncompletedTasksRefreshCount + 1);
      setAdditionalTasksRefreshCount(additionalTasksRefreshCount+1);
      setPlansRefreshCount(plansRefreshCount+1);
      setProblemsRefreshCount(problemsRefreshCount + 1);
      getStarted(formatDate(nextWeekStartDate()),formatDate(nextWeekEndDate()));
      getSubmitted(formatDate(nextWeekStartDate()),formatDate(nextWeekEndDate()));
    };
    
    const getWeekStartDate = () => {
      const date = new Date(currentDate);
      const dayOfWeek = date.getDay();
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 0);
      return new Date(date.setDate(diff));
    };
  
    const getWeekEndDate = () => {
      const date = new Date(currentDate);
      const dayOfWeek = date.getDay();
      const diff = date.getDate() + (5 - dayOfWeek) + (dayOfWeek === 0 ? 0 : 1);
      return new Date(date.setDate(diff));
    };

    const prevWeekStartDate = () => {
      const date = getWeekStartDate();
      date.setDate(date.getDate() - 7);
      return date;
    };

    const prevWeekEndDate = () => {
      const date = getWeekEndDate();
      date.setDate(date.getDate() - 7);
      return date;
    };


    const nextWeekStartDate = () => {
      const date = getWeekStartDate();
      date.setDate(date.getDate() + 7);
      return date;
    };

    const nextWeekEndDate = () => {
      const date = getWeekEndDate();
      date.setDate(date.getDate() + 7);
      return date;
    };

    const startReport = async () => {
        try {
           const week_start = formatDate(getWeekStartDate());
           const week_end = formatDate(getWeekEndDate());
           const idToken = localStorage.getItem('firebaseIdToken');
           const response = await fetch(
            `http://localhost:5000/${team_id}/startreport/${week_start}/${week_end}`,
            {
              method: "POST",
              headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
            }
          );
          if (response.ok) {
            setStarted(true);
          } else {
            if(response.status === 403){
              window.location = '/login';
            }
          }
          
        } catch (err) {
          console.error(err.message);
        }
    };

    const submitReport = async (e) => {
      e.preventDefault();
      try {
         const week_start = formatDate(getWeekStartDate());
         const week_end = formatDate(getWeekEndDate());
         const plans = await getPlans(week_start,week_end);
         if (plans.length < 1){
          handleShowError();
          return;
         }
         else{
          const idToken = localStorage.getItem('firebaseIdToken');
          const response = await fetch(
          `http://localhost:5000/${team_id}/submitreport/${week_start}/${week_end}`,
          {
            method: "PUT",
            headers: { 'Authorization': `Bearer ${idToken}`, "Content-Type": "application/json" },
            //body: JSON.stringify(body)
          }
        );
        if (response.ok) {
          setSubmitted(true);
          handleShowSuccess();
        } else {
          if(response.status === 403){
            window.location = '/login';
          }
        }
        
      }    
    } catch (err) {
        console.error(err.message);
      }
  };

    
    return (
      <Fragment>
        {shouldRender? <div className='container'>
          <Header team_id={ team_id !== 'default' ? team_id : (teams ? "default" : teams[0].team_id)}/>
          
        </div>: null}
        <div className='container'>
          <h4 className="text-center mt-3" style={{color:'#8F0000', fontFamily: 'Lato'}}>Submit Weekly Report</h4>
          <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
          {teams.length>0 ? (<> {shouldRender? <div className='container' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className = "btn1 float-left" onClick={handlePreviousWeek}><AiFillCaretLeft></AiFillCaretLeft>Prev</button>
            <h5 className="text-center mr-1 ml-1" style={{color:'#8F0000', fontFamily: 'Lato'}}>
              Week : {getWeekStartDate().toDateString()} - {getWeekEndDate().toDateString()}
            </h5>
            <button className = "btn1 float-right" onClick={handleNextWeek}>Next<AiFillCaretRight></AiFillCaretRight></button>
          </div> : null}
          <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
          {started ? 
          (<div className='container'>
            <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Progress</h4>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <h6 style={{color:"#8f0000", marginBottom:"1rem"}}>Completed Planned Tasks</h6>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            {shouldRender? <div><CompletedPlannedTasks team_id={team_id} key={`CP${completedTasksRefreshCount}`} refreshCompletedTasks = {refreshCompletedTasks} refreshUncompletedTasks = {refreshUncompletedTasks} week_start = {formatDate(prevWeekStartDate())} week_end = {formatDate(prevWeekEndDate())}></CompletedPlannedTasks>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <h6 style={{color:"#8f0000", marginBottom:"1rem"}}>Uncompleted Planned Tasks</h6>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <UncompletedPlannedTasks team_id={team_id} key={`UP${uncompletedTasksRefreshCount}`} refreshCompletedTasks = {refreshCompletedTasks} refreshUncompletedTasks = {refreshUncompletedTasks} refreshProblems = {refreshProblems} prevweek_start = {formatDate(prevWeekStartDate())} prevweek_end = {formatDate(prevWeekEndDate())} week_start={formatDate(getWeekStartDate())} week_end={formatDate(getWeekEndDate())}></UncompletedPlannedTasks>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h6 style={{color:"#8f0000", marginBottom:"1rem"}}>Additional Tasks Completed</h6>
            <AddProgressRow team_id={team_id} refreshAdditionalCompletedTasks = {refreshAdditionalCompletedTasks}  week_start = {formatDate(getWeekStartDate())} week_end = {formatDate(getWeekEndDate())}></AddProgressRow>
            </div>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <AdditionalCompletedTasks team_id={team_id} key={`AP${additionalTasksRefreshCount}`} refreshAdditionalCompletedTasks = {refreshAdditionalCompletedTasks}  week_start = {formatDate(getWeekStartDate())} week_end = {formatDate(getWeekEndDate())}></AdditionalCompletedTasks>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Plans</h4>
              <AddPlan team_id={team_id} refreshPlans={refreshPlans} week_start={formatDate(getWeekStartDate())} week_end={formatDate(getWeekEndDate())}></AddPlan>
            </div>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <PlansList team_id={team_id} key={`PL${plansRefreshCount}`} refreshPlans={refreshPlans} week_start = {formatDate(getWeekStartDate())} week_end = {formatDate(getWeekEndDate())}></PlansList>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Problems</h4>
              <AddProblem team_id={team_id} refreshProblems={refreshProblems} week_start={formatDate(getWeekStartDate())} week_end={formatDate(getWeekEndDate())}></AddProblem>
            </div>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <ProblemsList team_id={team_id} key={`PR${problemsRefreshCount}`} refreshProblems={refreshProblems} week_start = {formatDate(getWeekStartDate())} week_end = {formatDate(getWeekEndDate())}></ProblemsList>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr></div>:null}
              {submitted  ? (<br></br>):(
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <button style={{ borderRadius: '50px', padding: '10px 20px' , margin:'1rem'}} onClick={submitReport}>Submit this week's report</button>
            </div>)}
            </div>) : 
            (<>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <h5 className="center mt-3">You have not started this week's report.</h5>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <button style={{ borderRadius: '50px', padding: '10px 20px' , margin:'3rem'}} onClick={startReport}>Start this week's report</button>
            </div>
            </>)}
        </>) : (<h5 className="ml-3 text-center">Welcome! You are currently not added to any team. Please wait to be added or reach out to the admin</h5>)}
        </div>
        <div>
          <Footer team_id={team_id !== 'default' ? team_id : (teams ? "default" : teams[0].team_id)}/>
        </div>
        <Modal
          show={showSuccess}
          onHide={handleCloseSuccess}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ color:'green', fontFamily: 'Lato'}}>Submitted Weekly Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5 style={{ fontFamily: 'Lato'}}>You have successfully submitted this week's report</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseSuccess}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showError}
          onHide={handleCloseError}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ color:'red',fontFamily: 'Lato'}}>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5 style={{ fontFamily: 'Lato'}}>Please add at least one Plan for the next week</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseError}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
     </Fragment> 
    );
  }
  
  export default WeeklyReport;