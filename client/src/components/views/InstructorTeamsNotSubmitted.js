import React, { Fragment, useEffect, useState } from "react";


const InstructorTeamsNotSubmitted = ({course_id, week_start, week_end}) => {
  const [teamList, setTeamList] = useState([]);

  const getNotSubmittedTeams = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const response = await fetch(`http://localhost:5000/${course_id}/notsubmitted/${week_start}/${week_end}/check`,
      {
        method: "GET",
        headers: { 'Authorization': `Bearer ${idToken}` }
    });
    if (response.ok) {
      const jsonData = await response.json();
      setTeamList(jsonData);
      console.log(teamList);
      console.log(jsonData);
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
    getNotSubmittedTeams();
  }, []);



  return (
    <Fragment>
  {teamList.length < 1 ? (
    <>
      <hr style={{ color: '#8f0000', width: '100%', margin: '20px auto' }} />
      <h6 className="ml-3">All teams submitted their weekly reports</h6>
      <hr style={{ color: '#8f0000', width: '100%', margin: '20px auto' }} />
    </>
  ) : (
    <table className="table mt-3">
      <tbody>
        {teamList.map((team, index) => (
          <Fragment key={team.team_id}>
            <tr>
              <td className ="expand" style={{ paddingLeft: '0.5rem' }}>{index + 1}.</td>
              <td style={{ paddingLeft: '1rem' }}>{team.team_name}</td>
            </tr>
            
          </Fragment>
        ))}
      </tbody>
    </table>
  )}
</Fragment>
  );
};

export default InstructorTeamsNotSubmitted;
