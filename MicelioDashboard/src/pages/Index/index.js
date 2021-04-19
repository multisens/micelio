import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import './style.css';

import Api from '../../services/Api';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FormCard from '../../components/FormCard';
import FormFooter from '../../components/FormFooter';

function Index() {
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = () => {
    // Api.post('')

    history.push('/home');
  }

  return (
    <div className={'content-body'}>
      <Header title="Micelio"/>

      <div className={'container'}>
        <FormCard title="Faça Login">
          <form onSubmit={doLogin}>
            <input className={'primary'} type="text" name={'username'} placeholder={'Username'}
                   value={username}
                   onChange={e => {
                     setUsername(e.target.value)
                   }}/>
            <input className={'primary'} type="password" name={'password'} placeholder={'Password'}
                   value={password}
                   onChange={e => {
                     setPassword(e.target.value)
                   }}/>
            <button className={'primary'}>Entrar</button>
          </form>
          <FormFooter beginingText='Não possui conta?' linkText='Cadastre-se' url='/sign'/>
        </FormCard>
      </div>

      <Footer/>
    </div>
  )
}

export default Index;
