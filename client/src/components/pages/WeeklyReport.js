
  import React, { Fragment, useState } from "react";
  import { AiFillCaretRight } from "react-icons/ai";
  import { AiFillCaretLeft } from "react-icons/ai";
  import '../css_components/WeeklyReport.css'
  

  import 'bootstrap/dist/css/bootstrap.min.css';
  import Progress from "../Progress";
import DraggableCardList from "../DraggableCardList";
import CompletedPlannedTasks from "../CompletedPlannedTasks";
  
  
  

  function WeeklyReport() {
    const [currentDate, setCurrentDate] = useState(new Date("Mon Jan 31 2022 05:30:00 GMT+0530 (India Standard Time)"));
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const [currentWeekEnd, setCurrentWeekEnd] = useState(new Date());

    const [refreshCount, setRefreshCount] = useState(0);

    const handleRefresh = () => {
      // Increment the refresh count to trigger a refresh
      setRefreshCount(refreshCount + 1);
    };

    const [languages, setLanguages ] = useState(["JavaScript", "Python", "TypeScript"]);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    

    

    console.log("current date "+currentDate);
  
    const handlePreviousWeek = () => {
      const previousWeek = new Date(currentDate);
      previousWeek.setDate(currentDate.getDate() - 7);
      setCurrentDate(previousWeek);
      setRefreshCount(refreshCount + 1);
    };
  
    const handleNextWeek = () => {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(currentDate.getDate() + 7);
      setCurrentDate(nextWeek);
      setRefreshCount(refreshCount + 1);

      console.log("date "+currentDate, " formatted date "+formatDate(currentDate));
    };
    
    const getWeekStartDate = () => {
      const date = new Date(currentDate);
      const dayOfWeek = date.getDay();
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 0); // Adjust for Sunday
      //console.log("formatted weekstart "+formatDate(new Date(date.setDate(diff))));
      return new Date(date.setDate(diff));
    };
  
    const getWeekEndDate = () => {
      const date = new Date(currentDate);
      const dayOfWeek = date.getDay();
      const diff = date.getDate() + (5 - dayOfWeek) + (dayOfWeek === 0 ? 0 : 1); // Adjust for Sunday
      //setCurrentWeekEnd(new Date(date.setDate(diff)));
      //console.log("formatted weekend "+formatDate(new Date(date.setDate(diff))));
      return new Date(date.setDate(diff));
    };


    const prevWeekStartDate = () => {
      const date = getWeekStartDate();
      date.setDate(date.getDate() - 7);
      //setCurrentWeekEnd(new Date(date.setDate(diff)));
      console.log("formatted weekend "+formatDate(date));
      return date;
    };

    const prevWeekEndDate = () => {
      const date = getWeekEndDate();
      date.setDate(date.getDate() - 7);
      //setCurrentWeekEnd(new Date(date.setDate(diff)));
      console.log("formatted weekend "+formatDate(date));
      return date;
    };

    
  
    const handleSubmit = (event) => {
      event.preventDefault();
      // Handle form submission for the current week
    };
  
    return (
    <Fragment>
      <div>
        <h4 className="text-center mt-3" style={{color:'#8F0000', fontFamily: 'Lato'}}>Submit Weekly Report</h4>
        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className = "btn1 float-left" onClick={handlePreviousWeek}><AiFillCaretLeft></AiFillCaretLeft>Prev</button>
          <h5 className="text-center mr-1 ml-1" style={{color:'#8F0000', fontFamily: 'Lato'}}>
            Week : {getWeekStartDate().toDateString()} - {getWeekEndDate().toDateString()}
          </h5>

          <button className = "btn1 float-right" onClick={handleNextWeek}>Next<AiFillCaretRight></AiFillCaretRight></button>
        </div>
        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        <div className='container'>

        <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Progress</h4>
        <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        <h6 style={{color:"#8f0000", marginBottom:"1.5rem"}}>Completed Planned Tasks</h6>

          <CompletedPlannedTasks key={refreshCount} week_start = {formatDate(prevWeekStartDate())} week_end = {formatDate(prevWeekEndDate())}></CompletedPlannedTasks>
          
          <h6 style={{color:"#8f0000", marginBottom:"1.5rem"}}>Uncompleted Planned Tasks</h6>

          <h6 style={{color:"#8f0000", marginBottom:"1.5rem"}}>Additional Tasks Completed</h6>

        </div>

        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <button type="submit">Submit</button>
        </form>

      </div>
      </Fragment>
    );
  }
  
  export default WeeklyReport;