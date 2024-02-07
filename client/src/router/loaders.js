import { API } from '../api_instance/index'

export async function verifyClient({ params }) {
  const { data } = await API.getCLientById(params.clientId)

  if (!data) {
    throw new Error('Link deshabilitado', { cause: 'zaracatunga' })
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
