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

export const plot = () => {
  return (solution, ID, folder) => {
    return new Promise(async (resolve) => {

      if (!fs.existsSync('./output')) {
        await fsPromise.mkdir('./output');
      }

      if (!fs.existsSync(`./output/${folder}`)) {
        await fsPromise.mkdir(`./output/${folder}`);
      }

      if (!fs.existsSync(`./output/${folder}/${ID}`)) {
        await fsPromise.mkdir(`./output/${folder}/${ID}`);
      }

      const options = {
        selector: '#chart',
        container: '<div id="container"><div id="chart"></div></div>'
      };
      const d3n = new D3Node(options);
      const d3 = d3n.d3;

      const data = solution.map(a =>{
        const node = problem.Points[a]
        return {
          x: parseFloat(node[0]),
          y: parseFloat(node[1]),
          label: a
        }
      });


      const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.y)).nice()
        .rangeRound([580 - 20, 20]);

      const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.x)).nice()
        .rangeRound([60, 1000 - 60])

      const contours = d3.contourDensity()
        .x(d => x(d.x))
        .y(d => y(d.y))
        .size([1000, 580])
        .bandwidth(30)
        .thresholds(30)
        (data);

      const svg = d3n.createSVG()
        .attr("viewBox", [0, 0, 1000, 580]);

      const yAxis = g => g.append("g")
        .attr("transform", `translate(${60},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("Y")
        );

      const xAxis = g => g.append("g")
        .attr("transform", `translate(0,${580 - 20})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("y", -3)
          .attr("dy", null)
          .attr("font-weight", "bold")
          .text(data.x)
        );

      svg.append("g")
        .call(xAxis);

      svg.append("g")
        .call(yAxis);




      let line = d3.line()
        .curve(d3.curveLinear)
        .x(d => x(d.x))
        .y(d => y(d.y))

      function length(path) {
        return d3.create("svg:path").attr("d", path).node().getTotalLength();
      }

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line)

      const GS = svg.append("g")
        .attr("stroke", "green")
        .attr('fill', '#39FF14')
        .selectAll("circle")
        .data(data)
        .enter();

      const TEXT = GS.append("g")

      TEXT.append("circle")
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y))
        .attr("r", 10);

      TEXT.append("text")
        .attr("x", d => x(d.x))
        .attr("y", d => y(d.y))
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("font-size", "10px")
        .text(function(d, i) {
          return `${d.label}`
        });

      output(`./output/${folder}/${ID}/out`, d3n, {
        width: 1000,
        height: 580
      }, resolve);


    });

  }



}
