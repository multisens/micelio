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

  const [newGame, setNewGame] = useState('')
  const [newGameVersion, setNewGameVersion] = useState('')

  const [gameList, setGameList] = useState([])

  useEffect(() => {
    Api.get('/game').then(response => {
      setGameList(response.data.data)
    })
  }, [])

  const doCreateGame = async event => {
    event.preventDefault()

    try {
      const response = await Api.post('/game', {
        name: newGame,
        version: newGameVersion,
        user_id: 'd85ffd89-fb75-4b72-9606-82d151b220d8'
      })

      if(!response.data.ok) {
        return alert('Não foi possível efetuar cadastro. Por favor, tente novamente')
      }


      setNewGame('')
      setNewGameVersion('')
      setIsPopupOpen(false)

      toast.success('Cadastrado com sucesso', {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})

    }catch (e) {
      console.log(e.response.data)
      const errorMessage = e.response.data.error;

      toast.error(`Não foi possível efetuar cadastro. Por favor, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
    }
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

      <PageFormat menuSelected={'home'}>
        <main className={'gamelist-container'}>

          <GameCardsContainer title="Meu Jogos" onClickAdd={() => {
            setIsPopupOpen(true);
          }}>
            {
              gameList.map((game) => {
                const created = Math.round(Math.random() * 20) + 1;
                const active = Math.round(Math.random() * 20) + 1;
                const isShared = (Math.round((Math.random() * 100)) % 2 === 0);

                return (<Card name={game.name} created={created} active={active} shared={isShared}/>);
              })
            }
          </GameCardsContainer>

          <SessionGroupList/>

        </main>
      </PageFormat>
    </>
  )
}

export default Home;
