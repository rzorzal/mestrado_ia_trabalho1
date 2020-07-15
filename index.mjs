import solutionPlot from './plot/solution.mjs';
import GIFPlot from './plot/gif.mjs';
import fs from 'fs';

const fsPromise = fs.promises;

const [, , heuristica, problema, countRuns = 10] = process.argv;

const nativeLog = global.console.log;
global.console.log = (data) => {
  if(typeof data == "string" && data.includes('>> Exported')) return;
  nativeLog(data)
}

console.log(heuristica, problema);

let countRunsCorrection = countRuns;

if (isNaN(parseInt(countRunsCorrection))) {
  if (process.argv.length == 5) {
    countRunsCorrection = 10;
  }
}


Promise.all([
  import(`./funcoesObjetivo/${problema}.mjs`),
  import(`./heuristicas/${heuristica}.mjs`)
]).then(async ([{
    FO,
    getMinSuccessor,
    generateInitalNumber,
    plot,
    mutation,
    generateIndividuals,
    crossOver
  },
  {
    default: HEURISTICA
  }
]) => {
  //console.log(FO, generateInitalNumber, getMinSuccessor);
  //console.log(HEURISTICA);

  //const addSol = await plot();

  const history = [];

  let soma = 0;
  const FOResults = [];
  const estatistica = {
    melhor: null,
    pior: null,
    media: 0,
    desvioPadrao: 0
  }

  for (let executionIndex = 0; executionIndex < countRunsCorrection; executionIndex++) {
    const result = HEURISTICA(FO, generateInitalNumber, getMinSuccessor, generateIndividuals, mutation, crossOver);
    const resultFO = FO(result.best);
    //console.log(executionIndex, result.best, resultFO);
    if(!estatistica.melhor || estatistica.melhor > resultFO){
      estatistica.melhor = resultFO;
    }
    if(!estatistica.pior || estatistica.pior < resultFO){
      estatistica.pior = resultFO;
    }
    soma += resultFO
    history.push(result.history);
    FOResults.push(resultFO);
    //if(addSol) await addSol(result.best, executionIndex, heuristica + "-" + problema + '-executions');

  }
  estatistica.media = soma/countRunsCorrection;
  estatistica.desvioPadrao = Math.sqrt( FOResults.reduce((memo,a) => memo + Math.pow(a-estatistica.media,2) ,0) / countRunsCorrection);
  console.table([estatistica]);

  //if(addSol) await GIFPlot( heuristica + "-" + problema + '-executions');
  const folderName = heuristica + "-" + problema;;
  await solutionPlot(history, folderName, countRunsCorrection);
  await fsPromise.writeFile(`./output/${folderName}/estatistica.json`, JSON.stringify(estatistica), 'utf8');
  await fsPromise.writeFile(`./output/${folderName}/history.json`, JSON.stringify(history), 'utf8');


});
