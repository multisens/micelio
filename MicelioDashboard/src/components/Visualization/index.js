import { useEffect } from "react"

import Api from "../../services/Api"
import { getPopulation } from "../../helper/Visualization"

const Visualization = ({component_id}) => {
  useEffect(async () => {
    const activitiesList = [
      "Novo inseto",
      "Predacao",
      "inserir predador",
      "Reproducao",
      "plantar",
      "colher",
      "meta cumprida",
    ]
    const activitiesHeatMapList = [
      "inserir predador",
      "Predacao",
      "plantar",
      "colher",
    ]
    const agents = [
      "pulgao",
      "cigarrinha",
      "joaninha",
      "besouro",
      "grilo",
      "lagarta",
    ]
    const entities = ["milho"]
    const activitiesMap = {
      remove: [
        { name: "Predacao", role: ["presa"] },
        { name: "remover predador" },
        { name: "morte" },
      ],
      insert: [
        { name: "plantar" },
        { name: "Novo inseto" },
        { name: "inserir predador" },
        { name: "Reproducao", role: ["inseto_1"] },
        { name: "migracao" },
      ],
    }
    const specialWidth = 824
    const CircleBins = 40

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
      /* var heatMapData = response.data.activities.filter(a => {if(activitiesHeatMapList.includes(a.name)) return a}); */

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
        .data(data)
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
        .transform([vl.filter(selectActivityName), vl.filter(brush)])
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
        .title("População")
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
