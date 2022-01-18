import { useEffect, useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"

import Api from "../../services/Api";
import SessionGroupList from "../../components/SessionGroupList";
import Visualization from "../Visualization";

const GameTab = ({ groupList, gameToken, gameId, visualizationSingleSessionName }) => {
  
  const [visualizationConfig, setVisualizationConfig] = useState({});

  useEffect( async () => {
    const response = await Api.get(`/visualization/${gameId}`);
    setVisualizationConfig(JSON.parse(response.data.config));
  }, []);

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
          {
            visualizationConfig.graphs !== undefined && 
            <Visualization 
            props = {visualizationConfig}
          />
          }
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default GameTab
