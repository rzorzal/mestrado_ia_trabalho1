import fs from 'fs';

const fsPromise = fs.promises;


export default async (filepath, data) => {

  const filepathSpliped = filepath.split('/').slice(1);
  filepathSpliped.reduce((path, folder) => {
    if(folder.includes('.')) return path;
    const relative_path = `${path}/${folder}`;
    if (!fs.existsSync(relative_path)) {
      fs.mkdirSync(relative_path);
    }
    return relative_path;
  }, "./");

  await fsPromise.writeFile(filepath, JSON.stringify(data), 'utf8');

}
