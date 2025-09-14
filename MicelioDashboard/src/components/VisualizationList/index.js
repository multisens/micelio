import React, { useState, useEffect } from "react";
import "./style.css";
import Popup from "../Popup";

const Hr = () => (
  <hr
    style={{
      color: "#dfdfdf",
      backgroundColor: "#dfdfdf",
      height: 0.5,
      borderColor: "#dfdfdf",
    }}
  />
);

function VisualizationsList({ visualizations, onAddVisualization, onSelectVisualization }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [limit, setLimit] = useState(4);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setLimit(isExpanded || isSearching ? Infinity : 4);
  }, [isExpanded, isSearching]);

  const filterList = (e) => {
    const value = e.target.value.toLowerCase().replace(" ", "");

    if (value) setIsSearching(true);
    else setIsSearching(false);

    visualizations.forEach((v) => {
      const name = v.name.toLowerCase().replace(" ", "");
      const id = v.visualization_id;
      const $el = document.getElementById(`vis-${id}`);

      if (!$el) return;

      if (!name.includes(value) && !id.includes(value)) {
        $el.style.display = "none";
      } else {
        $el.style.display = "block";
      }
    });
  };
  const parseConfigSemImagem = (raw) => {
    try {
      const limpo = raw.replace(/"image"\s*:\s*"(.*?)"(,?)/, '"image":"[removido]"$2');
      return JSON.parse(limpo);
    } catch (e) {
      return null;
    }
  };

  return (
    <>
      <div className="grouplist">
        <div className="grouplist-header">
          <div>
            <button className="primary" onClick={onAddVisualization}>Criar nova visualização</button>
          </div>
          <div>
            <input
              type="text"
              className="primary"
              placeholder="Buscar visualizações"
              onKeyUp={filterList}
            />
          </div>
        </div>

        <ul>
          {visualizations.slice(0, limit).map((v) => (
            <li
              key={v.visualization_id}
              id={`vis-${v.visualization_id}`}
              className="group-card"
              onClick={() => onSelectVisualization(v)}
            >
              <span>
                <i>ID: {v.visualization_id}</i>
              </span>
              <Hr />
              <p>
                <b>Nome:</b> {v.name}
              </p>
              <p>
                <b>Gráficos:</b>{" "}
                {(() => {
                  const parsed = parseConfigSemImagem(v.config);
                  return parsed?.graphs?.length ?? "Inválido";
                })()}
              </p>


            </li>
          ))}
        </ul>
      </div>

      {visualizations.length > 4 && !isSearching && (
        <div className="more-groups">
          <button className="primary" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Ver menos" : "Ver mais"}
          </button>
        </div>
      )}
    </>
  );
}

export default VisualizationsList;
