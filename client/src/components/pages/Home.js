import React, { Fragment, useState, useEffect, useContext } from "react";
import HomePlannedTasks from "../views/HomePlannedTasks"
import ReportCards from "../views/ReportCards";
import Header from "../views/Header";
import Footer from "../views/Footer";
import { useAuth } from "../../contexts/AuthContext"
import { TeamContext } from '../../contexts/TeamContext';
import { useParams } from 'react-router-dom';

export default function Home() {

  const [shouldRender, setShouldRender] = useState(false);

  

  const { currentUser, logout } = useAuth()
  const {teams, setTeams,  selectedTeam, count} = useContext(TeamContext);
  const getTeams = async e => {
    try {
      const id =  currentUser.email;
      const body = { id };
      const response = await fetch(
        `http://localhost:5000/teams`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      const jsonData = await response.json();
      setTeams(jsonData);

    } catch (err) {
      console.error(err.message);
    }
  };
  
  useEffect(() => {
    getTeams();
  },[]);
//console.log("teams in home"+teams);

// Simulating a delay before rendering the component
setTimeout(() => {
  setShouldRender(true);
}, 500);

  const { team_id } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date("Mon Feb 08 2022 05:30:00 GMT+0530 (India Standard Time)"));
  const [homeTasksRefreshCount, setHomeTasksRefreshCount] = useState(0);
  
  const [welcome, setWelcome] = useState(true);
 
  //const [teams, setTeams] = useState([]);

  const getWelcome = async () => {
    try {
      const response = await fetch(`http://localhost:5000/userteam/${currentUser.email}`);
      const jsonData = await response.json();
      setWelcome(jsonData.result);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getWelcome();
  }, []);

  //add Problem function
  
//console.log("count "+count);




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
    {shouldRender?<div className='container'>
    <Header team_id={ team_id !== "default" ? team_id : (teams?.length > 0 ?  teams[0]?.team_id : "default")}/> 
      <h4 className="text-center mt-3" style={{color:'#8F0000', fontFamily: 'Lato'}}>Home</h4>
      <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
    </div> : null}
    {teams.length>0 ?(<div>
      {shouldRender?<div className='container'>
            <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Planned Tasks for this week</h4>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <HomePlannedTasks key={`HP${homeTasksRefreshCount}`} refreshHomeTasks = {refreshHomeTasks} 
              prevweek_start = {formatDate(prevWeekStartDate())} prevweek_end = {formatDate(prevWeekEndDate())} 
              week_start={formatDate(getWeekStartDate())} week_end={formatDate(getWeekEndDate())}
              team_id={ team_id !== "default" ? team_id : (teams?.length > 0 ?  teams[0]?.team_id : "default")}>
            </HomePlannedTasks>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Past Weekly Reports</h4>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <ReportCards team_id={ team_id !== "default" ? team_id : (teams?.length > 0 ?  teams[0]?.team_id : "default")}></ReportCards>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
      </div> : null}
    </div>):(<div className="container"><h5 className="ml-3 text-center">Welcome! You are currently not added to any team. Please wait to be added or reach out to the admin</h5></div>)}
    <div>
       <Footer team_id={team_id !== "default" ? team_id : (teams.length > 0 ?  teams[0].team_id : "default")}/>
    </div>         
  </Fragment>
  )
  }