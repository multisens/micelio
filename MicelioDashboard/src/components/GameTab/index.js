import { Tabs, TabList, TabPanels, Tab, TabPanel, Select } from "@chakra-ui/react"

import SessionGroupList from "../../components/SessionGroupList"
import Visualization from "../Visualization"

const GameTab = ({ groupList, gameToken }) => {
  return (
    <Tabs variant='enclosed' colorScheme={"green"}>
      <TabList>
        <Tab>Grupos criados</Tab>
        <Tab>Visualizações</Tab>
        <Tab>Grupos de Visualização</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SessionGroupList groups={groupList} />
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
          <Visualization component_id="group"/>
        </TabPanel>

      </TabPanels>
    </Tabs>
  )
}

export default GameTab
