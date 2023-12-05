import { createContext, useState } from 'react';

export const PlayerContext = createContext({
  currentTrack: {},
  setCurrentTrack: () => {},
});

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState();
  return (
    <PlayerContext.Provider value={{ currentTrack, setCurrentTrack }}>
      {children}
    </PlayerContext.Provider>
  );
};
