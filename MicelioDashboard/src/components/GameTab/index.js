import { useEffect, useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react"

import Api from "../../services/Api";
import SessionGroupList from "../../components/SessionGroupList";
import Visualization from "../Visualization";

const tabSelectedStyle = {bg: '#2A9D8F', color: 'white', border: '2px solid #bfbfbf'}

const GameTab = ({ groupList, gameToken, onAddGroup, gameId, visualizationSingleSessionName }) => {

  const [visualizationConfig, setVisualizationConfig] = useState({});

  useEffect( async () => {
    const response = await Api.get(`/visualization/${gameId}`);
    setVisualizationConfig(JSON.parse(response.data.config));
  }, []);

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
          <Select maxWidth={450}>
            <option value='option0' disabled={true}>Escolha a sessão que deseja ver</option>
            <option value='option1'>Player: mhbarros  - 10/06/2021</option>
            <option value='option2'>Player: igdark    - 10/06/2021</option>
          </Select>
          <br/>
          <Visualization component_id="single"/>
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
              props = {visualizationConfig}
              component_id="group"
            />
          }
        </TabPanel>

      </TabPanels>
    </Tabs>
  )
}

export default GameTab
