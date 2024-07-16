import React, { createContext, useState } from "react";

// Context oluştur
export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [value, setValue] = useState(0);

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
