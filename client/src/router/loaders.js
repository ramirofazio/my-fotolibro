import { API } from '../api_instance/index'

export async function verifyClient({ params }) {
  const { data } = await API.getCLientById(params.clientId)

  if (!data) { // SI esta deshabilitado el link
    throw new Error('Link deshabilitado', { cause: 'zaracatunga' })
  }

  if(data.online) {
    console.log("client:", data)
    throw new Response("CONNECTED", { status: 404 });
  }

  if (!data.active_link) { 
    console.log("active:", data.active_link)
    throw new Error('Usuario Finalizo el libro', { cause: 'END' })
  }

  return data
}

export async function getPrevImgs({ params }) {
  return (await API.getImages(params.clientId)).data
}
export async function connectClient({ params }) {
  const client = (await API.getCLientById(params.clientId)).data
  await API.connectClient(params.clientId)
  return client
}
