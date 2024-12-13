'use client';

import { ActiveSchool } from 'models/schools/activeSchool';
import React, { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

const AppContext = createContext<AppContextModel>({} as AppContextModel);

export interface AppContextModel {
  activeSchool: ActiveSchool;
  setActiveSchool: Dispatch<SetStateAction<ActiveSchool>>;
}

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const school: ActiveSchool = {
    id: 'uuid',
    schoolName: 'Testovací škola v kontextu',
    country: 0
  };

  const [activeSchool, setActiveSchool] = useState<ActiveSchool>(school);

  return <AppContext.Provider value={{ activeSchool, setActiveSchool }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
