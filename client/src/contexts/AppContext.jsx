import { createContext, useContext, useState } from 'react';

const AppContext = createContext({ images: [] });

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState({
    uploaded: 0,
    pending: 0,
  });

  const addImages = (images) => {
    setImages((cur) => {
      if (Array.isArray(images)) {
        setStatus((cur) => ({
          ...cur,
          pending: cur.pending + images.length,
        }));
        return [...cur, ...images];
      }
      setStatus((cur) => ({
        ...cur,
        pending: cur.pending + 1,
      }));
      return [...cur, images];
    });
  };

  const addImagesUploaded = (ImagesUploaded) => {
    const number = Object.keys(ImagesUploaded).length;
    if (number === 0) return;
    const uploaded = images.map((image) => {
      if (ImagesUploaded[image.originalName]) {
        return {
          ...image,
          URL: ImagesUploaded[image.originalName].URL,
          upload: true,
        };
      }

      return image;
    });

    setStatus((cur) => ({
      ...cur,
      pending: cur.pending - number,
      uploaded: cur.uploaded + number,
    }));
    setImages(uploaded);
  };

  const removeImages = (index, type = 'pending') => {
    setStatus((cur) => ({
      ...cur,
      [type]: cur[type] - 1,
    }));
    setImages((cur) => cur.filter((img, i) => i !== index));
  };

  const reorderImages = (images) => {
    setImages(images);
  };

  return (
    <AppContext.Provider
      value={{
        images,
        addImages,
        removeImages,
        reorderImages,
        addImagesUploaded,
        status,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
