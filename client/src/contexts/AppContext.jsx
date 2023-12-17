import { createContext, useContext, useState } from 'react';

const AppContext = createContext({ images: [] });

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [Steps, setSteps] = useState({
    0: {
      to: 'client_data',
      access: true,
      text: 'Completa tus datos',
    },
    1: {
      to: 'upload_images',
      access: false,
      text: 'Subi tus fotos',
    },
    2: {
      to: 'sort_images',
      access: false,
      text: 'Ordena tus fotos',
    },
  });

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
      pending: Math.max(0, cur.pending - number),
      uploaded: Math.min(cur.uploaded + number, images.length),
    }));
    setImages(uploaded);
  };

  const removeImages = (index, type = 'pending') => {
    setStatus((cur) => ({
      ...cur,
      [type]: Math.max(0, cur[type] - 1),
    }));
    setImages((cur) => cur.filter((img, i) => i !== index));
  };

  const reorderImages = (images) => {
    setImages(images);
  };

  const existImage = (nameImage) => {
    if (images.length === 0) return null;

    const objWithKeys = images.reduce((acc, obj) => {
      acc[obj.originalName] = obj;
      return acc;
    }, {});

    return !!objWithKeys[nameImage];
  };

  const updateInfoImages = (images) => {
    setImages(
      images.map((image) => ({
        ...image,
        upload: true,
      }))
    );
    setStatus((cur) => ({
      ...cur,
      uploaded: images.length,
    }));
  };

  const arrayToObject = () => {
    const objWithKeys = images.reduce((acc, obj) => {
      acc[obj.originalName] = obj;
      return acc;
    }, {});

    return objWithKeys;
  };

  const getSteps = () => {
    const routes = [];
    for (const key in Steps) {
      routes.push(Steps[key]);
    }
    return routes;
  };

  const handleNextStep = ({ index, access }) => {
    if (index === undefined) return;
    setSteps((cur) => ({
      ...cur,
      [index]: {
        ...cur[index],
        access,
      },
    }));
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
        existImage,
        updateInfoImages,
        handleNextStep,
        getSteps,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
