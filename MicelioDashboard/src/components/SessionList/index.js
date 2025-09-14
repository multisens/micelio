import React, { useState, useEffect } from "react";
import "./style.css";

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

function SessionsList({ sessions, onSelectSession }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(4);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isExpanded || isSearching) {
      setDisplayLimit(Infinity);
    } else {
      setDisplayLimit(4);
    }
  }, [isExpanded, isSearching]);

  const filterSessions = (event) => {
    const query = event.target.value.toLowerCase().trim();
    if (query) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }

    sessions.forEach((session) => {
      const $card = document.getElementById(`session-${session.session_id}`);
      if (!$card) return;

      const name = session.name.toLowerCase();
      const id = session.session_id.toLowerCase();
      const formattedDate = session.formattedDate.toLowerCase();

      const match = name.includes(query) || id.includes(query) || formattedDate.includes(query);
      $card.style.display = match ? "block" : "none";
    });
  };


  const sessoesFinalizadas = sessions.filter(session => session.end_time).length;


  return (
    <>
      <div className="grouplist">
        <div className="grouplist-header">
          <div>
            <input
              type="text"
              className="primary"
              placeholder="Busque sessões"
              onKeyUp={filterSessions}
            />
          </div>
        </div>
        <div className="sessions">
          <div className="sessions-count">
            <span>Total de sessões: {sessions.length} {sessions.length === 1 ? "sessão" : "sessões"}</span>
          </div>
          <div className="sessions-count">
            <span>Sessões ativas: {sessions.length - sessoesFinalizadas}</span>
          </div>
          <div className="sessions-count">
            <span>Sessões finalizadas: {sessoesFinalizadas}</span>
          </div>
        </div>
        <ul>
          {sessions.slice(0, displayLimit).map((session) => (
            <li
              key={session.session_id}
              id={`session-${session.session_id}`}
              className="group-card"
              onClick={() => onSelectSession(session)}
            >
              <span>
                <i>ID: {session.session_id}</i>
              </span>
              <Hr />
              <p>
                <b>Nome:</b> {session.name}
              </p>
              <p>
                <b>Data:</b> {session.formattedDate}
              </p>
              <p>
                <b>Horário:</b> {session.end_time || "—"}
              </p>
              <p>
                <b>Device ID:</b> {session.device_id ?? "Não informado"}
              </p>
            </li>
          ))}
        </ul>

      </div>

      {sessions.length > 4 && !isSearching && (
        <div className="more-groups">
          <button className="primary" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Ver menos" : "Ver mais"}
          </button>
        </div>
      )}
    </>
  );
}

export default SessionsList;
