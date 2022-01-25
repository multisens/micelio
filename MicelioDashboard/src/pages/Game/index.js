import React, { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { AiOutlineCopy } from "react-icons/ai"
import { useParams } from "react-router-dom"
import { Box, Textarea } from "@chakra-ui/react"

import "./style.css"

import ClipboardHelper from "../../helper/ClipboardHelper"
import PageFormat from "../../components/PageFormat"
import Api from "../../services/Api"
import GameTab from "../../components/GameTab"
import Popup from "../../components/Popup";

function Game() {
  const params = useParams()

  const [visualizationName, setVisualizationName] = useState("")
  const [configurationJson, setConfigurationJson] = useState("")
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [game, setGame] = useState(null)
  const [groups, setGroups] = useState([])

  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupId, setNewGroupId] = useState('')
  const [isGroupPopupOpen, setIsGroupPopupOpen] = useState(false)

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

  const doCreateGroup = async () => {
    setIsGroupPopupOpen(true)

    const response = await Api.post("/group", { game_id: params.id, name: newGroupName })
    const group_id = response.data.group_id

    setNewGroupId(group_id)
    setNewGroupName("")

    toast.success("Grupo criado com sucesso")

    await getGameById()
  }

  const copyToken = () => {
    const $element = document.getElementById("game-token")
    new ClipboardHelper().copy($element)

    toast.success("Token copiado com sucesso", {
      style: { boxShadow: "1px 1px 5px rgba(0,0,0,.4)" },
      autoClose: 1200,
    })
  }

  const doCreateVisualization = async (formEvent) => {
    formEvent.preventDefault()

    try {
      await Api.post(`/visualization/${params.id}`, {
        name: visualizationName,
        config: configurationJson,
      })

      toast.success("Visualização cadastrada com sucesso")
      setIsPopupOpen(false)
    } catch (e) {
      toast.error(e.response.data.error)
    }

  }

  const exibirPopUp = () => {
    setIsPopupOpen(true)
  }

  return (
    <>
      <Popup
        isOpen={isGroupPopupOpen}
        onClose={() => {
          setNewGroupName('')
          setNewGroupId('')
          setIsGroupPopupOpen(false)
        }}
      >
        <h2>Cadastre um grupo</h2>
        <input
          className={"primary"}
          type='text'
          value={newGroupName}
          placeholder={"Nome do grupo"}
          onChange={(e) => {setNewGroupName(e.target.value)}}
        />
        <button className='primary' onClick={doCreateGroup}>
          Cadastrar
        </button>
        {newGroupId && <div className={"group-id"}>{newGroupId}</div>}
      </Popup>
      <ToastContainer />

      <Popup
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false)
        }}
      >
        <h2>Cadastre um nova visualização</h2>
        <form onSubmit={doCreateVisualization}>
          <input
            required
            type='text'
            className='primary'
            placeholder={"Nome"}
            value={visualizationName}
            onChange={(e) => setVisualizationName(e.target.value)}
          />
          <Textarea
            className='primary'
            placeholder={"JSON de Configuração"}
            value={configurationJson}
            resize="none"
            focusBorderColor="#2A9D8F"
            isRequired={true}
            marginTop={4}
            height={140}
            onChange={(e) => setConfigurationJson(e.target.value)}
          />
          <button className='primary'>Cadastrar</button>
        </form>
      </Popup>

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
                <div className="drop-button-container">
                  <button className='drop-button'>Excluir Jogo</button>
                </div>
              </div>
                <div className="visualization-button-container">
                  <button className='primary' onClick={exibirPopUp}>Nova Visualização</button>

                </div>
              <Box mt={5}>
                <GameTab groupList={groups} gameToken={game.token} onAddGroup={doCreateGroup} gameId = {params.id}
                         visualizationSingleSessionName="dashboard1"/>
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
