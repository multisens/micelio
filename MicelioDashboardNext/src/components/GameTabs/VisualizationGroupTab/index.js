import {Button, Flex, Text} from '@chakra-ui/react';
import {MdOutlineDashboard} from 'react-icons/md'

export default function VisualizationGroupTab() {
  return (
      <>
        <Flex justifyContent={'end'}>
          <Button variant={'primary'}>Criar grupo de visualização</Button>
        </Flex>
        <Flex w={'100%'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} mt={20}>
          <MdOutlineDashboard size={64} color={'#cdcdcd'} />
          <Text mt={3}>Não há grupos de visualizações disponíveis</Text>
        </Flex>
      </>
  );
}
