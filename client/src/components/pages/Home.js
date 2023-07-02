import React, { Fragment, useState, useEffect } from "react";
import HomePlannedTasks from "../HomePlannedTasks"
import ReportCards from "../ReportCards";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date("Mon Feb 08 2022 05:30:00 GMT+0530 (India Standard Time)"));
  const [homeTasksRefreshCount, setHomeTasksRefreshCount] = useState(0);


  const refreshHomeTasks = () => {
    setHomeTasksRefreshCount(homeTasksRefreshCount + 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    //console.log("formatted weekend "+formatDate(date));
    return date;
  };

  const prevWeekEndDate = () => {
    const date = getWeekEndDate();
    date.setDate(date.getDate() - 7);
    //setCurrentWeekEnd(new Date(date.setDate(diff)));
    //console.log("formatted weekend "+formatDate(date));
    return date;
  };



  return(<Fragment>
  <div>
    <h4 className="text-center mt-3" style={{color:'#8F0000', fontFamily: 'Lato'}}>Home</h4>
    <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
    <div className='container'>

          <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Planned Tasks for this week</h4>
          <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>

          <HomePlannedTasks key={`HP${homeTasksRefreshCount}`} refreshHomeTasks = {refreshHomeTasks} prevweek_start = {formatDate(prevWeekStartDate())} prevweek_end = {formatDate(prevWeekEndDate())} week_start={formatDate(getWeekStartDate())} week_end={formatDate(getWeekEndDate())}></HomePlannedTasks>
          <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
          <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Past Weekly Reports</h4>
          <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
          <ReportCards></ReportCards>
    </div>


  
     
     </div>

                
     </Fragment>)
  }