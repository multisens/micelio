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
import Visualization from "../../components/Visualization";

function Game() {
  const params = useParams()

  const [visualizationName, setVisualizationName] = useState("")
  const [visualizationConfig, setVisualizationConfig] = useState({});

  const [visualizationConfiguration, setVisualizationConfigurationJson] = useState({})
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedEntities, setSelectedEntities] = useState([]);

  const [visualizations, setVisualizations] = useState([]);
  const [currentVisualization, setCurrentVisualization] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isPopupGroupVisualizationOpen, setIsPopupGroupVisualizationOpen] = useState(false)

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [game, setGame] = useState(null)
  const [groups, setGroups] = useState([])

  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupId, setNewGroupId] = useState('')
  const [isGroupPopupOpen, setIsGroupPopupOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getGameById();
        await getVisualizationDataByGameId();
        await getVisualizationData();
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
  
    fetchData();
  }, []);

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

  const handleCheckboxChange = (event, setState, currentState) => {
    const { value, checked } = event.target;

    if (checked) {
      setState([...currentState, value]);
    } else {
      setState(currentState.filter((item) => item !== value));
    }
  };

  const getVisualizationDataByGameId = async () => {
    try {
      const visualizationResponse = await Api.get(`/activity/by-game-id/${params.id}`)
      setVisualizationConfigurationJson(visualizationResponse.data)
      setVisualizationConfig(visualizationResponse.data)
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

  const getVisualizationData = async () => {
    try {
      const response = await Api.get(`/visualization/${params.id}`);
      setVisualizations(response.data);
    } catch (e) {
      console.error(e.response);
    }
  };

  const handleVisualizationChange = (e) => {
    const visualizationId = e.target.value;
    setCurrentVisualization(visualizationId);

    const selectedVisualization = visualizations.find(
      (v) => v.visualization_id === visualizationId
    );

    if (selectedVisualization) {
      setVisualizationConfig(JSON.parse(selectedVisualization.config));
    } else {
      setVisualizationConfig({});
    }
  };

  const doCreateVisualizationGroup = (group) => {
    setSelectedGroup(group);
    setIsPopupGroupVisualizationOpen(true)
  };

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

    const agentsString = JSON.stringify(selectedAgents);
    const activitiesString = JSON.stringify(selectedActivities);
    const entitiesString = JSON.stringify(selectedEntities);

    const agentsJson = JSON.parse(agentsString);
    const activitiesJson = JSON.parse(activitiesString);
    const entitiesJson = JSON.parse(entitiesString);

    const formattedInsertActivities = selectedActivities.map(activity => {
      return { name: activity };
    });
    const formattedInsertActivitiesString = JSON.stringify(formattedInsertActivities);
    const formattedInsertActivitiesJson = JSON.parse(formattedInsertActivitiesString);

    const configurationData = {
      "screen_width": 824,
      "type": "session",
      "graphs": [
        {
          "id": "Linha do Tempo",
          "activities": activitiesJson,
          "type": "Timeline"
        },
        {
          "id": "Atividades",
          "type": "ActivityList",
          "activities": activitiesJson,
          "circle_bins": 40,
          "filter_by": "Linha do Tempo"
        },

        {
          "id": "Heat Map",
          "type": "HeatMap",
          "activities": activitiesJson,
          "filter_by": "Linha do Tempo"
        },

        {
          "id": "Gráfico de População",
          "type": "Population",
          "agents": agentsJson,
          "entities": entitiesJson,
          "checbox_filter": "true",
          "insert": formattedInsertActivitiesJson,
          "remove": [
            { "name": "Predacao", "role": ["presa"] },
            { "name": "remover predador" },
            { "name": "morte" }
          ],
          "filter_by": "Linha do Tempo"
        }
      ]
    };
    //precisa ajustar o remove do grafico de população
    const jsonConfigurationData = JSON.stringify(configurationData);

    try {
      await Api.post(`/visualization/${params.id}`, {
        name: visualizationName,
        config: jsonConfigurationData,
      })

      toast.success("Visualização cadastrada com sucesso")
      setIsPopupOpen(false)
      setTimeout(() => {
        window.location.reload();  
      }, 2000);

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
          onChange={(e) => { setNewGroupName(e.target.value) }}
        />
        <button className='primary' onClick={doCreateGroup}>
          Cadastrar
        </button>
        {newGroupId && <div className={"group-id"}>{newGroupId}</div>}
      </Popup>


      <Popup
        isOpen={isPopupGroupVisualizationOpen}
       
        onClose={() => {
          setSelectedGroup(null);
          setCurrentVisualization("");
          setVisualizationConfig({});
          setIsPopupGroupVisualizationOpen(false);
        }}
      >
        {selectedGroup && (
          <>
            <h2>Grupo Selecionado</h2>
            <p><b>ID:</b> {selectedGroup.session_group_id}</p>
            <p><b>Nome:</b> {selectedGroup.name}</p>
            <p><b>Status:</b> {selectedGroup.it_ends ? "Fechado" : "Aberto"}</p>

            <h3>Escolha uma Visualização</h3>
            <select onChange={handleVisualizationChange} value={currentVisualization}>
              <option value="">Selecione uma visualização</option>
              {visualizations.map((visualization) => (
                <option key={visualization.visualization_id} value={visualization.visualization_id}>
                  {visualization.name}
                </option>
              ))}
            </select>

            {currentVisualization && visualizationConfig?.graphs && (
              <div style={{ marginTop: "20px" }}>
                <h3>Visualização: {visualizations.find(v => v.visualization_id === currentVisualization)?.name}</h3>
                <Visualization
                  props={visualizationConfig}
                  component_id="popup"
                  currentGroupSession={selectedGroup.session_group_id}
                />
              </div>
            )}
          </>
        )}
      </Popup>

      <ToastContainer />

      <Popup
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false)
        }}
      >
        <h2>Cadastre uma nova visualização</h2>
        <form onSubmit={doCreateVisualization}>
          <input
            required
            type='text'
            className='primary'
            placeholder={"Nome"}
            value={visualizationName}
            onChange={(e) => setVisualizationName(e.target.value)}
          />

          <p>Selecione as atividades, agentes e entidades que deseja ter nos gráficos de análise:</p>

          {visualizationConfiguration.activities && (
            <fieldset className="checkbox-grid scrollable">
              <legend>Atividades</legend>
              {visualizationConfiguration.activities.map((activity, index) => (
                <label key={`activity-${index}`}>
                  <input
                    type="checkbox"
                    value={activity.name}
                    checked={selectedActivities.includes(activity.name)}
                    onChange={(e) =>
                      handleCheckboxChange(e, setSelectedActivities, selectedActivities)
                    }
                  />
                  {activity.name}
                </label>
              ))}
            </fieldset>
          )}

          {visualizationConfiguration.agents && (
            <fieldset className="checkbox-grid scrollable">
              <legend>Agentes</legend>
              {visualizationConfiguration.agents.map((agent, index) => (
                <label key={`agent-${index}`}>
                  <input
                    type="checkbox"
                    value={agent.name}
                    checked={selectedAgents.includes(agent.name)}
                    onChange={(e) =>
                      handleCheckboxChange(e, setSelectedAgents, selectedAgents)
                    }
                  />
                  {agent.name}
                </label>
              ))}
            </fieldset>
          )}

          {visualizationConfiguration.entities && (
            <fieldset className="checkbox-grid scrollable">
              <legend>Entidades</legend>
              {visualizationConfiguration.entities.map((entity, index) => (
                <label key={`entity-${index}`}>
                  <input
                    type="checkbox"
                    value={entity.name}
                    checked={selectedEntities.includes(entity.name)}
                    onChange={(e) =>
                      handleCheckboxChange(e, setSelectedEntities, selectedEntities)
                    }
                  />
                  {entity.name}
                </label>
              ))}
            </fieldset>
          )}

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
                <GameTab groupList={groups} gameToken={game.token} visualizations={visualizations} onAddGroup={doCreateGroup} onSelectGroup={doCreateVisualizationGroup} gameId={params.id}
                  visualizationSingleSessionName="dashboard1" />
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