import React, { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { AiOutlineCopy } from "react-icons/ai"
import { useParams } from "react-router-dom"
import { Box } from "@chakra-ui/react"

import "./style.css"

import ClipboardHelper from "../../helper/ClipboardHelper"
import PageFormat from "../../components/PageFormat"
import Api from "../../services/Api"
import GameTab from "../../components/GameTab"

function Game() {
  const params = useParams()

  const [game, setGame] = useState(null)
  const [groups, setGroups] = useState([])

  useEffect(() => {
    getGameById()
  }, [])

  const getGameById = async () => {
    try {
      const gameResponse = await Api.get(`/game/${params.id}`)

      const { game: gameData, groups: groupsData } = gameResponse.data
      setGame(gameData)
      setGroups(groupsData)
    } catch (e) {
      // todo: jogo não encontrado
    }
  }

  const copyToken = () => {
    const $element = document.getElementById("game-token")
    new ClipboardHelper().copy($element)

    toast.success("Token copiado com sucesso", {
      style: { boxShadow: "1px 1px 5px rgba(0,0,0,.4)" },
      autoClose: 1200,
    })
  }

  return (
    <>
      <ToastContainer />
      <PageFormat menuSelected={"dashboard"}>
        <div className='dashboard-container'>
          {game && (
            <>
              <div className={"gameinfo-container"}>
                <div className={"gameinfo-avatar"}>
                  {game.name.slice(0, 1).toUpperCase()}
                </div>
                <div className={"gameinfo"}>
                  {game.token && (
                    <span>
                      <strong>Token:</strong>
                      <input
                        id='game-token'
                        type='text'
                        disabled
                        value={game.token}
                        data-copy={game.token}
                      />
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
                  <AiOutlineCopy
                    onClick={copyToken}
                    color={"black"}
                    size={24}
                    style={{
                      marginTop: 40,
                      display: "block",
                      marginLeft: 10,
                      cursor: "pointer",
                    }}
                  />
                </div>
                <div className="button-container">
                  <button className='drop-button'>Excluir Jogo</button>
                </div>
              </div>
              <Box mt={5}>
                <GameTab groupList={groups} gameToken={game.token} />
              </Box>
            </>
          )}

          {/* <SessionGroupList groups={groups} /> */}
        </div>
      </PageFormat>
    </>
  )
}

export default Game
