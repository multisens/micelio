import styled from 'styled-components';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import Api from '../../services/Api';
import { Box, Button, Container, Flex, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function GamePage(props) {
  const [currentGame, setCurrentGame] = useState(null);
  const router = useRouter();
  const { gameId } = router.query;

  useEffect(() => {
    Api.get(`/game/${gameId}`).then((response) => {
      console.log(response.data);
      setCurrentGame(response.data.game);
    });
  }, [gameId]);

  console.log(currentGame);

  return (
    <>
      <Box h={'100vh'} bg={'#f7fcff'}>
        <Header />

        <Container maxW={'container.xl'} mt={10}>
          <Link href={'/home'}>
            <Text display={'flex'} alignItems={'center'} cursor={'pointer'} fontSize={16}>
              <FiArrowLeft style={{ marginRight: 5 }} />
              <Text>Voltar</Text>
            </Text>
          </Link>
          <Flex mt={5}>
            <Flex
              flexDir={'column'}
              alignItems={'center'}
              boxShadow={'0 0 10px #cdcdcd'}
              bg={'white'}
              borderRadius={8}
              p={10}
              pb={5}
              maxW={'300px'}>
              <GameImage>
                <Text>JT</Text>
              </GameImage>
              <Box mt={4}>
                <Heading>{currentGame?.name}</Heading>
                <hr style={{ marginTop: 15, marginBottom: 15 }} />
              </Box>
              <Box bg={'gray.200'} w={'100%'} borderRadius={8} p={2}>
                <Text>
                  <strong>Versão:</strong> {currentGame?.version}
                </Text>
                <Text>
                  <strong>Criador:</strong> {currentGame?.username}
                </Text>
              </Box>
              <Button bg={'red'} color={'white'} mt={8} fontWeight={'bold'}>
                Deletar jogo
              </Button>
            </Flex>
            <Tabs variant="soft-rounded" colorScheme="facebook" ms={10}>
              <TabList>
                <Tab>Grupos</Tab>
                <Tab>Visualizações</Tab>
                <Tab>Grupos de visualização</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <p>one!</p>
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        </Container>
      </Box>
    </>
  );
}

const GameImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;

  color: white;
  font-weight: bold;
  font-size: 42px;

  border-radius: 50%;
  background-color: #6f6f6f;
`;
