import { useEffect } from "react"

import Api from "../../services/Api"
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

    const activitiesList = props.graphs[0].activities;
    const activitiesHeatMapList = props.graphs[2].activities;
    const agents = props.graphs[3].agents;
    const entities = props.graphs[3].entities;
    const activitiesMap = {
      insert: props.graphs[3].insert,
      remove: props.graphs[3].remove,
    }
    const specialWidth = props.screen_width;
    const CircleBins = props.graphs[0].circle_bins;
    console.log(window)
    const vl = window.vl
    const width = 800

    let response;
    if (currentSession) {
      response = await Api.get(`/activity/by-session/${currentSession}`);
    } else {
      response = await Api.get(`/activity/by-group-session/${currentGroupSession}`);
    }

    var populationData = getPopulation(
      response.data,
      agents,
      entities,
      activitiesMap
    )

    var data = response.data.activities.filter((a) => {
      if (activitiesList.includes(a.name)) return a
    })
    var heatMapData = response.data.activities.filter(a => { if (activitiesHeatMapList.includes(a.name)) return a });

    const brush = window.vl.selectInterval().encodings(["x"]).name("sel1");

    const selectActivityName = window.vl.selectMulti().fields(["name"]).name("sel2");

    const sel1 = new IntervalSelection("sel1", ["x"]);
    const sel2 = new MultiSelection("sel2", ["name"]);

    const selection = {
      ...sel1.toObject(),
      ...sel2.toObject()
    };

    const timelineGraph = new TimelineGraph(
      "Linha do Tempo",
      "area",
      data,
      new Field("time", "quantitative", null, null, null, null, null, "Tempo de jogo"),
      new Field(null, "quantitative", "count"),
      new Field("name", "nominal", null, new Scale("paired"), null, null, null, "Atividades"),
      selection,
      40,
      824
    );
    const selectionNames = Object.keys(selection);  // ["sel1", "sel2"]

    const transform = new Transform(selectionNames);

    const selectionNamesHeatMap = Object.keys(selection).filter(sel => sel === "sel1");
    const transformNamesHeatMap = new Transform(selectionNamesHeatMap);

    const heatMapGraph = new HeatMapGraph(
      400,
      266.6666666666667,
      "none",
      "padding",
      //"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvTA8pH2qG8kSOrgxuiT0L-RuwZzMBguCRUQ&s",
      "data:image/png;base64,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",     
      400,
      266.6666666666667,
      200,
      133.33,
      "url",
      heatMapData,
      new Field("position_x", "quantitative", "", null, new Axis(true, "#FFFFFF"), new Bin(20), null, ""),
      new Field("position_y", "quantitative", "", null, new Axis(true, "#FFFFFF"), new Bin(20), "descending", ""),
      new Field(null, "quantitative", "count", new Scale("reds"), null, null, null, null, new Legend("bottom", 10)),
      [
        new Field("name", "nominal"),
        new Field("time", "nominal")
      ],
      transformNamesHeatMap,
      "shared",
      "shared"
    );
    console.log(heatMapGraph)

    const activitiesCircleGraph = new ActivitiesCircleGraph(
      "Atividades",
      new Mark("circle"),
      new Data(data),
      new Encoding(
        new Field("time", "quantitative", null, null, null, { maxbins: CircleBins }, null, "Tempo de jogo"),
        new Field("name", "nominal", null, null, new Axis(true, "#F0F0F0"), "", activitiesList, "", null, "right"),
        new Field(null, "quantitative", "count", { range: [20, 500] }, null, null, null, "QTD"),
        new Field("name", "nominal", null, new Scale("paired"), null, null, null, null, false),
        new Field("name", "nominal")
      ),
      transform,
      specialWidth,
      400
    );

    const populationGraph = new PopulationGraph(
      "Gráfico de População",
      "line",
      "step",
      true,
      populationData,
      new Field("time", "quantitative", null, null, null, null, null, "Tempo de jogo"),
      new Field("quantity", "quantitative", null, new Scale(null, 0)),
      new Field("agent", "nominal", "População", null, null, null, null, null, new Legend("bottom")),
      transformNamesHeatMap,
      824
    );

    const combinedSpec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "vconcat": [JSON.parse(JSON.stringify(timelineGraph)), JSON.parse(JSON.stringify(heatMapGraph)), JSON.parse(JSON.stringify(activitiesCircleGraph)), JSON.parse(JSON.stringify(populationGraph))] // As duas visualizações
    };

    window.vegaEmbed(`#${component_id}`, combinedSpec)
  })

  return <div id={component_id}></div>
}

export default Visualization
