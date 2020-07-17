import randomNormal from 'random-normal';
import bigfloat from 'bigfloat';
import linePlot from '../plot/line.mjs';
import problem from "../helpers/fileToProblem.mjs";

const INPUTS = problem && problem.Points;
let inputUsegeIndex = 0;

const BigFloat32 = bigfloat.BigFloat32;

const LIMITADOR_ESQUERDA = -100;
const LIMITADOR_DIREITA = 100;

const isInLimits = (val) => {
  return (val > LIMITADOR_ESQUERDA && val < LIMITADOR_DIREITA) ||
    val == LIMITADOR_ESQUERDA || val == LIMITADOR_DIREITA
}

export const FO = (x) => (Math.pow(x, 2) / 100) + 10 * Math.sin(x - (Math.PI / 2));

export const getMinSuccessor = (value) => {
  const successor = (new BigFloat32(value).add(randomNormal({
    mean: 0,
    dev: 2
  }))).valueOf();
  return isInLimits(successor) && successor || getMinSuccessor(value);
}

export const generateInitalNumber = () => {
  if(INPUTS && INPUTS[inputUsegeIndex]) return parseFloat(INPUTS[inputUsegeIndex++][0]);
  const initial = Math.floor(Math.random() * LIMITADOR_DIREITA) + LIMITADOR_ESQUERDA;
  return isInLimits(initial) && initial || generateInitalNumber();
};

export const generateIndividuals = () => {
  return generateInitalNumber();
}

export const mutation = (child) => {
  const probability = Math.floor(Math.random()*100);
  if(probability>30) return child;
  const childResult = (new BigFloat32(child).add(randomNormal({
    mean: 0,
    dev: 2
  }))).valueOf();
  return isInLimits(childResult) && childResult || mutation(child);
}

export const crossOver = (parent1, parent2) => {
  const alfa = Math.abs(randomNormal({
    mean: 0,
    dev: 1
  }));

  const child1 = parent1*alfa + parent2*(1-alfa);
  const child2 = parent2*alfa + parent1*(1-alfa);
  return isInLimits(child1) && isInLimits(child2) && [child1, child2] || crossOver(parent1, parent2);
}

export const resultadoText = `
  Ao olharmos para o gráfico de comparação (melhor), podemos perceber que o Hill Climbing sem restart encontra um minimo local e não consgue sair deste.
  O Hill Climbing com restart consegue se sair melhor pois conta com a aleatoriedade para fugir os minimos locais e consegue bons resultados. Não tem muita distorção e variação nos valores (ver gráfico de exeção).
  Já o Simulated Annelaning tem muita distorção até chegar na parte final da execução, onde parece melhorar o resultado e manter nele. Também encontra bons resultados.
  O melhor neste caso será o AG que logo nas primeiras exeuções acha bons resultados e mantem um pequena distorção ao longo das execuções. Ele encontra o melhor resultado.
`
