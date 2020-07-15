import EJS from 'ejs';
import fs from 'fs';

const fsPromise = fs.promises;


function init() {
  if(!fs.existsSync('./output')) throw new Error('OUTPUT Folder dont exists! Run npm run all before!');


  return new Promise( async (resolve, reject) => {

    const files = await fsPromise.readdir(`./output`);

    const folders = files.filter(folder => fs.lstatSync(`./output/${folder}`).isDirectory())

    const data = folders.reduce( (memo, foldername) => {
      const foldernameSplited = foldername.split('-');

      const algoritmo = foldernameSplited[0];
      const problema = foldernameSplited[1];

      if(!memo[problema]){
        memo[problema] = { estatisticas: [], algoritmos: {}};
      }

      if(!memo[problema].algoritmos[algoritmo]){
        memo[problema].algoritmos[algoritmo] = {};
      }

      memo[problema].algoritmos[algoritmo].graficos = {
        'bests': `${foldername}/bests.png`,
        'currents': `${foldername}/currents.png`,
        'mean-best': `${foldername}/mean-best.png`,
        'mean-current': `${foldername}/mean-current.png`,
      }

      memo[problema].algoritmos[algoritmo].estatistica = JSON.parse(fs.readFileSync(`./output/${foldername}/estatistica.json`, 'utf-8'));
      memo[problema].algoritmos[algoritmo].history = JSON.parse(fs.readFileSync(`./output/${foldername}/history.json`, 'utf-8'));
      memo[problema].estatisticas.push({...memo[problema].algoritmos[algoritmo].estatistica, algoritmo: algoritmo});

      return memo;
    }, {});


    data.problemas = Object.keys(data);
    console.log(data);

    EJS.renderFile(`./views/report.ejs`, data, {context:data}, async function(err, html){
      if(err) return reject(err);

      await fsPromise.writeFile(`./output/report.html`, html, 'utf8');

      resolve();
    })
  });

}

init();
