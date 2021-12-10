import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"

import SessionGroupList from "../../components/SessionGroupList"
import Visualization from "../Visualization"

const GameTab = ({ groupList, gameToken }) => {
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
          <Visualization />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default GameTab
