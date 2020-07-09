import GIFEncoder from 'gifencoder';
import pngFileStream from 'png-file-stream';
import fs from 'fs';


const fsPromise = fs.promises;
const encoder = new GIFEncoder(1000, 580);

export default (folder) => {
  return new Promise(resolve => {
    const stream = pngFileStream(`./output/${folder}/?/out.png`)
    .pipe(encoder.createWriteStream({ repeat: -1, delay: 600, quality: 10 }))
    .pipe(fs.createWriteStream(`./output/${folder}/executions.gif`));


    stream.on('finish', function () {
      resolve()
    });
  })
}
