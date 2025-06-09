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
import useExpandableList from "../../hooks/useExpandableList";
import GraphConfigPanel from "../../components/GraphConfigPanel/GraphConfigPanel"


function Game() {
  const params = useParams()

  const [visualizationName, setVisualizationName] = useState("")
  const [visualizationConfig, setVisualizationConfig] = useState({});

  const [visualizationConfiguration, setVisualizationConfigurationJson] = useState({})
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isSessionPopupOpen, setIsSessionPopupOpen] = useState(false);

  const handleSelectSession = (session) => {
    setSelectedSession(session);
    setIsSessionPopupOpen(true);
  };


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

  const {
    visibleItems: visibleActivities,
    hasMore: hasMoreActivities,
    showMore: showMoreActivities
  } = useExpandableList(visualizationConfiguration.activities || [], 4, 1);

  const {
    visibleItems: visibleAgents,
    hasMore: hasMoreAgents,
    showMore: showMoreAgents
  } = useExpandableList(visualizationConfiguration.agents || [], 4, 1);

  const {
    visibleItems: visibleEntities,
    hasMore: hasMoreEntities,
    showMore: showMoreEntities
  } = useExpandableList(visualizationConfiguration.entities || [], 4, 1);

  const [graphStates, setGraphStates] = useState({
    timeline: false,
    activityList: false,
    heatmap: false,
    population: false
  });

  const typeMap = {
    timeline: "Timeline",
    activityList: "ActivityList",
    heatmap: "HeatMap",
    population: "Population"
  };

  const [graphSelections, setGraphSelections] = useState({});

  const mapaNomePorKey = {
    timeline: "Linha do Tempo",
    activityList: "Atividades",
    heatmap: "Mapa de Calor",
    population: "Gráfico de População"
  };


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
    formEvent.preventDefault();

    const graphs = Object.entries(graphStates)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => {
        const sel = graphSelections[key] || {};
        const activitiesJson = sel.activities || [];
        const agentsJson = sel.agents || [];
        const entitiesJson = sel.entities || [];

        const formattedInsertActivitiesJson = activitiesJson.map((a) => ({ name: a }));

        const graph = {
          id: mapaNomePorKey[key],
          type: typeMap[key],
          activities: activitiesJson,
          agents: agentsJson,
          entities: entitiesJson,
          filter_by: "Linha do Tempo"
        };

        if (key === "activityList") graph.circle_bins = 40;

        if (key === "population") {
          graph.checbox_filter = "true";
          graph.insert = formattedInsertActivitiesJson;
          graph.remove = [
            { name: "Predacao", role: ["presa"] },
            { name: "remover predador" },
            { name: "morte" }
          ];
        }

        if (key === "heatmap" && sel.image) {
          graph.image = sel.image;
        }

        return graph;
      });

    const configurationData = {
      screen_width: 824,
      type: "session",
      graphs
    };

    try {
      await Api.post(`/visualization/${params.id}`, {
        name: visualizationName,
        config: JSON.stringify(configurationData)
      });

      toast.success("Visualização cadastrada com sucesso");
      setIsPopupOpen(false);
      setTimeout(() => window.location.reload(), 2000);
    } catch (e) {
      toast.error(e.response?.data?.error || "Erro ao cadastrar");
    }
  };


  const exibirPopUp = () => {
    setIsPopupOpen(true)
  }

  return (
    <>
      {/* Popup Criação Grupo */}
      <Popup isOpen={isGroupPopupOpen} onClose={() => { setNewGroupName(''); setNewGroupId(''); setIsGroupPopupOpen(false); }} customStyle={{ width: "600px", height: "207px", overflowY: "hidden" }}>
        <h2>Cadastre um grupo</h2>
        <input className="primary" type="text" value={newGroupName} placeholder="Nome do grupo" onChange={(e) => setNewGroupName(e.target.value)} />
        <button className="primary" onClick={doCreateGroup}>Cadastrar</button>
        {newGroupId && <div className="group-id">{newGroupId}</div>}
      </Popup>

      {/* Popup Visualização por Grupo */}
      <Popup isOpen={isPopupGroupVisualizationOpen} onClose={() => { setSelectedGroup(null); setCurrentVisualization(""); setVisualizationConfig({}); setIsPopupGroupVisualizationOpen(false); }}>
        {selectedGroup && (
          <div className="visualization-popup-container">
            <div className="visualization-controls">
              <h2>Grupo Selecionado</h2>
              <div className="visualization-popup-container">
                <div className="visualization-popup-container-data">
                  <p><b>ID:</b> {selectedGroup.session_group_id}</p>
                  <p><b>Nome:</b> {selectedGroup.name}</p>
                  <p><b>Status:</b> {selectedGroup.it_ends ? "Fechado" : "Aberto"}</p>
                </div>
              </div>
              <div className="visualization-select">
                <label htmlFor="select-visualization">Selecione uma visualização:</label>
                <select
                  id="select-visualization"
                  className="styled-select"
                  onChange={handleVisualizationChange}
                  value={currentVisualization}
                >
                  <option value="">Selecione uma visualização</option>
                  {visualizations.map((v) => (
                    <option key={v.visualization_id} value={v.visualization_id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="visualization-graph">
              {currentVisualization && visualizationConfig?.graphs && (
                <Visualization
                  props={visualizationConfig}
                  component_id="popup"
                  currentGroupSession={selectedGroup.session_group_id}
                />
              )}
            </div>
          </div>
        )}
      </Popup>

      {/* Popup Visualização por Sessão */}
      <Popup isOpen={isSessionPopupOpen} onClose={() => { setSelectedSession(null); setIsSessionPopupOpen(false); }}>
        {selectedSession && (
          <>
            <h2>Sessão Selecionada</h2>
            <div className="visualization-popup-container">
              <div className="visualization-popup-container">
                <div className="visualization-popup-container-data">
                  <p><b>ID:</b> {selectedSession.session_id}</p>
                  <p><b>Nome:</b> {selectedSession.name}</p>
                  <p><b>Data:</b> {selectedSession.formattedDate}</p>
                  <p><b>Horário:</b> {selectedSession.end_time || "—"}</p>
                  <p><b>Status:</b> {selectedSession.end_time ? "Fechada" : "Aberta"}</p>
                </div>
              </div>
              <div className="visualization-select">
                <label htmlFor="select-visualization">Selecione uma visualização:</label>
                <select
                  id="select-visualization"
                  className="styled-select"
                  onChange={handleVisualizationChange}
                  value={currentVisualization}
                >
                  <option value="">Selecione uma visualização</option>
                  {visualizations.map((v) => (
                    <option key={v.visualization_id} value={v.visualization_id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="visualization-graph">
                {currentVisualization && visualizationConfig?.graphs && (
                  <Visualization
                    props={visualizationConfig}
                    component_id="popup"
                    currentSession={selectedSession.session_id}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </Popup>

      <ToastContainer />

      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} customStyle={{ width: "60%" }}>
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

          <p>Escolha os gráficos que deseja incluir e configure os dados:</p>

          {Object.entries(graphStates).map(([key, enabled]) => (
            <div key={key} style={{ marginBottom: "1rem" }}>
              <label>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() =>
                    setGraphStates((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                />
                {mapaNomePorKey[key]}
              </label>

              {enabled && (
                <GraphConfigPanel
                  graphKey={key}
                  availableData={visualizationConfiguration}
                  selectedItems={graphSelections}
                  setSelectedItems={setGraphSelections}
                  handleCheckboxChange={(e, currentList, setNewList) => {
                    const { value, checked } = e.target;
                    const updated = checked
                      ? [...currentList, value]
                      : currentList.filter((item) => item !== value);
                    setNewList(updated);
                  }}
                />
              )}
            </div>
          ))}

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
              <Box mt={5}>
                <GameTab groupList={groups} gameToken={game.token} visualizations={visualizations} onAddGroup={doCreateGroup} onSelectGroup={doCreateVisualizationGroup} onSelectSession={handleSelectSession} gameId={params.id}
                  visualizationSingleSessionName="dashboard1" onAddVisualization={exibirPopUp} />
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