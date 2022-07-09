import Header from '../../components/Header';
import { Box, Button, Container, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Api from '../../services/Api';
import { toast, ToastContainer } from 'react-toastify';
import { IoGameController, IoAdd } from 'react-icons/io5';
import GameCard from '../../components/GameCard';

export default function HomePage() {
  const [gameList, setGameList] = useState(null);

  useEffect(() => {
    try {
      Api.get('/game').then((response) => {
        setGameList(response.data.data);
      });
    } catch (e) {
      const msg = e.response ? e.response.data.error : 'Houve um erro ao entrar. Por favor, tente novamente.';
      toast.error(msg);
    }
  });
  return (
    <>
      <ToastContainer />
      <Header />
      <Container maxW={'container.2xl'} mt={10}>
        <Flex alignItems={'end'} mb={10}>
          <Heading>Seus jogos</Heading>
          <Button variant={'primary'} size={'sm'} ms={5}>
            <IoAdd color={'white'} size={18} style={{ marginRight: 5 }} />
            Novo jogo
          </Button>
        </Flex>

        {gameList ? <GameList gameList={gameList} /> : <NoGamesAvailable />}
      </Container>
    </>
  );
}

const NoGamesAvailable = () => {
  return (
    <Flex w={'100%'} h={'100%'} mt={'100px'} justifyContent={'center'}>
      <Flex flexDirection={'column'} alignItems={'center'}>
        <IoGameController size={64} color={'rgba(0,0,0,.3)'} />
        <Text>Nenhum jogo cadastrado</Text>
        <Button mt={10} variant={'primary'}>
          Cadastrar jogo
        </Button>
      </Flex>
    </Flex>
  );
};

const GameList = ({ gameList }) => {
  return (
    <Grid templateColumns={'1fr 1fr 1fr 1fr'}>
      {gameList &&
        gameList.map((game) => (
          <GridItem>
            <GameCard
              title={game.name}
              groupCount={game.groups_created}
              activeSessionCount={game.active_sessions}
              status={'Privado'}
            />
          </GridItem>
        ))}
    </Grid>
  );
};
