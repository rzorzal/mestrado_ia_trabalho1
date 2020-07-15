import randomNormal from 'random-normal';
import bigfloat from 'bigfloat';
import linePlot from '../plot/line.mjs';


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

export const plot = (step = 1) => {
  return (solution, ID, folder) => {
    return new Promise(async (resolve) => {
      let data = [];
      for (let i = LIMITADOR_ESQUERDA; i <= LIMITADOR_DIREITA; i += step) {
        data.push({
          key: i,
          value: FO(i)
        })
      }
      linePlot({
        data: data,
        title: folder + `/${ID}`,
        resultName: "out",
        lineColors: ['#39FF14'],
        // addCustom: (svg, d3, d3n) => {
        //
        //   const xScale = d3.scaleLinear()
        //     .domain(d3.extent(data, d => d.key))
        //     .rangeRound([0, 1000]);
        //   const yScale = d3.scaleLinear()
        //     .domain(d3.extent(data, d => d.value))
        //     .rangeRound([580, 0]);
        //
        //   const GS = svg.append("g")
        //     .attr("stroke", "red")
        //     .attr('fill', 'blue')
        //     .attr("x", xScale(solution))
        //     .attr("y", yScale(FO(solution)))
        //     .selectAll("circle")
        //     .data([{
        //       x: solution,
        //       y: FO(solution)
        //     }])
        //     .enter();
        //
        //   const TEXT = GS.append("g")
        //
        //   TEXT.append("circle")
        //     .attr("x", d => xScale(d.x))
        //     .attr("y", d => yScale(d.y))
        //     .attr("r", 5);
        //
        // }
      });

      resolve();
    })
  }

}
