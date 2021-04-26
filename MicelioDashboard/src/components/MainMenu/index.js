import React from "react";
import {useHistory} from 'react-router-dom';

import './style.css';

const MainMenu = ({selected}) => {

  const history = useHistory();

  const MenuOption = ({topic, text}) =>{
    return (
      <li onClick={()=>{doNavigation(topic)}}
          className={(selected === topic) ? 'selected' : ''}
          >{text}</li>
    );
  }

  const doNavigation = (menuOption) => {
    history.push(`/${menuOption}`);
  }

  const doExit = () => {
    history.push(`/`);
  }

  return (
    <aside className={'aside-menu'}>
      <ul>
        <MenuOption topic="home" text="Inicio"/>
        <MenuOption topic="dashboard" text="Dashboard"/>
        <MenuOption topic="profile" text="Perfil"/>
        <li onClick={doExit}>Sair</li>
      </ul>
    </aside>
  )
}

export default MainMenu;
