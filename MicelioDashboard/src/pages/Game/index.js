import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './style.css';

import PageFormat from '../../components/PageFormat';
import Api from "../../services/Api";
import SessionGroupList from "../../components/SessionGroupList";

function Game() {

  const params = useParams();

  const [game, setGame] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getGameById();
  }, [])

  const getGameById = async () => {
    try{
      const gameResponse = await Api.get(`/game/${params.id}`);

      const {game: gameData, groups: groupsData} = gameResponse.data;
      setGame(gameData);
      setGroups(groupsData);
    }catch (e) {
      // todo: jogo não encontrado
    }

  }

  return (
      <PageFormat menuSelected={'dashboard'}>
        <div className="dashboard-container">
          {/*<button className={'primary'} style={{marginBottom: 20}}>Ver</button>*/}
          {game && (
            <div className={'gameinfo-container'}>
              <div className={'gameinfo-avatar'}>
                {
                  game.name.slice(0, 1).toUpperCase()
                }
              </div>
              <div className={'gameinfo'}>
                {
                  game.token && (<span><strong>Token:</strong> {game.token}</span>)
                }
                <span><strong>Nome:</strong> {game.name}</span>
                <span><strong>Versão:</strong> {game.version}</span>
                <span><strong>Criador:</strong> {game.username}</span>
              </div>
            </div>
          )}

          <SessionGroupList groups={groups}/>

        </div>
      </PageFormat>
  )
}

export default Game;
