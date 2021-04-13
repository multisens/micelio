import React, {useEffect} from "react";
import {useHistory} from 'react-router-dom';

import './style.css';

const MainMenu = ({selected}) => {

  const history = useHistory();

  useEffect(() => {
    document.querySelectorAll(`.aside-menu ul li`).forEach($el => {
      $el.className = '';
      $el.addEventListener('click', doNavigation)
    })

    const $option = document.querySelector(`.aside-menu ul li[data-menu-option="${selected}"]`);
    if($option){
      $option.className = 'selected';
    }
  }, []);

  const doNavigation = ($menuOption) => {
    const toPage = $menuOption.target.dataset['menuOption'];
    history.push(`/home/${toPage}`);
  }

  return (
    <aside className={'aside-menu'}>
      <ul>
        <li data-menu-option={'start'}>Início</li>
        <li data-menu-option={'dashboard'}>Dashboard</li>
        <li data-menu-option={'profile'}>Perfil</li>
        <li>Sair</li>
      </ul>
    </aside>
  )
}

export default MainMenu;
