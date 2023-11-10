import axios from 'axios';

export async function uploadImagesCloudinary(files = []) {
  const cloud_name = import.meta.env.CLOUD_NAME || '';
  const preset_key = import.meta.env.PRESET_KEY || '';

  const URL = 'https://api.cloudinary.com/v1_1/' + cloud_name + '/image/upload';

  const images_urls = [];
  const promises = [];

  files.forEach((file) => {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('upload_preset', preset_key);
    promises.push(axios.post(URL, formdata));
  });

  try {
    const responses = await Promise.all(promises);
    console.log(promises[0]);
    responses.forEach((res) => {
      const url = res?.data?.secure_url;
      if (url) {
        images_urls.push(url);
      }
    });
  } catch (err) {
    console.log(err);
  }

  return images_urls;
}

export function isValidClient({name, email}) {
  const errs = {}
  if(!name) {
    errs.name = "ingrese un nombre"
  }
  if(!email) {
    errs.email = "ingrese un email"
  }
  return errs
}
