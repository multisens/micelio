import {Button, Flex, Text} from '@chakra-ui/react';
import {AiOutlineAreaChart} from 'react-icons/ai'

export default function VisualizationTab() {
  return (
      <>
        <Flex justifyContent={'end'}>
          <Button variant={'primary'}>Criar visualização</Button>
        </Flex>
        <Flex w={'100%'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} mt={20}>
          <AiOutlineAreaChart size={64} color={'#cdcdcd'} />
          <Text mt={3}>Não há visualizações disponíveis</Text>
        </Flex>
      </>
  );
}
