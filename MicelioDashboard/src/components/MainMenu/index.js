import React from "react";
import {useHistory} from 'react-router-dom';
import './style.css';
import Api from "../../services/Api";
import {useAuth} from "../../context/AuthContext";

const MainMenu = ({selected}) => {

  const history = useHistory();
  const { setAuth, setIsLoading, isAuth } = useAuth()

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

  const doExit = async () => {
    try{
      await Api.delete('/user/login')
      setAuth(false)
      history.replace(`/`);

    }catch (e) {

    }
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
