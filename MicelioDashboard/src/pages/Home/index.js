import React, {useState, useEffect} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import './style.css';

import Api from '../../services/Api'

import PageFormat from '../../components/PageFormat';
import GameCardsContainer from '../../components/GameCardsContainer';
import Card from '../../components/Card';
import SessionGroupList from '../../components/SessionGroupList';
import Popup from '../../components/Popup'

import 'react-toastify/dist/ReactToastify.min.css';

const GAMELIST_MAX_CARDS = 4;

function Home() {

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isGroupPopupOpen, setIsGroupPopupOpen] = useState(false)
  const [isGamesExpanded, setIsGamesExpanded] = useState(false)
  const [gameCards, setGameCards] = useState(GAMELIST_MAX_CARDS)

  const [newGame, setNewGame] = useState('')
  const [newGameVersion, setNewGameVersion] = useState('')
  const [newGroupId, setNewGroupId] = useState('')

  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupGame, setNewGroupGame] = useState('')
  const [gameList, setGameList] = useState([])
  const [groupList, setGroupList] = useState([])

  const [isSearchingGame, setIsSearchingGame] = useState(false);


  useEffect(() => {
    updateGameList();
    updateGroupList();
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

  const updateGroupList = () => {
    Api.get('/group').then(response => {
      setGroupList(response.data.data)
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

  const openGroupPopup = game_id => {
    setNewGroupGame(game_id);
    setIsGroupPopupOpen(true);
  }

  const doCreateGroup = async () => {
    const game_id = newGroupGame;

    const response = await Api.post('/group', {game_id, name: newGroupName});
    const group_id = response.data.group_id;

    setNewGroupId(group_id);
    setNewGroupName('');

    toast.success('Grupo criado com sucesso');

    // desculpa v
    updateGroupList();
    updateGameList();
    // sério, perdão ^
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

      <Popup isOpen={isGroupPopupOpen} onClose={() => {
        setIsGroupPopupOpen(false)
        setNewGroupName('')
        setNewGroupGame('')
        setNewGroupId('')
      }}>
        <h2>Cadastre um grupo</h2>
        <input className={'primary'} type="text" value={newGroupName} placeholder={'Nome do grupo'} onChange={e => setNewGroupName(e.target.value)} />
        <button className="primary" onClick={doCreateGroup}>Cadastrar</button>
        {
          newGroupId &&
          (
            <div className={'group-id'}>
              {newGroupId}
            </div>
          )
        }

      </Popup>

      <PageFormat menuSelected={'home'}>
        <main className={'gamelist-container'}>

          <GameCardsContainer title="Meus Jogos" onSearch={filterGameList} onClickAdd={() => {
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
                              onCreateGroup={() => {openGroupPopup(game.game_id)}}/>);
              }) : (<span>Não há jogos cadastrados</span>)
            }
          </GameCardsContainer>

          {
            gameList.length > 4 && !isSearchingGame ? (
              <div className={'more-games'}>
                <button className={'primary'} onClick={() => {setIsGamesExpanded(!isGamesExpanded)}}>{isGamesExpanded ? 'Ver menos' : 'Ver mais'}</button>
              </div>
            ) : ''
          }

          <SessionGroupList groups={groupList}/>

        </main>
      </PageFormat>
    </>
  )
}

export default Home;
