import { useEffect, useState } from "react";
import {Tabs, TabList, TabPanels, Tab, TabPanel, Select, Box} from "@chakra-ui/react"

import Api from "../../services/Api";
import SessionGroupList from "../../components/SessionGroupList";
import Visualization from "../Visualization";

const tabSelectedStyle = {bg: '#2A9D8F', color: 'white', border: '2px solid #bfbfbf'}

const GameTab = ({ groupList, gameToken, onAddGroup, gameId, visualizationSingleSessionName }) => {

  const [visualizationConfig, setVisualizationConfig] = useState({});
  const [visualizations, setVisualizations] = useState([])
  const [currentVisualization, setCurrentVisualization] = useState('')
  const [currentSession, setCurrentSession] = useState('')
  const [currentGroup, setCurrentGroup] = useState('')

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
          <Select bg={'white'} maxWidth={450} onChange={drawCurrentVisualization} value={currentVisualization}>
            <option value=''>Escolha uma visualização:</option>
            {
              visualizations.map(v => (
                  <option key={v.visualization_id} value={v.visualization_id}>{v.name}</option>
              ))
            }
          </Select>
          {
            currentVisualization && (
                  <Select mt={2} bg={'white'} maxWidth={450} value={currentSession} onChange={e => {setCurrentSession(e.target.value)}}>
                    <option value=''>Escolha uma sessão:</option>
                    <option value={'1'}>02/03/2022 20:05 - iguinho</option>
                    <option value={'2'}>02/03/2022 20:32 - mhbarros</option>
                    <option value={'3'}>03/03/2022 22:28 - sargeirolucas</option>
                  </Select>
              )
          }

          {
            (currentSession && visualizationConfig && visualizationConfig?.graphs !== undefined) &&
            <Box mt={10}>
              <Visualization
                  props={visualizationConfig}
                  component_id="single"
              />
            </Box>
          }
        </TabPanel>

        <TabPanel>
          <Select bg={'white'} maxWidth={450} onChange={drawCurrentVisualization} value={currentVisualization}>
            <option value=''>Escolha uma visualização:</option>
            {
              visualizations.map(v => (
                  <option key={v.visualization_id} value={v.visualization_id}>{v.name}</option>
              ))
            }
          </Select>

          {
            currentVisualization && (
                  <Select mt={2} value={currentGroup} onChange={e => setCurrentGroup(e.target.value)} maxWidth={450} bg={'white'}>
                    <option value=''>Escolha o grupo de sessões</option>
                    <option value='2'>45854</option>
                    <option value='3'>46229</option>
                  </Select>
              )
          }

          {
            (visualizationConfig.graphs !== undefined && currentGroup) &&
            <Box mt={10}>
              <Visualization
                  props={visualizationConfig}
                  component_id="group"
              />
            </Box>
          }
        </TabPanel>

      </TabPanels>
    </Tabs>
  )
}

export default GameTab
