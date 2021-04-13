import React from 'react';
import {useHistory} from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FormCard from '../../components/FormCard';
import FormFooter from '../../components/FormFooter';

function Index() {
	const history = useHistory();

	const doLogin = () => {
		history.push('/home');
	}

	return (
		<div className={'content-body'}>
			<Header title="Micelio"/>

			<div className={'container'}>
				<FormCard title="Faça Login">
					<input className={'primary'} type="text" name={'username'} placeholder={'Username'} />
					<input className={'primary'} type="password" name={'password'} placeholder={'Password'} />
					<button className={'primary'} onClick={doLogin}>Entrar</button>
					<FormFooter beginingText='Não possui conta?' linkText='Cadastre-se' url='/sign'/>
				</FormCard>
			</div>

			<Footer />
		</div>
	)
}

export default Index;
