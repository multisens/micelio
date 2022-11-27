import Header from '../../components/Header';
import axios from 'axios';
import { Box, Button, Container, Flex, Grid, GridItem, Heading, Text, useConst } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import Api from '../../services/Api';
import { toast, ToastContainer } from 'react-toastify';
import { IoGameController } from 'react-icons/io5';
import { BsPlusCircle } from 'react-icons/bs';
import GameCard from '../../components/GameCard';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/AuthContext';
import CreateGameModal from '../../components/_modals/CreateGameModal';

export default function HomePage() {
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [gameList, setGameList] = useState([]);

  const [repo, setRepo] = useState([]);

  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    doUpdateGamelist();
  }, []);

  const doUpdateGamelist = async () => {
    try {
      const response = await Api.get('/game');
      setGameList(response.data.data);
    } catch (e) {
      const msg = e.response ? e.response.data.error : 'Houve um erro ao entrar. Por favor, tente novamente.';
      toast.error(msg);
    }
  };

  return (
    <>
      <CreateGameModal
        isOpen={isGameModalOpen}
        onClose={() => {
          setIsGameModalOpen(false);
        }}
        onCreateGame={async () => {
          setIsGameModalOpen(false);
          await doUpdateGamelist();
        }}
      />
      <ToastContainer />
      <Header />
      <Container maxW={'container.xl'} mt={10}>
        <Flex alignItems={'end'} mb={10}>
          <Heading>Seus jogos</Heading>
          <Button variant={'primary'} size={'sm'} ms={5} onClick={() => setIsGameModalOpen(true)}>
            <BsPlusCircle color={'white'} size={12} style={{ marginRight: 5 }} />
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
      </Flex>
    </Flex>
  );
};

const GameList = ({ gameList }) => {
  return (
    <Grid templateColumns={'1fr 1fr 1fr 1fr'} columnGap={5}>
      {gameList &&
        gameList.map((game) => (
          <GridItem key={game.game_id}>
            <GameCard
              id={game.game_id}
              title={game.name}
              groupCount={game.groups_created}
              activeSessionCount={game.active_sessions}
              status={'Privado'}
              isOwner={game.is_owner}
            />
          </GridItem>
        ))}
    </Grid>
  );
};
