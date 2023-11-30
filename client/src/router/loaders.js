import {API} from "../api_instance/index"

export async function verifyClient({ params }) {
  return (await API.getCLientById(params.clientId)).data;
}

export async function getPrevImgs({ params }) {
  return (await API.getImages(params.clientId)).data;
}
export async function connectClient({ params }) {
  const client = (await API.getCLientById(params.clientId)).data;
  await API.connectClient(params.clientId)
  return client
}