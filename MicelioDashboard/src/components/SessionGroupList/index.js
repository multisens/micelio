import React, { useState, useEffect } from "react"
import "./style.css"
import Popup from "../../components/Popup"

const Hr = () => {
  return (
    <hr
      style={{
        color: "#dfdfdf",
        backgroundColor: "#dfdfdf",
        height: 0.5,
        borderColor: "#dfdfdf",
      }}
    />
  )
}

function SessionGroupList({ groups, onAddGroup, onSelectGroup }) {
  if (!groups) groups = []

  const [isGroupsExpanded, setIsGroupsExpanded] = useState(false)
  const [groupsLimit, setGroupsLimit] = useState(4)
  const [isSearchingGroup, setIsSearchingGroup] = useState(false)

  const gruposFinalizados = groups.filter(g => g.it_ends).length;
  const gruposAbertos     = groups.length - gruposFinalizados;


  useEffect(() => {
    if (isGroupsExpanded || isSearchingGroup) {
      setGroupsLimit(Infinity)
      return
    }

    setGroupsLimit(4);
  }, [isGroupsExpanded, isSearchingGroup])

  const filterGroupList = (keyboardEvent) => {
    const filterText = keyboardEvent.target.value.toLowerCase().replace(" ", "")

    if (filterText) {
      setIsSearchingGroup(true)
    } else {
      setIsSearchingGroup(false)
    }

    groups.forEach((group) => {
      console.log(group);

      const groupName = group.name.toLowerCase().replace(" ", "");
      const groupId = String(group.session_group_id);
      const $groupCard = document.getElementById(group.session_group_id);

      if (!$groupCard) {
        return;
      }

      if (
        groupName.indexOf(filterText.toLowerCase()) === -1 &&
        groupId.indexOf(filterText) === -1
      ) {
        $groupCard.style.display = "none";
        return;
      }

      $groupCard.style.display = "block";
    });
  }

  const handleGroupClick = (group) => {
    onSelectGroup(group);
  };

  return (
    <>
      <div className={"grouplist"}>
        <div className={"grouplist-header"}>
          <div>
            <button className='primary' onClick={() => { onAddGroup() }}>Criar grupo</button>
            {/* todo: adicionar icone*/}
          </div>
          <div>
            <input
              type={"text"}
              className={"primary"}
              placeholder={"Busque grupos"}
              onKeyUp={filterGroupList}
            />
          </div>
        </div>
        <div className="sessions"> {}
          <div className="sessions-count">
            <span>Total de grupos: {groups.length} {groups.length === 1 ? "grupo" : "grupos"}</span>
          </div>
          <div className="sessions-count">
            <span>Grupos abertos: {gruposAbertos}</span>
          </div>
          <div className="sessions-count">
            <span>Grupos finalizados: {gruposFinalizados}</span>
          </div>
        </div>
        <ul>
          {groups.slice(0, groupsLimit).map((group) => (
            <li key={group.session_group_id} id={group.session_group_id} onClick={() => handleGroupClick(group)}>
              <h3>{group.group_name}</h3>
              <span>
                <i>{group.session_group_id}</i>
              </span>
              <Hr />
              <p>
                <b>Status: </b>
                {group.it_ends ? "Fechado" : "Aberto"}
              </p>
              <p>
                <b>Nome: </b>
                {group.name}
              </p>
              <p>
                <b>Sessões: </b>
                {group.total_sessions}
              </p>
            </li>
          ))}
        </ul>
      </div>
      {groups.length > 4 && !isSearchingGroup ? (
        <div className={"more-groups"}>
          <button
            className='primary'
            onClick={() => {
              setIsGroupsExpanded(!isGroupsExpanded)
            }}
          >
            {isGroupsExpanded ? "Ver menos" : "Ver mais"}
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  )
}

export default SessionGroupList
