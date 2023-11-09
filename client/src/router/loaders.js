import {API} from "../api_instance/index"

export async function verifyClient({ params }) {
  console.log(params.clientId);

  return (await API.getClientVerification(params.clientId)).data;
}

export async function getPrevImgs({ params }) {
  return (await API.getImages(params.clientId)).data;
}