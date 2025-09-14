import { useEffect, useState } from "react";
import './style.css';
import Api from "../../services/Api";
import SessionGroupList from "../../components/SessionGroupList";
import VisualizationsList from "../VisualizationList"; // novo componente
import Visualization from "../Visualization";
import SessionList from "../SessionList";

const GameTab = ({
  groupList,
  gameToken,
  visualizations,
  onAddGroup,
  onSelectGroup,
  onSelectSession,
  gameId,
  visualizationSingleSessionName,
  onAddVisualization // 👈 nova prop
}) => {
  const [visualizationConfig, setVisualizationConfig] = useState({});
  const [currentVisualization, setCurrentVisualization] = useState('');
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState('');
  const [selectedTab, setSelectedTab] = useState("grupos");

  useEffect(() => {
    getSessions();
  }, []);

  const getSessions = async () => {
    try {
      const response = await Api.get(`/session/${gameId}`);
      setSessions(response.data);
    } catch (e) {
      console.error(e.response);
    }
  };

  return (
    <div>
      {/* Botões de navegação entre abas */}
      <div className="game-button-container">
        <button
          className={`primary ${selectedTab === "grupos" ? "active-tab" : ""}`}
          onClick={() => setSelectedTab("grupos")}
        >
          Grupos
        </button>

        <button
          className={`primary ${selectedTab === "sessoes" ? "active-tab" : ""}`}
          onClick={() => setSelectedTab("sessoes")}
        >
          Sessões
        </button>

        <button
          className={`primary ${selectedTab === "visualizacoes" ? "active-tab" : ""}`}
          onClick={() => setSelectedTab("visualizacoes")}
        >
          Visualizações
        </button>
      </div>


      {/* Aba Grupos */}
      {selectedTab === "grupos" && (
        <SessionGroupList
          groups={groupList}
          onAddGroup={onAddGroup}
          onSelectGroup={onSelectGroup}
        />
      )}
      {/* Aba Sessões */}
      {selectedTab === "sessoes" && (
        <SessionList
          sessions={sessions}
          onSelectSession={onSelectSession}
        />
      )}


      {/* Aba Visualizações */}
      {selectedTab === "visualizacoes" && (
        <>
          <VisualizationsList
            visualizations={visualizations}
            onAddVisualization={onAddVisualization}
            onSelectVisualization={(vis) => {
              setCurrentVisualization(vis.visualization_id);
              setVisualizationConfig(JSON.parse(vis.config));
            }}
          />

        </>
      )}
    </div>
  );
};

export default GameTab;
