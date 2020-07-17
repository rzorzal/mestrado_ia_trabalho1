import randomNormal from 'random-normal';
import bigfloat from 'bigfloat';
import D3Node from 'd3-node';
import output from 'd3node-output';
import GIFEncoder from 'gifencoder';
import pngFileStream from 'png-file-stream';
import fs from 'fs';
import problem from "../helpers/fileToProblem.mjs";

const INPUTS = problem && problem.Points;
let inputUsegeIndex = 0;


const fsPromise = fs.promises;
const encoder = new GIFEncoder(1000, 580);


const BigFloat32 = bigfloat.BigFloat32;

const LIMITADOR_ESQUERDA = -5.12;
const LIMITADOR_DIREITA = 5.12;

const isInLimits = (val) => {
  return (val > LIMITADOR_ESQUERDA && val < LIMITADOR_DIREITA) ||
    val == LIMITADOR_ESQUERDA || val == LIMITADOR_DIREITA
}

export const FO = ([x, y]) => 20 + (x ** 2) - (10 * Math.cos(2 * Math.PI * x)) + (y ** 2) - (10 * Math.cos(2 * Math.PI * y));

export const getMinSuccessor = ([x, y]) => {
  if(INPUTS && INPUTS[inputUsegeIndex]) return INPUTS[inputUsegeIndex++];
  const generate = (value) => {
    const successor = (new BigFloat32(value).add(randomNormal({
      mean: 0,
      dev: 2
    }))).valueOf();
    return isInLimits(successor) && successor || generate(value);
  }
  return [generate(x), generate(y)];
}

export const generateInitalNumber = () => {
  const generate = () => {
    const initial = Math.floor(Math.random() * LIMITADOR_DIREITA) + LIMITADOR_ESQUERDA;
    return isInLimits(initial) && initial || generate();
  }
  return [generate(), generate()]
}

export const generateIndividuals = () => {
  return generateInitalNumber();
}

export const mutation = (child) => {
  const probability = Math.floor(Math.random()*100);
  if(probability>30) return child;
  const childResult1 = (new BigFloat32(child[0]).add(randomNormal({
    mean: 0,
    dev: 2
  }))).valueOf();
  const childResult2 = (new BigFloat32(child[1]).add(randomNormal({
    mean: 0,
    dev: 2
  }))).valueOf();
  return isInLimits(childResult1) && isInLimits(childResult2) && [childResult1, childResult2] || mutation(child);
}

export const crossOver = (parent1, parent2) => {
  const alfa = Math.abs(randomNormal({
    mean: 0,
    dev: 1
  }));

  const beta = Math.abs(randomNormal({
    mean: 0,
    dev: 1
  }));

  const child11 = parent1[0]*alfa + parent2[0]*(1-alfa);
  const child12 = parent2[0]*alfa + parent1[0]*(1-alfa);
  const child21 = parent1[1]*beta + parent2[1]*(1-beta);
  const child22 = parent2[1]*beta + parent1[1]*(1-beta);
  return isInLimits(child11) && isInLimits(child12) && isInLimits(child21) && isInLimits(child22) && [[child11, child21], [child12, child22]] || crossOver(parent1, parent2);
}


export const resultadoText = `
  Para este tipo de problema, o Hill Climbing sem restart consegue fugir dos mínimos locais, mas há uma certa demora, ele encontra bons resultados a medida que caminha.
  Já o com restart não tem uma boa performance, pois como o restart pode faze-lo sair muito de uma boa zona, ele acaba se dispersando muito (olhar gráfico de execuções);
  O Simulated Annelaning tem muita distorção no inicio, mas consegue chegar em um bom resultado ao final, quando já não aceita muitos resultados ruins.
  O AG, apesar de ter muita variedade nos gerações, consegue encontrar índiduos bons ao longo do percurso e não varia muito o resultado (olhar gráfico de média dos melhores).
`
