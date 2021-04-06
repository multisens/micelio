import React from 'react';
import {AiFillGithub} from 'react-icons/ai'
import './style.css';

function Index() {
  return (
    <div className={'content-body'}>
      <header className={'main'}>
        <h1>Micelio</h1>
      </header>

      <div className={'container'}>
        <div className={'login-card'}>
          <div>
            <h1 className={'card-title'}>Faça login</h1>
          </div>
          <div className={'form'}>
            <input className={'primary'} type="text" name={'username'} placeholder={'Username'} />
            <input className={'primary'} type="password" name={'password'} placeholder={'Password'} />
            <button className={'primary'}>Entrar</button>
            <span>Não possui conta? <a href="#">Cadastre-se</a></span>
          </div>
        </div>
      </div>

      <footer className={'main'}>
        <span>Micelio - Cefet-RJ | GPMM</span>
        <AiFillGithub size={32} />
        <span>Igor, Lucas e Marcelo</span>
      </footer>
    </div>
  )
}

export default Index;
