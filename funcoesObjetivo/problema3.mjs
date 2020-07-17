import problem from "../helpers/fileToProblem.mjs";
import shuffe from '../helpers/shuffle.mjs';
import D3Node from 'd3-node';
import output from 'd3node-output';
import fs from 'fs';


const fsPromise = fs.promises;

const initial = shuffe(Array.from(new Array(problem.Points.length).keys()));

export const FO = (solution) => {
  return solution.reduce((weight, citie, index) => {
    if (index == 0) return weight;
    weight += parseFloat(problem.MatrixAdjacencia[citie][solution[index - 1]]);
    return weight;
  }, 0) + parseFloat(problem.MatrixAdjacencia[solution[0]][solution[solution.length - 1]]);
};

export const getMinSuccessor = (solution) => {
  const first = Math.floor(Math.random() * solution.length) + 0;
  let transport = solution[first];
  const second = Math.floor(Math.random() * solution.length) + 0;

  const newSolution = [...solution];
  newSolution[first] = newSolution[second];
  newSolution[second] = transport;
  return newSolution;
};

export const generateInitalNumber = () => {
  return initial;
};

export const generateIndividuals = () => {
  return shuffe(Array.from(new Array(problem.Points.length).keys()));
}

export const mutation = (child) => {
  const probability = Math.floor(Math.random()*100);
  if(probability<10 || probability>20) return child;

  return getMinSuccessor(child);
}

export const crossOver = (parent1, parent2) => {
  const breakPoint = Math.max(Math.floor(Math.random() * parent1.length) + 2, 1);

  const parent1Left = parent1.slice(0, breakPoint);
  const parent1Right = parent1.slice(breakPoint);

  const parent2Left = parent2.slice(0, breakPoint);
  const parent2Right = parent2.slice(breakPoint);

  const child1 = [...parent1Right];
  parent1.forEach( el => {
    if(!child1.includes(el)){
      child1.unshift(el)
    }
  });

  const child2 = [...parent2Right];
  parent2.forEach( el => {
    if(!child2.includes(el)){
      child2.unshift(el)
    }
  });

  return [child1, child2];
}

export const resultadoText = `
  Neste problema o Hill Climbing sem restart se sai melhor em quase todas as execuções, batendo de frente com o AG. Ele sempre tras os melhores resultados tanto nos Piores, Média e Melhor (olhar gráfico comaprativo).
  O grande problema do Hill Climbing com restart acaba não aproveitando os bons resultados encontrados pelo caminho e acaba fazendo uma solução ruim a cada restart gerado. Em média é o pior algoritmo para o problema.
  O Simulated Annealing tem uma execução boa neste problema, mas não consegue ficar entre os melhores, pois só encontra resultado bons no final do ciclo. Muito ruido é gerado antes disso (ver gráfico de execuções).
  O AG não é o melhor neste caso, mas se equipara ao Hill Climbing com restart. As suas execuções tem uma taxa boa de caimento da FO (olhar gráfico de Melhores Médias), se ele pudesse executar mais ações ele certamente acharia o melhor resultado para o problema.
  Neste problema a variação do Hill Climbing tente a se manter estável. Do AG dente a cair e o Simulated Annealing tende a cair (mas depende da sorte do inicio).
`
