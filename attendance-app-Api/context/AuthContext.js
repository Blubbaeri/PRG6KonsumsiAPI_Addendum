import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData] = useState({
    nimMhs: "0325260031",
    nama: "Budi Susanto"
  });

  const BASE_URL = "http://192.168.100.6:8080/api/presensi";

  return (
    <AuthContext.Provider value={{ userData, BASE_URL }}>
      {children}
    </AuthContext.Provider>
  );
};
