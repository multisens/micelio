import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function GameExp () {

    const history = useHistory();
    const params = useParams();
    const location = useLocation();

    const [btnReturn, setBtnReturn] = useState(false);
    const [btnContinue, setBtnContinue] = useState(false);

    const [gameLink, setGameLink] = useState('');
    const [gameText, setGameText] = useState('');
    const [hasGameForm, setHasGameForm] = useState('');

    const [partId, setPartId] = useState();
    const [groupId, setGroupId] = useState();

    useEffect(() => {
        setPartId(location.state.params.partId);
        setGroupId(location.state.params.groupId);
    }, [location.state.params])

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
                setHasGameForm('');
            } else {
                setGameLink(game.txt_game_link);
                setGameText(game.txt_game_page);
                setHasGameForm(game.has_game_form);
            }
        } catch (e) {
            toast.error(`Não foi possível recuperar os dados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    const workFlow = () => {
        if (btnReturn) {
            if (groupId === "4") {
                history.push(`/initialForm/${params.id}`, {params: partId});
            } else {
                history.push(`/videoExp/${params.id}`, {params: {partId, groupId}});
            }
        }
        if (btnContinue) {
            if(hasGameForm === 'S') {
                history.push(`/gameForm/${params.id}`, {params: partId});
            } else {
                history.push(`/finalForm/${params.id}`, {params: partId});
            }
        }
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Acesso ao jogo"/>
                <div className={'container'}>
                    <div>
                        <div>
                            <form name={'form01'} onSubmit={workFlow}>
                                <div className={'game-page'} id={'game-page'}>
                                    <ReactMarkdown>
                                        {gameText.replace('[LINK]', gameLink)}
                                    </ReactMarkdown>
                                </div><br/><br/>
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

export default GameExp;