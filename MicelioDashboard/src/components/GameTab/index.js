import { useEffect, useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Select, Box } from "@chakra-ui/react"

import Api from "../../services/Api";
import SessionGroupList from "../../components/SessionGroupList";
import Visualization from "../Visualization";

const tabSelectedStyle = { bg: '#2A9D8F', color: 'white', border: '2px solid #bfbfbf' }

const GameTab = ({ groupList, gameToken, visualizations, onAddGroup, onSelectGroup, gameId, visualizationSingleSessionName }) => {
  const [visualizationConfig, setVisualizationConfig] = useState({});
  const [currentVisualization, setCurrentVisualization] = useState('')
  const [sessions, setSessions] = useState([])
  const [currentSession, setCurrentSession] = useState('')

  useEffect(() => {
    getSessions()
  }, []);

  const getSessions = async () => {
    try {
      const response = await Api.get(`/session/${gameId}`);
      setSessions(response.data)
    } catch (e) {
      console.error(e.response)
    }
  }

  const drawCurrentVisualization = (e) => {
    const currentVisualizationId = e.target.value
    setCurrentVisualization(currentVisualizationId)

    const visualization = visualizations.filter(visualization => {
      return visualization.visualization_id == currentVisualizationId
    })

    if (!visualization.length) {
      setVisualizationConfig({})
      return
    }

    setVisualizationConfig(JSON.parse(visualization[0].config))
  }

  const resetStatesByTab = (index) => {
    switch (index) {
      case 1:
        setCurrentSession('');
        break;
      default:
        break;
    }
  };

  return (
    <Tabs variant='enclosed' colorScheme={"green"} onChange={resetStatesByTab}>
      <TabList>
        <Tab _selected={tabSelectedStyle}>Grupos criados</Tab>
        <Tab _selected={tabSelectedStyle}>Visualizações</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SessionGroupList groups={groupList} onAddGroup={() => { onAddGroup() }} onSelectGroup={onSelectGroup} />
        </TabPanel>

        <TabPanel >
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
              <Select mt={2} bg={'white'} maxWidth={450} value={currentSession} onChange={e => { setCurrentSession(e.target.value) }}>
                <option value=''>Escolha uma sessão:</option>
                {
                  sessions.map(s => (
                    <option key={s.session_id} value={s.session_id}>{s.formattedDate} {s.end_time} - {s.name}</option>
                  ))
                }
              </Select>
            )
          }

          {
            (currentSession && visualizationConfig && visualizationConfig?.graphs !== undefined) &&
            <Box mt={10}>
              <Visualization
                props={visualizationConfig}
                component_id="single"
                currentSession={currentSession}
              />
            </Box>
          }
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default GameTab
