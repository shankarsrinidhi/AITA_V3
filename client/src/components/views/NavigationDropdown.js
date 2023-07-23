import React, { useState, useContext } from 'react';
import { FaBars } from "react-icons/fa";
import "../css_components/NavigationDropdown.css";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { TeamContext } from '../../contexts/TeamContext';
//styles 



const NavigationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const {teams, setTeams, setSelectedTeam, selectedTeam, setCount, count} = useContext(TeamContext);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  async function handleLogout() {
    setError("")

    try {
      await logout();
      localStorage.removeItem('firebaseIdToken');
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  async function selectTeam(team){
    await setSelectedTeam(team);

    window.location = `/home/${team.team_id}`;

  }


  return (
    <div className="float-right">
      <div onClick={toggleDropdown} className={`hamburger-icon ${isOpen ? 'active' : ''}`}>
      <FaBars style={{color: '#8f0000', fontSize: '50px', padding: '7.5px', marginTop:'05px'}}/>
      </div>
      {isOpen && (
        <div className="dropdown">
          <ul>
            <li>Switch to a different Team :</li>
            <ul>
                {teams?.map((team, index) =>(
                    <li key= {index} className='li2' onClick={() => selectTeam(team)}>{team.team_name}</li>

                ))}
            </ul>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavigationDropdown;