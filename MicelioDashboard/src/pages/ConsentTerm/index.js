import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function ConsentTerm () {

    const history = useHistory();
    const params = useParams();

    const [consentTerm, setConsentTerm] = useState('');
    const [newConsentTerm, setNewConsentTerm] = useState('');

    const [buttonReturn, setButtonReturn] = useState(false);
    const [buttonContinue, setButtonContinue] = useState(false);

    useEffect(() => {
        getConsentTerm();
    }, [])
    
    const getConsentTerm = async () => {
        try {
            const termResponse = await Api.get(`/consentTerm/${params.id}`);

            if(termResponse.data.data === null){
                setConsentTerm('');
            } else {
                setConsentTerm(termResponse.data.data);
                setNewConsentTerm(termResponse.data.data);
            }
            
            document.getElementById('consentTerm').focus();

        } catch (e) {
            console.log(e.response.data)
            toast.error(`Não foi possível recuperar o termo de consentimento.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    const saveNewConsentTerm = async event => {
        event.preventDefault();

        if(newConsentTerm !== consentTerm){
            try {

                const response = await Api.post(`/consentTerm/${params.id}`, {
                    txt_consent_term: newConsentTerm
                })
        
                if(!response.data.ok) {
                    toast.error(`Não foi possível salvar o termo de consentimento, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
                }
        
                setConsentTerm(newConsentTerm);
        
            }catch (e) {
                console.log(e.response.data)
                toast.error(`Não foi possível salvar o termo de consentimento.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
            }
        }
        if(buttonReturn){
            setButtonReturn(false);
            history.push(`/experiment`);
        }
        if(buttonContinue){
            setButtonContinue(false);
            history.push(`/gameLink/${params.id}`);
        }
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Criação de Experimento - Passo 1/6"/>
                <div className={'container'}>
                    <div>
                        <h2>
                            Digite no campo abaixo o termo de consentimento:
                        </h2><br/><br/>
                        <div>
                            <form onSubmit={saveNewConsentTerm}>
                                <div className={'text-field'}>
                                    <textarea className={'primary'} id={'consentTerm'} rows={15} cols={120} size={4000}
                                              placeholder=" Insira o texto aqui..." value={newConsentTerm}
                                              onChange={e => {setNewConsentTerm(e.target.value)}}
                                    />
                                </div>
                                <div><br/><br/>
                                    <a href="https://imgur.com/61HlYuW" target="blank">Clique aqui</a> para sintaxe de formatação do texto.
                                </div>
                                <br/><br/>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className={'b-return'}><button className={'primary'} onClick={() => {setButtonReturn(true)}}>Retornar</button></td>
                                            <td className={'b-continue'}><button className={'primary'} onClick={() => {setButtonContinue(true)}}>Seguir</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    );
};

export default ConsentTerm;