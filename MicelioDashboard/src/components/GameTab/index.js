import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"

import SessionGroupList from "../../components/SessionGroupList"
import Visualization from "../Visualization"

const tabSelectedStyle = {bg: '#2A9D8F', color: 'white', border: '2px solid #bfbfbf'}

const GameTab = ({ groupList, gameToken, onAddGroup }) => {
  return (
    <Tabs variant='enclosed' colorScheme={"green"}>
      <TabList>
        <Tab _selected={tabSelectedStyle}>Grupos criados</Tab>
        <Tab _selected={tabSelectedStyle}>Visualizações</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <SessionGroupList groups={groupList} onAddGroup={() => {onAddGroup()}}/>
        </TabPanel>
        <TabPanel>
          <Visualization />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default GameTab
