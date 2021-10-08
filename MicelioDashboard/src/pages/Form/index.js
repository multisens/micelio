import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Api from '../../services/Api';

function Form () {

    const params = useParams();

    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [confirm, setConfirm] = useState('');
    const [consentTerm, setConsentTerm] = useState(null);

    useEffect(() => {
        getConsentTerm();
      }, [])
    
    const getConsentTerm = async () => {
        try {
            const termResponse = await Api.get(`/form/${params.id}`);

            const {data} = termResponse.data.data;

            setConsentTerm(data);
        } catch (e) {
            //
        }
    }

    const beginForm = async () => {
        try {
            const userResponse = await Api.post('/form', {username, email});
            if(userResponse.status !== 201){
                alert('Algo deu errado ao tentar guardar os dados informados!');
                return;
            }
        } catch (e) {
            // Erro
        }
    }

    return (
        <div className={'content-body'}>
            <Header title="Termo de Consentimento Livre e Esclarecido"/>
            <div className={'container'}>
                <div>
                    <div>
                        {consentTerm.txt_consent_form}
                    </div>
                    <div>
                        <form onSubmit={beginForm}>
                            <div className={'text-field'}>
                                <input required className={'primary'} type="text" name={'name'} placeholder={'Seu nome'} value={username}
                                    onChange={e => {
                                        setName(e.target.value)
                                    }}/>
                                <input required className={'primary'} type="email" name={'email'} placeholder={'Seu e-mail'} value={email}
                                    onChange={e => {
                                        setEmail(e.target.value)
                                    }}/>
                            </div><br/><br/>
                            <div className={'confirm-button'}>
                                <input required className={'primary'} type="checkbox" name={'confirm'} value={confirm} 
                                    onChange={e => {
                                        setConfirm(e.target.value)
                                    }}/> Declaro ter compreendido como será minha participação e manifesto meu livre consentimento em participar.<br/>
                            </div>
                            <br/><br/>
                            <button className={'primary'}>Continuar</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );

};

export default Form;