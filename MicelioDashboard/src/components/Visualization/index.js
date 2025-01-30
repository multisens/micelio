import { useEffect } from "react"

import Api from "../../services/Api"
import { getPopulation } from "../../helper/Visualization"

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

    const brush = vl.selectInterval().encodings("x")
    const selectActivityName = vl.selectMulti().fields("name")

    const timeLine = vl
      .markArea()
      .data(data)
      .encode(
        vl.x().fieldQ("time").title("Tempo de jogo"),
        vl.y().count().title(""),
        vl
          .color()
          .fieldN("name")
          .scale({ scheme: "paired" })
          .title("Atividades")
      )
      .title("Linha do Tempo")
      .select(brush, selectActivityName)
      .height(40)
      .width(specialWidth)

    const activitiesCircle = vl
      .markCircle()
      .data(data)
      .encode(
        vl
          .y()
          .fieldN("name")
          .title("")
          .axis({ grid: true, gridColor: "#F0F0F0" })
          .sort(activitiesList),
        vl
          .x()
          .fieldQ("time")
          .title("Tempo de jogo")
          .bin({ maxbins: CircleBins }),
        vl
          .size()
          .count()
          .scale({ range: [20, 500] })
          .title("QTD"), //.legend({orient: "bottom"}),
        vl.color().fieldN("name").scale({ scheme: "paired" }).legend(false),
        vl.tooltip("name")
      )
      .title("Atividades")
      .transform([vl.filter(selectActivityName), vl.filter(brush)])
      .height(400)
      .width(specialWidth)

    const heatMap = vl
      .markRect({ clip: true })
      .data(heatMapData)
      .encode(
        vl
          .x()
          .fieldQ("position_x")
          .bin({ maxbins: 20 })
          .axis({ grid: true, gridColor: "#FFFFFF" })
          .title("")
          .scale({ domainMin: 0 }),
        vl
          .y()
          .fieldQ("position_y")
          .bin({ maxbins: 20 })
          .axis({ grid: true, gridColor: "#FFFFFF" })
          .title("")
          .scale({ domainMin: 0 })
          .sort("descending"),
        vl
          .color()
          .count()
          .scale({ scheme: "reds" })
          .legend({ orient: "bottom", padding: 10 }),
        vl.tooltip(["name", "time"])
      )
      .title("Heat Map")
      .transform([vl.filter(brush)])
      .width(width / 2)
      .height(width / 3)

    const population = vl
      .markLine({ interpolate: "step", clip: true })
      .data(populationData)
      .encode(
        vl.x().fieldQ("time").title("Tempo de jogo"),
        vl.y().fieldQ("quantity").scale({ domainMin: 0 }),
        vl.color().fieldN("agent"),
        vl
          .color()
          .fieldN("agent")
          .title("População")
          .legend({ orient: "bottom" })
      )
      .title("Gráfico de População")
      .transform(vl.filter(brush))
      .width(specialWidth)

    const brushJSON = JSON.stringify(brush)

    const heatMapJson = {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "width": 400,
      "height": 266.6666666666667,
      "autosize": {
        "type": "none",
        "contains": "padding"
      },
      "layer": [
        {
          "data": {
            "values": [
              {
                "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvTA8pH2qG8kSOrgxuiT0L-RuwZzMBguCRUQ&s" 
              }
            ]
          },
          "mark": {
            "type": "image",
            "width": 400,
            "height": 266.6666666666667
          },
          "encoding": {
            "x": {
              "value": 200
            },
            "y": {
              "value": 133.33

            },
            "url": {
              "field": "url"
            }
          }
        },
        {
          "data": {
            "values": data
          },
          "mark": {
            "type": "rect",
            "clip": true
          },
          "encoding": {
            "x": {
              "field": "position_x",
              "type": "quantitative",
              "bin": {
                "maxbins": 20
              },
              "axis": {
                "grid": true,
                "gridColor": "#FFFFFF"
              },
              "title": "",
              "scale": {
                "domainMin": 0
              }
            },
            "y": {
              "field": "position_y",
              "type": "quantitative",
              "bin": {
                "maxbins": 20
              },
              "axis": {
                "grid": true,
                "gridColor": "#FFFFFF"
              },
              "title": "",
              "scale": {
                "domainMin": 0
              },
              "sort": "descending"
            },
            "color": {
              "type": "quantitative",
              "aggregate": "count",
              "scale": {
                "scheme": "reds"
              },
              "legend": {
                "orient": "bottom",
                "padding": 10
              }
            },
            "tooltip": [
              {
                "field": "name",
                "type": "nominal"
              },
              {
                "field": "time",
                "type": "nominal"
              }
            ]
          },
          "title": "Heat Map",
          "transform": [
        {
            "filter": JSON.parse(brushJSON)
        }
    ],
        }
      ],
      "resolve": { "scale": { "x": "shared", "y": "shared" } }
    }

    const combinedSpec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "vconcat": [JSON.parse(timeLine), heatMapJson, JSON.parse(activitiesCircle), JSON.parse(population)] // As duas visualizações
    };

    window.vegaEmbed(`#${component_id}`, combinedSpec)
  })

  return <div id={component_id}></div>
}

export default Visualization
