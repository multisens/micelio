import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function GameLink () {

    const history = useHistory();
    const params = useParams();

    const [btnReturn, setBtnReturn] = useState(false);
    const [btnContinue, setBtnContinue] = useState(false);

    const [gameLink, setGameLink] = useState('');
    const [newGameLink, setNewGameLink] = useState('');

    const [gameText, setGameText] = useState('');
    const [newGameText, setNewGameText] = useState('');

    const [gameHasQuest, setGameHasQuest] = useState(false);
    const [gameHasForm, setGameHasForm] = useState('');

    useEffect(() => {
        getGameLink()
    }, [])
    
    const getGameLink = async () => {
        try {
            const dataResponse = await Api.get(`/gameLink/${params.id}`);

            const game = dataResponse.data.game;

            if(!dataResponse.data.game){
                setGameLink('');
                setGameText('');
            } else {
                setGameLink(game.txt_game_link);
                setNewGameLink(game.txt_game_link);
                setGameText(game.txt_game_page);
                setNewGameText(game.txt_game_page);
                if(game.has_game_form === 'S') {
                    setGameHasQuest(true);
                    setGameHasForm('S');
                } else {
                    setGameHasQuest(false);
                    setGameHasForm('N');
                }
            }
        } catch (e) {
            toast.error(`Não foi possível recuperar os dados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    const saveContent = async event => {
        event.preventDefault();

        let newGameHasForm;
        if(gameHasQuest){
            newGameHasForm = 'S';
        } else {
            newGameHasForm = 'N';
        }

        if (gameLink !== newGameLink || gameText !== newGameText || gameHasForm !== newGameHasForm)
        {
            try {
                const response = await Api.post(`/gameLink/${params.id}`, {
                    newGameLink,
                    newGameText,
                    newGameHasForm
                })

                setGameLink(newGameLink);
                setGameText(newGameText);
                
                if(!response.data.ok) {
                    toast.error(`Não foi possível salvar os dados informados, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
                    return false;
                }
            
            }catch (e) {
                toast.error(`Não foi possível salvar os dados informados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
            }
        }

        if (btnReturn) {
            history.push(`/consentTerm/${params.id}`);
        }
        if (btnContinue) {
            if(gameHasQuest){
                history.push(`/gameQuest/${params.id}`);
            } else {
                history.push(`/videoLink/${params.id}`);
            }
        }
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Criação de Experimento - Passo 2/6"/>
                <div className={'container'}>
                    <div>
                        <h2>
                            Cria&ccedil;&atilde;o da p&aacute;gina de informa&ccedil;&otilde;es do Jogo.
                        </h2><br/>
                        <div>
                            <form name={'form01'} onSubmit={saveContent}>
                                <div className={'game-page'} id={'game-page'}>
                                    <input type={'text'} className={'primary'} id={'gameLink'} size={100}
                                           placeholder="Insira aqui o link do seu jogo..." value={newGameLink}
                                           onChange={e => {setNewGameLink(e.target.value)}}
                                    />
                                    <br/><br/>
                                    <textarea className={'primary'} id={'gameText'} rows={15} cols={100} size={4000}
                                              placeholder="Insira aqui o texto sobre seu jogo..." value={newGameText}
                                              onChange={e => {setNewGameText(e.target.value)}}
                                    />
                                </div>
                                <div>Utilize o coringa [LINK] para posicionar o lugar onde o link deve aparecer no texto.</div>
                                <br/><br/>
                                <div id={'parent'}>
                                    <div>Seu experimento terá um questionário específico sobre o jogo?</div><br/>
                                    <input type={'radio'} className={'child'} id={'game-spec-quest'} value={gameHasQuest}
                                           onClick={() => setGameHasQuest(!gameHasQuest)} checked={gameHasQuest}/>
                                    <div className={'child'} id={'radio-text'}>Sim</div>
                                    <input type={'radio'} className={'child'} id={'game-spec-quest'} value={gameHasQuest}
                                           onClick={() => setGameHasQuest(!gameHasQuest)} checked={!gameHasQuest}/>
                                    <div className={'child'} id={'radio-text'}>Não</div>
                                </div>
                                <br/><br/>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className={'b-return'}><button className={'primary'} onClick={() => {setBtnReturn(true)}}>Retornar</button></td>
                                            <td className={'b-continue'}><button className={'primary'} onClick={() => {setBtnContinue(true)}}>Seguir</button></td>
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

export default GameLink;