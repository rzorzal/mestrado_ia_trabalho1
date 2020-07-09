export default (FO, generateInitalNumber, getMinSuccessor) => {

  const history = [];

  let current = generateInitalNumber();
  let best = current;

  for (let i = 0; i < 1000; i++) {
    const neighbor = getMinSuccessor(current);
    if (FO(neighbor) < FO(current)) {
      current = neighbor;
    }

    if (FO(current) < FO(best)) {
      best = current;
    }

    history.push( {best: {x: best, y: FO(best) }, current: {x: current, y: FO(current) } }   );
  }
  return {best: best, last: current, history};
};
