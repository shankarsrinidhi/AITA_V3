import React, { Fragment, useState } from "react";
import HomePlannedTasks from "../views/HomePlannedTasks"
import ReportCards from "../views/ReportCards";
import Header from "../views/Header";
import Footer from "../views/Footer";

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



  return(
  <Fragment>
    <div className='container'>
      <Header/>
      <h4 className="text-center mt-3" style={{color:'#8F0000', fontFamily: 'Lato'}}>Home</h4>
      <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
    </div>
    <div>
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
    <div>
       <Footer />
    </div>         
  </Fragment>
  )
  }