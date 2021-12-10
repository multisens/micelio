import { useEffect } from "react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import SessionGroupList from "../../components/SessionGroupList"
import Api from "../../services/Api"

import { getPopulation } from "../../helper/Visualization"

const GameTab = ({ groupList, gameToken }) => {
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

    await Api.get("/activity", { headers: { token: gameToken } })

    // getPopulation(, agents, entities, activitiesMap)
  })

  return (
    <Tabs variant='enclosed' colorScheme={"green"}>
      <TabList>
        <Tab>Grupos criados</Tab>
        <Tab>Visualizações</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <SessionGroupList groups={groupList} />
        </TabPanel>
        <TabPanel>
          <div id='view'></div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default GameTab
