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

function Home() {

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isGroupPopupOpen, setIsGroupPopupOpen] = useState(false)
  const [isGamesExpanded, setIsGamesExpanded] = useState(false)
  const [gameCards, setGameCards] = useState(4)

  const [newGame, setNewGame] = useState('')
  const [newGameVersion, setNewGameVersion] = useState('')
  const [newGroupId, setNewGroupId] = useState('')

  const [gameList, setGameList] = useState([])
  const [groupList, setGroupList] = useState([])


  useEffect(() => {
    updateGameList();
    updateGroupList();
  }, [])

  useEffect(() => {
    if(isGamesExpanded) {
      setGameCards(Infinity);
      return;
    }
    setGameCards(4);

  }, [isGamesExpanded])

  const updateGameList = () => {
    Api.get('/game').then(response => {
      setGameList(response.data.data)
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
      const errorMessage = e.response.data.error;

      toast.error(`Não foi possível efetuar cadastro. Por favor, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
    }
  }

  const doCreateGroup = async (game_id) => {
    console.log(game_id);
    const response = await Api.post('/group', {game_id});
    const group_id = response.data.group_id;

    setNewGroupId(group_id);
    setIsGroupPopupOpen(true);

    updateGroupList();
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
      }}>
        <h2>Grupo cadastrado</h2>
        <div className={'group-id'}>
          {newGroupId}
        </div>
      </Popup>

      <PageFormat menuSelected={'home'}>
        <main className={'gamelist-container'}>

          <GameCardsContainer title="Meu Jogos" onClickAdd={() => {
            setIsPopupOpen(true);
          }}>
            {
              gameList.length > 0 ? gameList.slice(0, gameCards).map((game) => {
                const created = Math.round(Math.random() * 20) + 1;
                const active = Math.round(Math.random() * 20) + 1;
                const isShared = (Math.round((Math.random() * 100)) % 2 === 0);

                return (<Card key={game.game_id} name={game.name} created={created} active={active} shared={isShared} onCreateGroup={() => {doCreateGroup(game.game_id)}}/>);
              }) : (<span>Não há jogos cadastrados</span>)
            }
          </GameCardsContainer>

          {
            gameList.length > 4 ? (
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
