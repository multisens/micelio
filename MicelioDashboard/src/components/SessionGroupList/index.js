import React, { useState, useEffect } from 'react';
import './style.css';


const Hr = () => {
  return (
    <hr style={{
      color: '#dfdfdf',
      backgroundColor: '#dfdfdf',
      height: .5,
      borderColor: '#dfdfdf'
    }}/>
  );
}

function SessionGroupList({groups}) {
  if(!groups) groups = [];

  const [isGroupsExpanded, setIsGroupsExpanded] = useState(false)
  const [groupsLimit, setGroupsLimit] = useState(4)

  useEffect(() => {
    if(isGroupsExpanded) {
      setGroupsLimit(Infinity);
      return;
    }

    setGroupsLimit(4);
  }, [isGroupsExpanded])

  return (
    <>
      <div className={'grouplist'}>
        <div className={'grouplist-header'}>
          <h2>Grupos Criados</h2>
          <p>Grupos de sessão criados para os seus jogos.</p>
        </div>
        <ul>
          {
            groups.slice(0, groupsLimit).map(group => (
              <li>
                <h3>{group.name}</h3>
                <span><i>{group.session_group_id}</i></span>
                <Hr/>
                <p><b>Status: </b>{group.status || 'Aberto'}</p>
                <p><b>Criador: </b>{group.creator || 'Lucas'}</p>
                <p><b>Sessões: </b>{group.sessions || '40'}</p>
              </li>
            ))
          }
        </ul>
      </div>
      {
        groups.length > 4 ?
          (
            <div className={'more-groups'}>
              <button className="primary" onClick={() => {setIsGroupsExpanded(!isGroupsExpanded)}}>{isGroupsExpanded ? 'Ver menos' : 'Ver mais'}</button>
            </div>
          ) : ''
      }
    </>
  )
}

export default SessionGroupList;
