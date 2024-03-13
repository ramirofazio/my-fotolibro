// import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";
import * as zip from "@zip.js/zip.js";

const {
  BlobWriter,
  Uint8ArrayWriter,
  HttpReader,
  TextReader,
  ZipWriter,
  Uint8ArrayReader,
} = zip;

export async function hanldeZip(url) {
  const fileWriter = new Uint8ArrayWriter();
  const fileReader = new HttpReader(url);

  const zipWriter = new ZipWriter(fileWriter);
  await zipWriter.add("sapo.zip", fileReader);
  await zipWriter.close();

  const zipFileBlob = await fileWriter.getData();

  console.log(zipFileBlob);

  //const zipFileWriter = new Uint8ArrayWriter();

  // const arr = new Uint8ArrayReader(fetch.reader.data)
  // await arr.init()
  // console.log(arr)
  // const l = await arr.readUint8Array(0, arr.size)
  // console.log(arr)

  // JSZipUtils.getBinaryContent(url, function (err, data) {
  //   if(err) {
  //     throw err
  //   } else {
  //     console.log(data)
  //   }
  // });
}

/*eslin-disabled*/

// --- JSZip = trash
// export function readRemoteZip(url) {
//   new JSZip.external.Promise(function (resolve, reject) {
//     JSZipUtils.getBinaryContent(url, function (err, data) {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data);
//       }
//     });
//   })
//     .then(function (data) {
//       return JSZip.loadAsync(data);
//     })
//     .then((zip) => console.log(zip));
// }

// export async function hanldeZip(url) {
//   console.log(url);
//   try {
//     await JSZipUtils.getBinaryContent(url, async (err, data) => {
//       if (err) {
//         throw err;
//       }
//       console.log(data);
//       let zip = await JSZip.loadAsync(data);
//       console.log(zip.files);
//       let counter = 0;

//       const zip2 = new JSZip();

//       zip.forEach(async (path) => {
//         const [folder, album, imgName] = path.split("/");
//         counter = counter + 1;
//         const newName = `${counter}_${imgName}`;

//         zip.files[path].unsafeOriginalName = newName;
//         zip.file(path).name = newName;

//         const blob = new Blob([zip.files[path]._data.compressedContent], {
//           type: "image/jpeg",
//         });

//         var urlBlob = URL.createObjectURL(blob);
//         console.log(urlBlob)
//         // Crear un elemento de imagen
//         var imagen = new Image();

//         // Configurar la fuente de la imagen con la URL del Blob
//         imagen.src = urlBlob;

//         zip2.file(`${counter}${imgName}`, imagen);
//       });

//       // for(const path in zip.files) {
//       //   const [folder, album, imgName] = path.split("/");
//       //   zip2.file(imgName, zip.files[path]._data)
//       // }

//       // console.log(zip2);
//       // const blob = await zip2.generateAsync({ type: "blob" });
//       // saveAs(blob, "rolo.zip");

//       return zip;
//     });
//   } catch (err) {
//     console.log(err);
//   }
// }
