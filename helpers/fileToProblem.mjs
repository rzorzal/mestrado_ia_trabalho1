import fs from 'fs';
const fsPromises = fs.promises;

let POINTS_FILEPATH;

if(process.argv.length == 5){
  if(typeof process.argv[4] == "string"){
    POINTS_FILEPATH = process.argv[4];
  } else {
    throw new Error("Need more arguments (PATH OF POINTS)");
  }
} else if(process.argv.length >= 6){
  if(typeof process.argv[5] == "string"){
    POINTS_FILEPATH = process.argv[5];
  } else {
    throw new Error("Need more arguments (PATH OF POINTS)");
  }
} else {
  throw new Error("Need more arguments (PATH OF POINTS)");
}

POINTS_FILEPATH = `${process.cwd()}/${POINTS_FILEPATH}`;

if(!fs.existsSync(POINTS_FILEPATH)){
  throw new Error(`"${POINTS_FILEPATH}" do not exists!`);
}

const data = fs.readFileSync(POINTS_FILEPATH, 'utf8');

const lines = data.split('\n').filter(a => !!a);

const Points = lines.map(line => {
  return line.split(' ');
});

const MatrixAdjacencia = Points.reduce( (memo, point1, index1) => {
  const distances = Points.map( (point2, index2) => {
    if(index1 == index2) return 0;
    return Math.sqrt( Math.pow(point2[0] - point1[0],2)  +  Math.pow(point2[1] - point1[1],2) );
  });
  memo[index1] = distances;
  return memo;
}, []);

export default {
  Points,
  MatrixAdjacencia
}
