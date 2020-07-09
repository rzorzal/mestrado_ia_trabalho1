import randomNormal from 'random-normal';
const LinearPercentAccept = (x) => x <= 900 ? (-1/900)*x + 1 : 0;

export default (FO, generateInitalNumber, getMinSuccessor) => {

  const history = [];

  let current = generateInitalNumber();
  let FOCurrent = FO(current);

  let best = current;
  let FOBest = FOCurrent;

  for(let i = 0; i < 1000; i++){
    let neighbor = getMinSuccessor(current);
    let FONeighbor = FO(neighbor);

    const chanceToAccept = LinearPercentAccept(i);

    const r = Math.abs(randomNormal({mean: 0, dev: 0.5}));

    if(FONeighbor < FOCurrent || r < chanceToAccept){
      current = neighbor;
      FOCurrent = FONeighbor;
    }

    if(FOCurrent < FOBest){
      FOBest = FOCurrent;
      best = current;
    }

    history.push( {current: {x: current, y: FOCurrent } , best:{x: best, y: FOBest }} )

  }

  return {best: best, last: current, history};
}
