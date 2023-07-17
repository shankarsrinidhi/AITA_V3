

import { createContext, useState } from 'react';

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [count, setCount] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <TeamContext.Provider value={{ teams, setTeams, selectedTeam, setSelectedTeam, count, setCount }}>
      {children}
    </TeamContext.Provider>
  );
};