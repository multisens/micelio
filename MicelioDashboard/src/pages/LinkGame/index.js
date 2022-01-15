import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function LinkGame () {

    const history = useHistory();
    const params = useParams();

    const [gameLink, setGameLink] = useState('');
    const [newGameLink, setNewGameLink] = useState('');

    const [gameText, setGameText] = useState('');
    const [newGameText, setNewGameText] = useState('');

    const [buttonReturn, setButtonReturn] = useState(false);
    const [buttonContinue, setButtonContinue] = useState(false);

    useEffect(() => {
        getGameContent();
    }, [])
    
    const getGameContent = async () => {
        try {
            const termResponse = await Api.get(`/linkGame/${params.id}`);

            if(termResponse.data.game_link === null){
                setGameLink('');
                setGameText('');
            } else {
                setGameLink(termResponse.data.data);
                setNewGameLink(termResponse.data.data);

                setGameText(termResponse.data.data);
                setNewGameText(termResponse.data.data);
            }
            
            document.getElementById('gameLink').focus();

        } catch (e) {
            console.log(e.response.data)
            toast.error(`Não foi possível recuperar os dados do experimento.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    const saveGameContent = async event => {
        event.preventDefault();

        if(gameLink !== newGameLink){
            try {

                const response = await Api.post(`/linkGame/${params.id}`, {
                    txt_game_link: newGameLink
                })
        
                if(!response.data.ok) {
                    toast.error(`Não foi possível salvar o link do jogo, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
                }
        
                setGameLink(newGameLink);
        
            }catch (e) {
                console.log(e.response.data)
                toast.error(`Não foi possível salvar o link do jogo.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
            }
        }
        if(gameText !== newGameText){
            try {

                const response = await Api.post(`/linkGame/${params.id}`, {
                    txt_game_page: newGameText
                })
        
                if(!response.data.ok) {
                    toast.error(`Não foi possível salvar o texto do jogo, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
                }
        
                setGameText(newGameText);
        
            }catch (e) {
                console.log(e.response.data)
                toast.error(`Não foi possível salvar o texto do jogo.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
            }
        }
        if(buttonReturn){
            setButtonReturn(false);
            history.push(`/consentTerm/${params.id}`);
        }
        if(buttonContinue){
            setButtonContinue(false);
            history.push(`/nextPage`);
        }
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Criação de Experimento - Passo 2/2"/>
                <div className={'container'}>
                    <div>
                        <h2>
                            Criação da página do game.
                        </h2><br/><br/>
                        <div>
                            <form onSubmit={saveGameContent}>
                                <div className={'text-field'}>
                                    <input type={'text'} className={'primary'} id={'gameLink'} placeholder="Insira aqui o link do seu jogo..." value={gameLink}
                                           rows="20" cols="20" size="400"
                                           onChange={e => {setNewGameLink(e.target.value)}}
                                    />
                                    <br/><br/>
                                    <textarea className={'primary'} id={'gameText'} placeholder="Insira aqui o texto sobre seu jogo..." value={gameText}
                                              rows="20" cols="200" size="4000"
                                              onChange={e => {setNewGameText(e.target.value)}}
                                    />
                                </div><br/><br/>
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

export default LinkGame;