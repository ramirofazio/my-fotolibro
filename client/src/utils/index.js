import axios from 'axios';

export async function uploadImagesCloudinary(images = [], clientId = '') {
  if (!clientId) return;

  const cloud_name = import.meta.env.CLOUDINARY_CLOUD_NAME;

  const URL = 'https://api.cloudinary.com/v1_1/dnxa8khx9/image/upload';

  const photos = [];
  const promises = [];

  images.forEach(({ file }) => {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('upload_preset', clientId);
    promises.push(axios.post(URL, formdata));
  });

  try {
    const responses = await Promise.all(promises);
    responses.forEach((res, i) => {
      console.log('Data response', res.data);
      const data = res?.data;
      if (data.secure_url) {
        photos.push({
          ...images[i],
          URL: data.secure_url,
          id: data.asset_id,
          upload: true,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }

  return photos;
}

export function isValidClient({ name, email }) {
  const errs = {};
  if (!name) {
    errs.name = 'ingrese un nombre';
  }
  if (!email) {
    errs.email = 'ingrese un email';
  }
  return errs;
}
/**
 *  async function handleImgsUpload(files) {
    let links = [];
    let mockCounter = 1;
    let imgsDB = [];
    // setLoader
    for (const img in files) {
      try {
        const formData = new FormData();
        formData.append('file', files[img]);
        formData.append('upload_preset', clientId);
        formData.append('public_id', img);
        const { data } = await axios.post(
          'https://api.cloudinary.com/v1_1/dnxa8khx9/image/upload',
          formData
        );
        imgsDB.push({
          URL: data.secure_url,
          index: mockCounter,
          originalName: img,
        });
        links.push(data.secure_url);
        mockCounter = mockCounter + 1;
      } catch (e) {
        console.log(e);
      }
    }
    // setLoader
    const res = await API.uploadImagesDB({ clientId, imgs: imgsDB });
    console.log(res);
    return links;
  }
 */

export function getSizeImage(size) {
  const DECIMALS = 3;

  let bytes = Number(size);

  if (bytes < 1048576) {
    return (bytes / 1024).toFixed(DECIMALS) + ' KB';
  } else {
    return (bytes / 1048576).toFixed(DECIMALS) + ' MB';
  }
}
