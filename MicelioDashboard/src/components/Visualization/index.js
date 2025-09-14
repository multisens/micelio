import { useEffect } from "react"
import Api from "../../services/Api";
import { getPopulation } from "../../helper/Visualization"

import {
  Data,
  Field,
  Mark,
  Encoding,
  Transform,
  Scale,
  Axis,
  Bin,
  Legend,
  Autosize,
  Resolve,
  Selection,
  IntervalSelection,
  MultiSelection,
  ValueField
} from "../../graphs/BaseGraphComponents";

import { HeatMapGraph } from "../../graphs/HeatMapGraph";
import { TimelineGraph } from "../../graphs/TimelineGraph";
import { PopulationGraph } from "../../graphs/PopulationGraph";
import { ActivitiesCircleGraph } from "../../graphs/ActivitiesCircleGraph";

const Visualization = ({ props, component_id, currentSession, currentGroupSession }) => {

  useEffect(async () => {

    const graphs = props.graphs || [];

    const timeline = graphs.find(g => g.type === "Timeline");
    const activityList = graphs.find(g => g.type === "ActivityList");
    const heatmap = graphs.find(g => g.type === "HeatMap");
    const population = graphs.find(g => g.type === "Population");

    let selection = {};
    let transform = new Transform([]);
    let transformNamesHeatMap = new Transform([]);

    let response = currentSession
      ? await Api.get(`/activity/by-session/${currentSession}`)
      : await Api.get(`/activity/by-group-session/${currentGroupSession}`);

    const allActivities = response.data.activities;

    const filterActivities = (names) =>
      allActivities.filter((a) => names.includes(a.name));

    console.log(graphs)

    const specs = [];

    if (timeline) {
      const sel1 = new IntervalSelection("sel1", ["x"]);
      const sel2 = new MultiSelection("sel2", ["name"]);
      selection = {
        ...sel1.toObject(),
        ...sel2.toObject()
      };

      const selectionNames = Object.keys(selection);
      transform = new Transform(selectionNames);

      const selectionNamesHeatMap = selectionNames.filter(sel => sel === "sel1");
      transformNamesHeatMap = new Transform(selectionNamesHeatMap);

      const width = timeline?.parameters?.width ?? 824;
      const height = timeline?.parameters?.height ?? 40;

      const data = filterActivities(timeline.activities || []);
      var timeLineGraph = new TimelineGraph(
        "Linha do Tempo",
        "area",
        data,
        new Field("time", "quantitative", null, null, null, null, null, "Tempo de jogo"),
        new Field(null, "quantitative", "count"),
        new Field("name", "nominal", null, new Scale("paired"), null, null, null, "Atividades", new Legend("right")),
        selection,
        height,
        width
      );
      specs.push(timeLineGraph)
      console.log(timeLineGraph)
    }

    if (heatmap) {
      const data = filterActivities(heatmap.activities || []);

      const originalUrl = heatmap.image?.source || '';

      const imageUrl = originalUrl ? await `${Api.defaults.baseURL}proxy/image?url=${encodeURIComponent(originalUrl)}` : '';

      await Api.get(`/activity/by-session/${currentSession}`)

      const img = new Image();
      img.crossOrigin = 'Anonymous'; // habilita CORS, se preciso
      img.src = imageUrl;

      await img.decode(); // espera carregar plenamente

      const imageWidth = img.naturalWidth;
      const imageHeight = img.naturalHeight;

      const circleBins = heatmap?.parameters?.circleBins ?? 20;

      var heatmapGraph = new HeatMapGraph(
        imageWidth,
        imageHeight,
        "none",
        "padding",
        imageUrl,
        imageWidth,
        imageHeight,
        (imageWidth) / 2,
        (imageHeight) / 2,
        "url",
        data,
        new Field("position_x", "quantitative", "", null, new Axis(true, "#FFFFFF"), new Bin(circleBins), null, ""),
        new Field("position_y", "quantitative", "", null, new Axis(true, "#FFFFFF"), new Bin(circleBins), "descending", ""),
        new Field(null, "quantitative", "count", new Scale("reds"), null, null, null, null, new Legend("bottom", 10)),
        [
          new Field("name", "nominal"),
          new Field("time", "nominal")
        ],
        timeline ? transformNamesHeatMap : new Transform([]),
        "shared",
        "shared"
      );
      specs.push(heatmapGraph)
    }

    if (activityList) {
      const data = filterActivities(activityList.activities || []);

      const width = activityList?.parameters?.width ?? 824;
      const height = activityList?.parameters?.height ?? 400;

      var activitiesGraph = new ActivitiesCircleGraph(
        "Atividades",
        new Mark("circle"),
        new Data(data),
        new Encoding(
          new Field("time", "quantitative", null, null, null, { maxbins: 40 }, null, "Tempo de jogo"),
          new Field("name", "nominal", null, null, new Axis(true, "#F0F0F0"), "", activityList.activities, "", null, "right"),
          new Field(null, "quantitative", "count", { range: [20, 500] }, null, null, null, "QTD"),
          new Field("name", "nominal", null, new Scale("paired"), null, null, null, null, false),
          new Field("name", "nominal")
        ),
        timeline ? transform : new Transform([]),
        width,
        height
      );
      specs.push(activitiesGraph)
    }

    if (population) {
      const data = filterActivities(population.activities || []);

      const populationData = getPopulation(
        data,
        population.agents || [],   // lista de agentes a rastrear
        population.entities || []    // lista de entidades a rastrear
      );
      console.log(data)

      console.log(populationData)

      const width = population?.parameters?.width ?? 824;
      const height = population?.parameters?.height ?? 400;

      var populationGraph = new PopulationGraph(
        "Gráfico de População",
        "line",
        "step",
        true,
        populationData,
        new Field("time", "quantitative", null, null, null, null, null, "Tempo de jogo"),
        new Field("quantity", "quantitative", null, new Scale(null, 0)),
        new Field("agent", "nominal", "População", null, null, null, null, null, new Legend("bottom")),
        timeline ? transformNamesHeatMap : new Transform([]),
        height,
        width
      );
      specs.push(populationGraph)
    }

    const finalSpec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "vconcat": specs.map((g) => JSON.parse(JSON.stringify(g)))
    };
    // console.log(finalSpec)
    window.vegaEmbed(`#${component_id}`, finalSpec);
  })




  return <div id={component_id}></div>
}

export default Visualization
