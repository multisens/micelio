import { useEffect, useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react"

import Api from "../../services/Api";
import SessionGroupList from "../../components/SessionGroupList";
import Visualization from "../Visualization";

const tabSelectedStyle = {bg: '#2A9D8F', color: 'white', border: '2px solid #bfbfbf'}

const GameTab = ({ groupList, gameToken, onAddGroup, gameId, visualizationSingleSessionName }) => {

  const [visualizationConfig, setVisualizationConfig] = useState({});
  const [visualizations, setVisualizations] = useState([])
  const [currentVisualization, setCurrentVisualization] = useState('')

  useEffect( () => {
    getVisualizations()
  }, []);

  const getVisualizations = async () => {
    try {
      const response = await Api.get(`/visualization/${gameId}`);
      // setVisualizationConfig(response.data.config);
      setVisualizations(response.data)
    }catch (e) {
      console.error(e.response)
    }
  }

  const drawCurrentVisualization = (e) => {
    const currentVisualizationId = e.target.value
    setCurrentVisualization(currentVisualizationId)

    const visualization = visualizations.filter(visualization => {
      return visualization.visualization_id == currentVisualizationId
    })

    if(!visualization.length) {
      setVisualizationConfig({})
      return
    }

    setVisualizationConfig(JSON.parse(visualization[0].config))
  }

  return (
    <Tabs variant='enclosed' colorScheme={"green"}>
      <TabList>
        <Tab _selected={tabSelectedStyle}>Grupos criados</Tab>
        <Tab _selected={tabSelectedStyle}>Visualizações</Tab>
        <Tab _selected={tabSelectedStyle}>Grupos de Visualização</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SessionGroupList groups={groupList} onAddGroup={() => {onAddGroup()}}/>
        </TabPanel>

        <TabPanel>
          <Select maxWidth={450} onChange={drawCurrentVisualization} value={currentVisualization}>
            <option value=''>Escolha uma sessão:</option>
            {
              visualizations.map(v => (
                  <option key={v.visualization_id} value={v.visualization_id}>{v.name}</option>
              ))
            }
          </Select>
          <br/>
          {
            (visualizationConfig && visualizationConfig?.graphs !== undefined) &&
            <Visualization
              props={visualizationConfig}
              component_id="single"
            />
          }
        </TabPanel>

        <TabPanel>
          <Select maxWidth={300}>
            <option value='option0' disabled={true}>Escolha o grupo de sessões</option>
            <option value='option1'>45854</option>
            <option value='option2'>46229</option>
          </Select>
          <br/>
          {
            visualizationConfig.graphs !== undefined &&
            <Visualization
              props={visualizationConfig}
              component_id="group"
            />
          }
        </TabPanel>

      </TabPanels>
    </Tabs>
  )
}

export default GameTab
