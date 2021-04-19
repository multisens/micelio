import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FormCard from '../../components/FormCard';
import FormFooter from '../../components/FormFooter';

import Api from '../../services/Api';

function Sign() {

  const history = useHistory();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const doRegister = async (e) => {
    e.preventDefault();

    /*if(password !== passwordConfirm) {
      alert('As senhas não conferem');
      return;
    }*/

    try{
      const userResponse = await Api.post('/user', {username, email, password});
      if(userResponse.status !== 201) {
        alert('Erro ao criar usuário');
        return;
      }

      history.push('/home');

    }catch (e) {
      const msg = e.response ? e.response.data.error : 'Houve um erro na comunicação. Por favor, tente novamente.'
      alert(msg);
    }
  }

  //todo: Responsive
  return (
    <div className={'content-body'}>
      <Header title="Micelio"/>

      <div className={'container'}>
        <FormCard title="Cadastre-se">
          <form onSubmit={doRegister}>
            <input required className={'primary'} type="text" name={'username'} placeholder={'Username'}
                   value={username}
                   onChange={e => {
                     setUsername(e.target.value)
                   }}/>
            <input required className={'primary'} type="email" name={'email'} placeholder={'E-mail'}
                   value={email}
                   onChange={e => {
                     setEmail(e.target.value)
                   }}/>
            <input required className={'primary'} type="password" name={'password'} placeholder={'Password'}
                   value={password}
                   onChange={e => {
                     setPassword(e.target.value)
                   }}/>
            <input required className={'primary'} type="password" name={'confirm-password'} placeholder={'Confirm your password'}
                   value={passwordConfirm}
                   onChange={e => {
                     setPasswordConfirm(e.target.value)
                   }}/>
            <button className={'primary'}>Cadastrar</button>
          </form>
          <FormFooter beginingText='Ja possui conta?' linkText='Entrar' url='/'/>
        </FormCard>
      </div>

      <Footer/>
    </div>
  )
}

export default Sign;
