import React, { Fragment, useState } from "react";
import Footer from '../../views/CommonPortalViews/Footer';
import Header from '../../views/CommonPortalViews/Header';
import { useParams } from 'react-router-dom';
import InstProblemsReported from "../../views/InstructorPortalViews/InstProblemsReported";
import InstructorTeamsNotSubmitted from "../../views/InstructorPortalViews/InstructorTeamsNotSubmitted";
import InstructorLateSubmission from "../../views/InstructorPortalViews/InstructorLateSubmission";


export default function InstructorHome(){
    const { course_id } = useParams();
    const [shouldRender, setShouldRender] = useState(false);

    setTimeout(() => {
        setShouldRender(true);
      }, 500);

    return(
        <Fragment>
          {shouldRender?<div className='container'>
          <Header course_id={course_id}/> 
            <h4 className="text-center mt-3" style={{color:'#8F0000', fontFamily: 'Lato'}}>Dashboard</h4>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
          </div> : null}
          <div className='container'>
            <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Problems reported by teams this week</h4>
            
            <InstProblemsReported course_id={course_id} week_end="2022-02-05" week_start="2022-01-30"/>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Teams that did not submit this week's report</h4>
            
            <InstructorTeamsNotSubmitted course_id={course_id} week_end="2022-02-05" week_start="2022-01-30"/>
            
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
            <h4 style={{color:'#8F0000', fontFamily: 'Lato'}}>Teams that submitted this week's report late</h4>
            <InstructorLateSubmission course_id={course_id} week_end="2022-02-05" week_start="2022-01-30"/>
            <hr style={{color: '#8f0000', width: '100%', margin: '20px auto'}}></hr>
        </div>
          <div>
             <Footer course_id={ course_id }/>
          </div>         
        </Fragment>
        )
}