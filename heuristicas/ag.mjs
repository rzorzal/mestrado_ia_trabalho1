function selectParentRandom(population){
  const parentIndex = Math.floor(Math.random()*population.length);
  const el = population[parentIndex];
  return el.current.x;
}

function selectParentGreedy(population){
  const sorted = population.sort( (a,b) => a.current.y - b.current.y );
  return sorted[0].current.x;
}

function selectParentGreedyNormal(population){
  const sorted = population.sort( (a,b) => a.current.y - b.current.y );
  const sum = sorted.reduce( (memo, a, index) => memo + index , 0);
  const probability = sorted.map( (a, index) => (sorted.length - 1 - index)/sum );
  const numberRandom = Math.random();
  let indexChossed = -1;

  probability.reduce( (memo, prob, index) =>  {
    memo += parseFloat(prob.toFixed(9));
    if(indexChossed == -1 && numberRandom < memo){
      indexChossed = index - 1;
    }
    return memo;
  }, 0);
  return sorted[indexChossed].current.x;
}

function selectParentTorunamentNormal(population){
  const sorted = population.sort( (a,b) => a.current.y - b.current.y );
  const sum = sorted.reduce( (memo, a, index) => memo + index , 0);
  const probability = sorted.map( (a, index) => (sorted.length - 1 - index)/sum );
  const numberRandom = Math.random();
  let indexChossed = -1;

  const number2Random = Math.random();
  let index2Chossed = -1;

  probability.reduce( (memo, prob, index) =>  {
    memo += parseFloat(prob.toFixed(9));

    if(indexChossed == -1 && numberRandom < memo){
      indexChossed = index - 1;
    }
    if(index2Chossed == -1 && number2Random < memo){
      index2Chossed = index - 1;
    }

    return memo;
  }, 0);

  const number1 = sorted[indexChossed];
  const number2 = sorted[index2Chossed];

  return number1.current.y < number2.current.y ? number1.current.x : number2.current.x;
}

function selectParentTorunament(population){
  const parentIndex1 = Math.floor(Math.random()*population.length);
  const parent1 = population[parentIndex1];

  const parentIndex2 = Math.floor(Math.random()*population.length);
  const parent2 = population[parentIndex2];
  return parent1.current.y < parent2.current.y ? parent1.current.x : parent2.current.x;
}

const uses = {
  selectParentGreedy: 0,
  selectParentTorunament: 0,
  selectParentRandom: 0,
  selectParentGreedyNormal: 0,
  selectParentTorunamentNormal: 0
}

function selectParent(){
  const alfa = Math.floor(Math.random()*100);
  if(alfa < 20){
    // console.log('selectParentGreedy')
    // uses.selectParentGreedy++;
    // console.log(uses)
    return selectParentGreedy;
  } else if(alfa < 40){
    // console.log('selectParentTorunament')
    // uses.selectParentTorunament++;
    // console.log(uses)
    return selectParentTorunament;
  } else if(alfa < 60){
    // console.log('selectParentGreedyNormal')
    // uses.selectParentGreedyNormal++;
    // console.log(uses)
    return selectParentGreedyNormal;
  } else if(alfa < 80){
    // console.log('selectParentTorunamentNormal')
    // uses.selectParentTorunamentNormal++;
    // console.log(uses)
    return selectParentTorunamentNormal;
  } else {
    // console.log('selectParentRandom')
    // uses.selectParentRandom++;
    // console.log(uses)
    return selectParentRandom;
  }
}

export default (FO, generateInitalNumber, getMinSuccessor, generateIndividuals, mutation, crossOver) => {

  let history = [];

  let current = generateInitalNumber();
  let best = current;
  let FOBEST = FO(best);

  history.push({
    current: {
      x: current,
      y: FO(current)
    },
    best: {
      x: best,
      y: FOBEST
    }
  });

  //initial population
  for(let individualIndex = 0; individualIndex< 19; individualIndex++){
    const individual = generateIndividuals();
    const FOIndividual = FO(individual);
    if(FOBEST > FOIndividual){
      best = individual;
      FOBEST = FOIndividual;
    }
    history.push({
      current: {
        x: individual,
        y: FOIndividual
      },
      best: {
        x: best,
        y: FOBEST
      }
    });
  }

  let population = [...history];


  for(let generation = 0; generation < 49; generation++){
    const newPopulation = [];

    for(let generateIndex = 0; generateIndex < 10; generateIndex++){


      const parent1 = selectParent()(population);
      const parent2 = selectParent()(population);

      // const parent1 = selectParentTorunamentNormal(population);
      // const parent2 = selectParentTorunamentNormal(population);

      let [child1, child2] = crossOver(parent1,parent2);


      child1 = mutation(child1);
      const FOChild1 = FO(child1);

      if(FOBEST > FOChild1){
        best = child1;
        FOBEST = FOChild1;
      }

      newPopulation.push({
        current: {
          x: child1,
          y: FOChild1
        },
        best: {
          x: best,
          y: FOBEST
        }
      });

      child2 = mutation(child2);
      const FOChild2 = FO(child2);

      if(FOBEST > FOChild2){
        best = child2;
        FOBEST = FOChild2;
      }

      newPopulation.push({
        current: {
          x: child2,
          y: FOChild2
        },
        best: {
          x: best,
          y: FOBEST
        }
      });

    }

    population = [...newPopulation];
    history = history.concat(population);
  }

  return {best: best, history};
};
