import React, {useState} from 'react';
import './style.css';

import Api from '../../services/Api'

import PageFormat from '../../components/PageFormat';
import GameCardsContainer from '../../components/GameCardsContainer';
import Card from '../../components/Card';
import SessionGroupList from '../../components/SessionGroupList';
import Popup from '../../components/Popup'

function Home() {

  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const [newGame, setNewGame] = useState('')
  const [newGameVersion, setNewGameVersion] = useState('')

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
      alert('Cadastrado com sucesso')

    }catch (e) {
      console.log(e.response.data)
      return alert('Não foi possível efetuar cadastro. Por favor, tente novamente')
    }

  }


  return (
    <>
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
            setIsPopupOpen(true)
          }}>
            <Card name={'Control Harvest'} created={3} active={'50'} shared={true}/>
            <Card name={'Bio Land'} created={3} active={'50'} shared={true}/>
            <Card name={'Animal Crossing'} created={3} active={'50'} shared={true}/>
          </GameCardsContainer>

          <SessionGroupList/>

        </main>
      </PageFormat>
    </>
  )
}

export default Home;
