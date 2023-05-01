import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { useParams, useHistory } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function Form () {

    const history = useHistory();
    const params = useParams();

    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sessionGroup, setSessionGroup] = useState('');
    const [confirm, setConfirm] = useState('');
    const [consentTerm, setConsentTerm] = useState('');

    useEffect(() => {
        getConsentTerm();
      }, [])
    
    const getConsentTerm = async () => {
        try {
            const termResponse = await Api.get(`/form/${params.id}`);

            setConsentTerm(termResponse.data.data);
        } catch (e) {
            console.log(e.response.data)
        }
    }

    const beginForm = async event => {
        event.preventDefault();
        
        try {
            const userResponse = await Api.post(`/form/${params.id}`, {username, email, sessionGroup});

            if (userResponse.data.error === 'session_group_empty') {
                return toast.error(`Grupo de sessão não existe ou não cadastrado para este experimento.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
            }
            if(!userResponse.data.ok){
                toast.error(`E-mail já cadastrado no experimento.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
            }

            history.push(`/initialForm/${params.id}`, {params: userResponse.data.participant_id});
        } catch (e) {
            console.log(e.response.data)
            toast.error(`Algo deu errado, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Termo de Consentimento Livre e Esclarecido"/>
                <div className={'container'}>
                    <div>
                        <div className="consent-term">
                            <ReactMarkdown>
                                {consentTerm}
                            </ReactMarkdown>
                        </div>
                        <br/><br/>
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
                                    <input className={'primary'} type="text" name={'sessionGroup'} placeholder={'Seu grupo de sessão, deixe vazio se não foi informado'} value={sessionGroup}
                                        onChange={e => {
                                            setSessionGroup(e.target.value)
                                        }}/>
                                </div><br/><br/>
                                <div className={'confirm-button'} id={'parent'}>
                                        <input required type="checkbox" name={'confirm'} value={confirm} onChange={e => {setConfirm(e.target.value)}}/>
                                        <div className={'child'}>Declaro ter compreendido como será minha participação e manifesto meu livre consentimento em participar.</div>
                                </div>
                                <br/><br/>
                                <button className={'primary'}>Confirmar</button>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    );

};

export default Form;