import axios from 'axios'
import { API } from '../api_instance'

export async function uploadImagesCloudinary(images = [], clientId = '') {
  if (!clientId) return

  const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

  const URL = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`

  const photos = {}
  const promises = []

  images.forEach(({ file, originalName, upload }) => {
    // TODO integrar compressor.js aqui
    if (!upload) {
      const formdata = new FormData()
      formdata.append('file', file)
      formdata.append('upload_preset', clientId)
      formdata.append('filename_override', originalName)
      formdata.append('public_id', `000-"${originalName}"`)
      promises.push(axios.post(URL, formdata))
    }
  })

  try {
    const responses = await Promise.all(promises)
    responses.forEach(({ data }) => {
      if (data.secure_url) {
        photos[data.original_filename] = {
          URL: data.secure_url,
          id: data.asset_id,
          originalName: data.original_filename,
          size: data.bytes,
          publicId: data.public_id,
        }
      }
    })
    // TODO Guardar en DB
    API.uploadImagesDB({ clientId, imgs: Object.values(photos) })
  } catch (err) {
    console.log(err)
  }

  return photos
}

export function isValidClient({ name, email, dni, phone }) {
  const errs = {}
  if (!name) errs.name = 'ingrese un nombre'

  if (!email) errs.email = 'ingrese un email'
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|gob|com\.ar|gob\.ar)$/.test(email)
  )
    errs.email = 'ingrese un email valido'

  if (!dni) errs.dni = 'ingrese DNI'
  if (dni?.length < 7) errs.dni = 'ingrese un DNI valido'
  if (dni?.length > 15) errs.dni = 'ingrese un DNI Ccatua'

  if (!phone) errs.phone = 'ingrese un numero'
  if (phone?.length < 7) errs.phone = 'ingrese un numero valido'
  if (phone?.length > 18) errs.phone = 'ingrese un numero valido'

  return errs
}

export function getSizeImage(size) {
  const DECIMALS = 3

  let bytes = Number(size)

  if (bytes < 1048576) {
    return (bytes / 1024).toFixed(DECIMALS) + ' KB'
  } else {
    return (bytes / 1048576).toFixed(DECIMALS) + ' MB'
  }
}
