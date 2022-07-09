import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { COLOR_PRIMARY } from '../../styles/_variables';

export default function GameCard({ title, groupCount, activeSessionCount, status }) {
  return (
    <Flex
      bg={'white'}
      borderLeft={`4px solid ${COLOR_PRIMARY}`}
      minH={'120px'}
      minW={'200px'}
      p={4}
      cursor={'pointer'}
      flexDirection={'column'}
      boxShadow={'2px 2px 5px #cdcdcd'}
      borderRadius={8}>
      <Flex>
        <Heading size={'md'} textDecor={'underline'}>
          {title}
        </Heading>
      </Flex>
      <hr style={{ marginTop: 10, marginBottom: 10 }} />
      <Text>
        <strong>Grupos criados:</strong> {groupCount}
      </Text>
      <Text>
        <strong>Sessões ativas:</strong> {activeSessionCount}
      </Text>
      <Text>
        <strong>Status:</strong> {status}
      </Text>
      <Flex justifyContent={'end'} mt={5}>
        <Button size={'sm'}>Compartilhar</Button>
        <Button size={'sm'} ms={2}>
          Criar grupo
        </Button>
      </Flex>
    </Flex>
  );
}
