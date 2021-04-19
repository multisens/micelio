import React, {useEffect} from "react";
import {useHistory} from 'react-router-dom';

import './style.css';

const MainMenu = ({selected}) => {

  const history = useHistory();

  // useEffect(() => {
  //   document.querySelectorAll(`.aside-menu ul li`).forEach($el => {
  //     $el.className = '';
  //     $el.addEventListener('click', doNavigation)
  //   })

  //   const $option = document.querySelector(`.aside-menu ul li[data-menu-option="${selected}"]`);
  //   if($option){
  //     $option.className = 'selected';
  //   }
  // }, []);

  const MenuOption = ({topic, text}) =>{
    return (
      <li onClick={()=>{doNavigation(topic)}}
          className={(selected === topic) ? 'selected' : ''}
          /*data-menu-option={topic}*/>{text}</li>
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
