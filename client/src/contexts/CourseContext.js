import { createContext, useState } from 'react';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [count, setCount] = useState(0);
  const [selectedCourse, setSelectedCourse ] = useState(null);

  return (
    <CourseContext.Provider value={{ courses, setCourses, selectedCourse, setSelectedCourse, count, setCount }}>
      {children}
    </CourseContext.Provider>
  );
};