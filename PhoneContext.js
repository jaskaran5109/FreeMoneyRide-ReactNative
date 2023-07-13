import React, { createContext, useState } from 'react';

export const PhoneContext = createContext();

export const PhoneProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');

  const [token,setToken]=useState('')

  return (
    <PhoneContext.Provider value={{ phoneNumber, setPhoneNumber,code, setCode,token,setToken}}>
      {children}
    </PhoneContext.Provider>
  );
};
