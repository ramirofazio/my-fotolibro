import JSZip from "jszip";
import JSZipUtils from "jszip-utils";

export function readRemoteZip(url) {
  new JSZip.external.Promise(function (resolve, reject) {
    JSZipUtils.getBinaryContent(url, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
    .then(function (data) {
      return JSZip.loadAsync(data);
    })
    .then((zip) => console.log(zip));
}

export async function hanldeZip(url) {
  console.log(url)
  try {
    await JSZipUtils.getBinaryContent(
      url,
      async (err, data) => {
        if (err) {
          throw err;
        }
        console.log(data)
        let zip = await JSZip.loadAsync(data)
        zip.forEach((z) => {
          const [folder, album, imgName] = z.split("/")
          console.log(zip.folder(folder).folder(album).file(imgName).name = `zaracat${imgName}`)
        })

        console.log(zip)
        return zip
      }
    );
  } catch (err) {
    console.log(err);
  }
}
