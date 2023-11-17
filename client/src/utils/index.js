import axios from 'axios';

export async function uploadImagesCloudinary(files = [], clientId) {
  const cloud_name = import.meta.env.CLOUDINARY_CLOUD_NAME;

  const URL = 'https://api.cloudinary.com/v1_1/' + cloud_name + '/image/upload';

  const photos = [];
  const promises = [];

  files.forEach((file) => {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('upload_preset', clientId);
    promises.push(axios.post(URL, formdata));
  });

  try {
    const responses = await Promise.all(promises);
    responses.forEach((res) => {
      const url = res?.data?.secure_url;
      if (url) {
        photos.push(url);
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