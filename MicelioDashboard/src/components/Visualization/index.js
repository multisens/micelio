import { useEffect } from "react"

import Api from "../../services/Api"
import { getPopulation } from "../../helper/Visualization"

const Visualization = ({props, component_id}) => {

  useEffect(async () => {
    const activitiesList = props.graphs[0].activities;
    const activitiesHeatMapList = props.graphs[3].activities;
    const agents = props.graphs[4].agents;
    const entities = props.graphs[4].entities;
    const activitiesMap = {
      insert: props.graphs[4].insert,
      remove: props.graphs[4].remove,
    }
    const specialWidth = props.screen_width;
    const CircleBins = props.graphs[0].circle_bins;

    const vl = window.vl
    const width = 800

    await Api.get("/activity").then((response) => {
      //controle de dados
      var populationData = getPopulation(
        response.data,
        agents,
        entities,
        activitiesMap
      )
      var data = response.data.activities.filter((a) => {
        if (activitiesList.includes(a.name)) return a
      })
      var heatMapData = response.data.activities.filter(a => {if(activitiesHeatMapList.includes(a.name)) return a});

      //criação dos filtros
      const brush = vl.selectInterval().encodings("x")
      const selectActivityName = vl.selectMulti().fields("name")

      //crição dos gráficos
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
            .title("Insetos")
            .legend({ orient: "bottom" })
        )
        .title("Gráfico de População")
        .transform(vl.filter(brush))
        .width(specialWidth)

      //returna o concatenado dos gráficos
      const visualization = vl.vconcat(
        timeLine,
        heatMap,
        activitiesCircle,
        population
      )

      window.vegaEmbed(`#${component_id}`, JSON.parse(visualization))
    })
  })

  return <div id={component_id}></div>
}

export default Visualization
