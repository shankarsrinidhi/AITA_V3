import React, { Fragment, useEffect, useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

import { Link, useNavigate } from 'react-router-dom';

const InstProblemsReported = ({course_id, week_start, week_end}) => {
  const [problems, setProblems] = useState([]);
  const [listShown, setListShown] = useState([]);
  const [probDetailsShown, setProbDetailsShown] = useState([]);
  const navigate = useNavigate();

  const getProblems = async () => {
    try {
      const idToken = localStorage.getItem('firebaseIdToken');
      const response = await fetch(`http://localhost:5000/${course_id}/problems/${week_start}/${week_end}/check`,
      {
        method: "GET",
        headers: { 'Authorization': `Bearer ${idToken}` }
    });
    if (response.ok) {
      const jsonData = await response.json();
      setProblems(jsonData);
      console.log(problems);
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
    getProblems();
  }, []);



  const toggleShown = team_id => {
    const shownState = listShown.slice();
    const index = shownState.indexOf(team_id);
    if (index >= 0){
      shownState.splice(index, 1);
      setListShown(shownState);
    }
    else{
      shownState.push(team_id);
      setListShown(shownState);
    }
  }

  const problemsToggleShown = problem_id => {
    const shownState = probDetailsShown.slice();
    const index = shownState.indexOf(problem_id);
    if (index >= 0){
      shownState.splice(index, 1);
      setProbDetailsShown(shownState);
    }
    else{
      shownState.push(problem_id);
      setProbDetailsShown(shownState);
    }
  }

  return (
    <Fragment>
  {problems.length < 1 ? (
    <>
      <hr style={{ color: '#8f0000', width: '100%', margin: '20px auto' }} />
      <h6 className="ml-3">No Problems reported by any teams this week</h6>
      <hr style={{ color: '#8f0000', width: '100%', margin: '20px auto' }} />
    </>
  ) : (
    <table className="table mt-3">
      <tbody>
        {problems.map((problem) => (
          <Fragment key={problem.team_id}>
            <tr>
              <td className ="expand">
                <button className="btn3 float-left" onClick={() => toggleShown(problem.team_id)}>
                  <MdOutlineArrowForwardIos style={{ fontSize: '0.75rem' }}></MdOutlineArrowForwardIos>
                </button>
              </td>
              <td>{problem.team_name}</td>
              <td className ="expand">
                <button className="btn3 float-right" onClick={() => navigate(`/InstWeeklyReport/${week_end}/course/${course_id}/selectedteam/${problem.team_id}`)}>
                  View Full Report
                </button>
              </td>
            </tr>
            {listShown.includes(problem.team_id) && (
              <tr>
                <td colSpan="3" style={{ paddingLeft: '2rem' }}>
                  <h5 style={{ color: '#8f0000' }}>Problems</h5>
                  <table className="table mt-3">
                    <tbody>
                      {problem.team_problems.map((p, index) => (
                        <Fragment key={p.problem_id}>
                          <tr>
                            {p.problem_id ? (
                              <>
                                <td className ="expand">
                                  <button className="btn3" onClick={() => problemsToggleShown(p.problem_id)}>
                                    <MdOutlineArrowForwardIos style={{ fontSize: '0.75rem' }}></MdOutlineArrowForwardIos>
                                  </button>
                                </td>
                                <td className ="expand" style={{ paddingLeft: '1rem' }}>{index + 1}</td>
                                <td style={{ paddingLeft: '2rem' }}>{p.problem_title}</td>
                              </>
                            ) : (
                              <td colSpan="3">
                                <h6 style={{ marginLeft: '1.5rem' }}>No problems</h6>
                              </td>
                            )}
                          </tr>
                          {probDetailsShown.includes(p.problem_id) && (
                            <tr>
                              <td colSpan="3" style={{ paddingLeft: '2rem', width:'100%' }}>
                                <h6 style={{ color: '#8f0000' }}>Description</h6>
                                {p.description}
                                <br></br>
                                <br></br>
                                <h6 style={{ color: '#8f0000' }}>Mitigation Steps</h6>
                                {p.mitigation}
                                <br></br>
                                <br></br>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  )}
</Fragment>
  );
};

export default InstProblemsReported;
