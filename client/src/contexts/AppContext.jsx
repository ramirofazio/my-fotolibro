import { createContext, useContext, useState } from 'react';

const AppContext = createContext({ images: [] });

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [images, setImages] = useState([]);

  const addImages = (images) => {
    setImages((cur) => [...cur, images]);
  };

  const removeImages = (index) => {
    setImages((cur) => cur.filter((img, i) => i !== index));
  };

  return (
    <AppContext.Provider value={{ images, addImages, removeImages }}>
      {children}
    </AppContext.Provider>
  );
};
