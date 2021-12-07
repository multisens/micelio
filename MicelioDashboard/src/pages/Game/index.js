import React, {useEffect, useState} from "react"
import {ToastContainer, toast} from "react-toastify"
import {AiOutlineCopy} from 'react-icons/ai'
import {useParams} from "react-router-dom"

import "./style.css"

import ClipboardHelper from '../../helper/ClipboardHelper'
import PageFormat from "../../components/PageFormat"
import Api from "../../services/Api"
import SessionGroupList from "../../components/SessionGroupList"

function Game() {
  const params = useParams()

  const [game, setGame] = useState(null)
  const [groups, setGroups] = useState([])

  useEffect(() => {
    getGameById()

    var vlSpec = {
      data: {
        url: "https://vega.github.io/vega-lite/data/population.json",
      },
      transform: [
        {filter: "datum.year == 2000"},
        {calculate: "datum.sex == 2 ? 'Female' : 'Male'", as: "gender"},
      ],
      width: {step: 20},
      mark: "bar",
      encoding: {
        column: {
          field: "age",
          type: "ordinal",
          spacing: 10,
        },
        y: {
          aggregate: "sum",
          field: "people",
          title: "population",
          axis: {
            grid: false,
          },
        },
        x: {
          field: "gender",
          axis: {
            title: "",
          },
        },
        color: {
          field: "gender",
          scale: {
            range: ["#777666", "#E7D24F"],
          },
        },
      },
      config: {
        view: {
          stroke: "transparent",
        },
        axis: {
          domainWidth: 1,
        },
      },
    }

    // Embed the visualization in the container with id `vis`
    window.vegaEmbed("#view", vlSpec)
  }, [])

  const getGameById = async () => {
    try {
      const gameResponse = await Api.get(`/game/${params.id}`)

      const {game: gameData, groups: groupsData} = gameResponse.data
      setGame(gameData)
      setGroups(groupsData)
    } catch (e) {
      // todo: jogo não encontrado
    }
  }

  const copyToken = () => {
    const $element = document.getElementById('game-token');
    new ClipboardHelper().copy($element)

    toast.success("Token copiado com sucesso", {
      style: { boxShadow: "1px 1px 5px rgba(0,0,0,.4)" },
      autoClose: 1200
    })

  }

  return (
    <>
      <ToastContainer />
      <PageFormat menuSelected={"dashboard"}>
        <div className='dashboard-container'>
          {/*<button className={'primary'} style={{marginBottom: 20}}>Ver</button>*/}
          {game && (
            <div className={"gameinfo-container"}>
              <div className={"gameinfo-avatar"}>
                {game.name.slice(0, 1).toUpperCase()}
              </div>
              <div className={"gameinfo"}>
                {game.token && (
                  <span>
                  <strong>Token:</strong> <span id={'game-token'} data-copy={game.token}>{game.token}</span>
                </span>
                )}
                <span>
                <strong>Nome:</strong> {game.name}
              </span>
                <span>
                <strong>Versão:</strong> {game.version}
              </span>
                <span>
                <strong>Criador:</strong> {game.username}
              </span>
              </div>
              <div>
                <AiOutlineCopy onClick={copyToken} color={'black'} size={24}
                               style={{marginTop: 20, display: 'block', marginLeft: 10, cursor: 'pointer'}}/>
              </div>
              {/*<div id='view'></div>*/}
            </div>
          )}

          <SessionGroupList groups={groups}/>
        </div>
      </PageFormat>
    </>
  )
}

export default Game
