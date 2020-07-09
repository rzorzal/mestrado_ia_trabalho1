import d3 from 'd3-node';
import linechart from 'd3node-linechart';
import output from 'd3node-output';
import fs from 'fs'

const fsPromise = fs.promises;

export default async function plot({
  title,
  resultName,
  data,
  lineColors,
  addCustom
}) {
  return new Promise( async (resolve, reject) => {
    if (!fs.existsSync('./output')) {
      await fsPromise.mkdir('./output');
    }

    const splitTitle = title.split('/');

    splitTitle.reduce((path, folder) => {
      const relative_path = `${path}/${folder}`
      if (!fs.existsSync(relative_path)) {
        fs.mkdirSync(relative_path);
      }
      return relative_path;
    }, "./output");



    const line = linechart({
      data: data,
      container: `
       <style>
         #chart svg {
           width: 100vw !important;
         }
         #chart svg > g {
           transform: translate(60px, 20px) !important;
         }
       </style>
       <div id="container">
         <h2>${title}</h2>
         <div id="chart"></div>
       </div>
     `,
      lineColors
    });
    addCustom && await addCustom(line.d3Element.select('svg'), line.d3, line);

    output(`./output/${title}/${resultName}`, line, {
      width: 1000,
      height: 580
    }, resolve);
  } )

};
