export default (FO, generateInitalNumber, getMinSuccessor) => {

  const history = [];
  let best;
  let current;
  for (let i = 0; i < 1000; i++) {

    current = i%50 != 0 ? current : generateInitalNumber();
    if(!best) best = current;
    const neighbor = getMinSuccessor(current);

    const FOBest = FO(best);
    const FONeighbor = FO(neighbor);
    const FOCurrent = FO(current)

    if (FONeighbor < FOCurrent) {
      current = neighbor;
    }

    if(FOBest > FOCurrent){
      best = current;
    }

    history.push( {current: {x: current, y: FO(current) } , best: {x: best, y: FO(best) } }  )
  }
  return {best: best, last: current,  history};
}
