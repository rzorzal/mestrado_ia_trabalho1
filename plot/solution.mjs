import linePlot from './line.mjs';
import writeFile from '../helpers/writeFile.mjs';

export default async (history, title, countRunsCorrection ) => {
  const dataCurrents = history.map((a) => {
    return a.map((b, index) => ({
      key: index,
      value: b.current.y
    }))
  });

  dataCurrents.allKeys = Array.from(new Array(1000).keys());

  await linePlot({
    data: dataCurrents,
    title: title,
    resultName: "currents",
    lineColors: ["#C8BFC7", "#7A9B76", "#8A7E72", "#5A2328", "#090302", "#231C07", "#634133", "#F78764", "#B95F89", "#67AAF9"],
  });

  await writeFile(`./output/${title}/currents.json`, dataCurrents);

  const dataBests = history.map((a) => {
    return a.map((b, index) => ({
      key: index,
      value: b.best.y
    }))
  });

  dataBests.allKeys = Array.from(new Array(1000).keys());

  await linePlot({
    data: dataBests,
    title: title,
    resultName: "bests",
    lineColors: ["#C8BFC7", "#7A9B76", "#8A7E72", "#5A2328", "#090302", "#231C07", "#634133", "#F78764", "#B95F89", "#67AAF9"],
  });

  await writeFile(`./output/${title}/bests.json`, dataBests);



  const SUMS_MEAN = [];
  const WORSTS = [];
  const BESTS = [];

  history.forEach((a) => {
    a.forEach((b, index) => {

      if (!SUMS_MEAN[index]) {
        SUMS_MEAN[index] = 0;
      }
      SUMS_MEAN[index] += b.best.y;

      if(!WORSTS[index]){
        WORSTS[index] = Number.MAX_SAFE_INTEGER;
      }
      if(b.best.y < WORSTS[index]){
        WORSTS[index] = b.best.y;
      }

      if(!BESTS[index]){
        BESTS[index] = Number.MIN_SAFE_INTEGER;
      }
      if(b.best.y > BESTS[index]){
        BESTS[index] = b.best.y;
      }

    })
  });


  const dataReportMean = SUMS_MEAN.map((sum, index) => ({
    key: index,
    value: sum / countRunsCorrection
  }));

  const dataReportBests = BESTS.map((best, index) => ({
    key: index,
    value: best
  }));

  const dataReportWorsts = WORSTS.map((worst, index) => ({
    key: index,
    value: worst
  }));

  const REPORT = [
    dataReportMean, dataReportBests, dataReportWorsts
  ]

  REPORT.allKeys = Array.from(new Array(1000).keys());


  await linePlot({
    data: REPORT,
    title: title,
    resultName: "mean-best",
    lineColors: ['#39FF14', 'BLACK', 'BLUE'],
  });

  await writeFile(`./output/${title}/mean-best.json`, REPORT);



  const SUMS_MEAN_CURRENT = [];
  const WORSTS_CURRENT = [];
  const BESTS_CURRENT = [];

  history.forEach((a) => {
    a.forEach((b, index) => {

      if (!SUMS_MEAN_CURRENT[index]) {
        SUMS_MEAN_CURRENT[index] = 0;
      }
      SUMS_MEAN_CURRENT[index] += b.current.y;

      if(!WORSTS_CURRENT[index]){
        WORSTS_CURRENT[index] = Number.MAX_SAFE_INTEGER;
      }
      if(b.current.y < WORSTS_CURRENT[index]){
        WORSTS_CURRENT[index] = b.current.y;
      }

      if(!BESTS_CURRENT[index]){
        BESTS_CURRENT[index] = Number.MIN_SAFE_INTEGER;
      }
      if(b.current.y > BESTS_CURRENT[index]){
        BESTS_CURRENT[index] = b.current.y;
      }

    })
  });


  const dataReportMean_CURRENT = SUMS_MEAN_CURRENT.map((sum, index) => ({
    key: index,
    value: sum / countRunsCorrection
  }));

  const dataReportBests_CURRENT = BESTS_CURRENT.map((best, index) => ({
    key: index,
    value: best
  }));

  const dataReportWorsts_CURRENT = WORSTS_CURRENT.map((worst, index) => ({
    key: index,
    value: worst
  }));

  const REPORT_CURRENT = [
    dataReportMean_CURRENT, dataReportBests_CURRENT, dataReportWorsts_CURRENT
  ]

  REPORT_CURRENT.allKeys = Array.from(new Array(1000).keys());


  await linePlot({
    data: REPORT_CURRENT,
    title: title,
    resultName: "mean-current",
    lineColors: ['#39FF14', 'BLACK', 'BLUE'],
  });

  await writeFile(`./output/${title}/mean-current.json`, REPORT);
}
