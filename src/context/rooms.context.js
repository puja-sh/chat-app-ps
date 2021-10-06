import React, { createContext, useContext, useEffect, useState } from 'react';
import { database } from '../misc/firebase';
import { transformIntoArray } from '../misc/helper';

const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState();

  useEffect(() => {
    const roomListRef = database.ref(`rooms`);

    roomListRef.on('value', snap => {
      const data = transformIntoArray(snap.val());
      setRooms(data);
    });
    return () => {
      roomListRef.off();
    };
  }, []);
  return (
    <RoomsContext.Provider value={rooms}> {children} </RoomsContext.Provider>
  );
};

export const useRooms = () => useContext(RoomsContext);
