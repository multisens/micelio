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

  const [isSearchingGroup, setIsSearchingGroup] = useState(false);

  useEffect(() => {
    if(isGroupsExpanded || isSearchingGroup) {
      setGroupsLimit(Infinity);
      return;
    }

    setGroupsLimit(4);
  }, [isGroupsExpanded, isSearchingGroup])

  const filterGroupList = (keyboardEvent) => {
    const filterText = keyboardEvent.target.value.toLowerCase().replace(' ', '');

    if(filterText) {
      setIsSearchingGroup(true)
    }else{
      setIsSearchingGroup(false)
    }

    groups.forEach(group => {
      const groupName = group.group_name.toLowerCase().replace(' ', '');
      const $groupCard = document.getElementById(group.session_group_id);

      if(!$groupCard) {
        return;
      }

      if(groupName.indexOf(filterText) === -1) {
        $groupCard.style.display = 'none';
        return;
      }

      $groupCard.style.display = 'block';
    })
  }

  return (
    <>
      <div className={'grouplist'}>
        <div className={'grouplist-header'}>
          <div>
            <h2>Grupos Criados</h2>
            <p>Grupos de sessão criados para os seus jogos.</p>
          </div>
          <div>
            <input type={'text'} className={'primary'} placeholder={'Busque grupos'} onKeyUp={filterGroupList}/>
          </div>
        </div>
        <ul>
          {
            groups.slice(0, groupsLimit).map(group => (
              <li key={group.session_group_id} id={group.session_group_id}>
                <h3>{group.group_name}</h3>
                <span><i>{group.session_group_id}</i></span>
                <Hr/>
                <p><b>Status: </b>{group.it_ends ? 'Fechado' : 'Aberto'}</p>
                <p><b>Jogo: </b>{group.name}</p>
                <p><b>Sessões: </b>{group.qtdSession}</p>
              </li>
            ))
          }
        </ul>
      </div>
      {
        groups.length > 4 && !isSearchingGroup ?
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
