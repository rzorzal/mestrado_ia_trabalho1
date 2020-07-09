import solutionPlot from './plot/solution.mjs';
import GIFPlot from './plot/gif.mjs';

const [, , heuristica, problema, countRuns = 10] = process.argv;

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
    plot
  },
  {
    default: HEURISTICA
  }
]) => {
  //console.log(FO, generateInitalNumber, getMinSuccessor);
  //console.log(HEURISTICA);

  const addSol = await plot();

  const history = [];

  for (let executionIndex = 0; executionIndex < countRunsCorrection; executionIndex++) {
    const result = HEURISTICA(FO, generateInitalNumber, getMinSuccessor);
    //console.log(executionIndex, result.best, FO(result.best));
    history.push(result.history);
    if(addSol) await addSol(result.best, executionIndex, heuristica + "-" + problema + '-executions');

  }

  if(addSol) await GIFPlot( heuristica + "-" + problema + '-executions');
  solutionPlot(history, heuristica + "-" + problema, countRunsCorrection);

});
