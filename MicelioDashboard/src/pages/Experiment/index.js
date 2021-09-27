import React, {useState, useEffect} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import './style.css';

import Api from '../../services/Api'

import PageFormat from '../../components/PageFormat';
import ExperimentCards from '../../components/ExperimentCards';
import Card from '../../components/Card';
import Popup from '../../components/Popup'

import 'react-toastify/dist/ReactToastify.min.css';

const GAMELIST_MAX_CARDS = 4;

function Home() {

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isGamesExpanded, setIsGamesExpanded] = useState(false)
  const [gameCards, setGameCards] = useState(GAMELIST_MAX_CARDS)

  const [newGame, setNewGame] = useState('')
  const [newGameVersion, setNewGameVersion] = useState('')

  const [gameList, setGameList] = useState([])

  const [isSearchingGame, setIsSearchingGame] = useState(false);

  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [shareUser, setShareUser] = useState('');
  const [shareGame, setShareGame] = useState('');


  useEffect(() => {
    updateGameList();
  }, [])

  useEffect(() => {
    if(isGamesExpanded || isSearchingGame) {
      setGameCards(Infinity);
      return;
    }
    setGameCards(GAMELIST_MAX_CARDS);

  }, [isGamesExpanded, isSearchingGame])

  const updateGameList = () => {
    Api.get('/game').then(response => {
      setGameList(response.data.data);
    })
  }

  const doCreateGame = async event => {
    event.preventDefault()

    try {
      const response = await Api.post('/game', {
        name: newGame,
        version: newGameVersion
      })

      if(!response.data.ok) {
        return alert('Não foi possível efetuar cadastro. Por favor, tente novamente')
      }

      setNewGame('')
      setNewGameVersion('')
      setIsPopupOpen(false)

      toast.success('Cadastrado com sucesso', {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})

      updateGameList()

    }catch (e) {
      console.log(e.response.data)
      toast.error(`Não foi possível efetuar cadastro. Por favor, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
    }
  }

  const openSharePopup = game_id => {
    setShareGame(game_id);
    setIsSharePopupOpen(true);
  }

  const doShareGame = async (formEvent) => {
    formEvent.preventDefault();

    try{
      await Api.post('/game/share', {game_id: shareGame, user_share: shareUser});
      toast.success('Compartilhado com sucesso');

      setShareUser('');
    }catch (e) {
      toast.error(e.response.data.error, );
    }
  }

  const filterGameList = (keyboardEvent) => {
    const filterText = keyboardEvent.target.value.toLowerCase().replace(' ', '');

    if(filterText) {
      setIsSearchingGame(true);
    }else{
      setIsSearchingGame(false);
    }

    gameList.forEach(game => {
      const gameName = game.name.toLowerCase().replace(' ', '');
      const $gameCard = document.getElementById(game.game_id);

      if(!$gameCard) {
        return;
      }

      if(gameName.indexOf(filterText) === -1) {
        $gameCard.style.display = 'none';
        return;
      }

      $gameCard.style.display = 'flex';
    })
  }

  return (
    <>
      <ToastContainer />

      <Popup isOpen={isSharePopupOpen} onClose={() => {setIsSharePopupOpen(false)}}>
        <h2>Compartilhe o jogo</h2>
        <form onSubmit={doShareGame}>
          <input required type={'text'} placeholder={'Nome de usuário'} value={shareUser} onChange={e => {setShareUser(e.target.value)}} />
          <button className={'primary'}>Compartilhar</button>
        </form>
      </Popup>

      <Popup isOpen={isPopupOpen} onClose={() => {
        setIsPopupOpen(false)
      }}>
        <h2>Cadastre um novo jogo</h2>
        <form onSubmit={doCreateGame}>
          <input required type="text" className="primary" placeholder={'Nome'} value={newGame}
                 onChange={e => setNewGame(e.target.value)}/>
          <input required type="text" className="primary" placeholder={'Versão'} value={newGameVersion}
                 onChange={e => setNewGameVersion(e.target.value)}/>
          <button className="primary">Cadastrar</button>
        </form>
      </Popup>

      <PageFormat menuSelected={'experiment'}>
        <main className={'experimentlist-container'}>

          <ExperimentCards title="Meus Experimentos" onSearch={filterGameList} onClickAdd={() => {
            setIsPopupOpen(true);
          }}>
            {
              gameList.length > 0 ? gameList.slice(0, gameCards).map((game) => {
                return (<Card key={game.game_id}
                              id={game.game_id}
                              name={game.name}
                              created={game.groups_created}
                              active={game.active_sessions}
                              shared={game.is_shared}
                              isOwner={game.is_owner}
                              onShare={() => {openSharePopup(game.game_id)}} />);
              }) : (<span>Não há experimentos cadastrados</span>)
            }
          </ExperimentCards>

          {
            gameList.length > 4 && !isSearchingGame ? (
              <div className={'more-games'}>
                <button className={'primary'} onClick={() => {setIsGamesExpanded(!isGamesExpanded)}}>{isGamesExpanded ? 'Ver menos' : 'Ver mais'}</button>
              </div>
            ) : ''
          }

        </main>
      </PageFormat>
    </>
  )
}

export default Home;
