import { API } from "../api_instance/index";

export async function verifyClient({ params }) {
  const { data } = await API.getCLientById(params.clientId);

  if (!data) {
    // SI esta deshabilitado el link
    throw new Error("Link deshabilitado", { cause: "zaracatunga" });
  }

  if (!data.active_link) {
    throw new Response(JSON.stringify({ type: "END_BOOK", client: data }), {
      status: 404,
    });
  }
  
  if (data.online) {
    throw new Response(JSON.stringify({ type: "CONNECTED", client: data }), {
      status: 409,
    });
  }

  
  console.log(data.online)
  return data;
}

export async function getPrevImgs({ params }) {
  return (await API.getImages(params.clientId)).data;
}
export async function connectClient({ params }) {
  const client = (await API.getCLientById(params.clientId)).data;
  await API.connectClient(params.clientId);
  return client;
}
