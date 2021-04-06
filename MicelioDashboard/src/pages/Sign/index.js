import React from 'react';
import './style.css';

import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import FormCard from '../../Components/FormCard';
import FormFooter from '../../Components/FormFooter';

function Sign() {
	return (
		<div className={'content-body'}>
			<Header title="Micelio"/>

			<div className={'container'}>
				<FormCard title="Cadastre-se">
					<input className={'primary'} type="text" name={'username'} placeholder={'Username'} />
					<input className={'primary'} type="password" name={'password'} placeholder={'Password'} />
					<input className={'primary'} type="password" name={'confirm-password'} placeholder={'Confirm your password'} />
					<button className={'primary'}>Cadastrar</button>
					<FormFooter beginingText='Ja possui conta?' linkText='Entrar' url='/'/>
				</FormCard>
			</div>

			<Footer />
		</div>
	)
}

export default Sign;
