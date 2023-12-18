import React, { useState, useContext } from 'react';
import { FaBars } from "react-icons/fa";
import "../css_components/NavigationDropdown.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { CourseContext } from '../../contexts/CourseContext';


const InstructorNavigationDropdown = ({course_id}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const {courses, setSelectedCourse } = useContext(CourseContext);

  setTimeout(() => {
    setShouldRender(true);
  }, 500);

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

  async function selectCourse(course){
    await setSelectedCourse(course);

    window.location = `/InstHome/${course.course_id}`;

  }



  return (
    <div className="float-right">
      <div onClick={toggleDropdown} className={`hamburger-icon ${isOpen ? 'active' : ''}`}>
      <FaBars style={{color: '#8f0000', fontSize: '50px', padding: '7.5px', marginTop:'05px'}}/>
      </div>
      {isOpen && shouldRender && (
        <div className="dropdown">
        <ul>
        { courses?.length > 0 ?
        <> <li>Switch to a different Course :</li>
          <ul>
              {courses?.map((course, index) =>(
                  <li key= {index} className='li2' onClick={() => selectCourse(course)}>{course.course_code} - {course.course_description}</li>

              ))}
          </ul>
          <li onClick={() => {navigate(`/editCourse/${course_id}`)}}>Edit Course</li></> : <></>}
          {course_id === undefined ? <></>:<> <li onClick={() => {navigate(`/newCourse/${course_id}`)}}>Create New Course</li></>}
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>
        
      )}
    </div>
  );
};

export default InstructorNavigationDropdown;