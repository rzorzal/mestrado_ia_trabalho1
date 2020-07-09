import randomNormal from 'random-normal';
import bigfloat from 'bigfloat';
import D3Node from 'd3-node';
import output from 'd3node-output';
import GIFEncoder from 'gifencoder';
import pngFileStream from 'png-file-stream';
import fs from 'fs';


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

export const plot = async () => {
  const plotMe = (step) => {
    return new Promise( async (resolve) => {
      const options = {
        selector: '#chart',
        container: '<div id="container"><div id="chart"></div></div>'
      };
      const d3n = new D3Node(options);
      const d3 = d3n.d3;

      const data = [];

      for (let x = LIMITADOR_ESQUERDA; x <= LIMITADOR_DIREITA; x += step) {
        for (let y = LIMITADOR_ESQUERDA; y <= LIMITADOR_DIREITA; y += step) {
          data.push({
            x: FO([x, y]),
            y,
            z: x,
          });
        }
      }

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

      svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .selectAll("path")
        .data(contours)
        .enter().append("path")
        .attr("stroke-width", (d, i) => i % 5 ? 0.25 : 1)
        .attr("d", d3.geoPath());

      svg.append("g")
        .attr("stroke", "white")
        .selectAll("circle")
        .data(data.map(a => ({x: a.x, y: a.z}) ))
        .enter().append("circle")
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y))
        .attr("r", 2);

      if (!fs.existsSync('./output')) {
        await fsPromise.mkdir('./output');
      }

      if (!fs.existsSync(`./output/FO-PROBLEMA2-${step.toFixed(2)}`)) {
        await fsPromise.mkdir(`./output/FO-PROBLEMA2-${step.toFixed(2)}`);
      }


      output(`./output/FO-PROBLEMA2-${step.toFixed(2)}/problema2`, d3n, {
        width: 1000,
        height: 580
      }, resolve);
    } );

  }


  for(let step = 0.1; step <= 2.1; step += 0.1){
    await plotMe(step);
  }

  const stream = pngFileStream('output/FO-PROBLEMA2-?.?0/problema2.png')
  .pipe(encoder.createWriteStream({ repeat: -1, delay: 600, quality: 10 }))
  .pipe(fs.createWriteStream('myanimated.gif'));


  stream.on('finish', function () {
    console.log('GIF FEITO');
  });

}
