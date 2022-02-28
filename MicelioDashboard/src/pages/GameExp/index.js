import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function GameExp () {

    const history = useHistory();
    const params = useParams();

    const [btnReturn, setBtnReturn] = useState(false);
    const [btnContinue, setBtnContinue] = useState(false);

    const [gameLink, setGameLink] = useState('');
    const [gameText, setGameText] = useState('');

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
                setGameText(game.txt_game_page);
            }
        } catch (e) {
            toast.error(`Não foi possível recuperar os dados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    const workFlow = () => {
        if (btnReturn) {
            history.push(`/initialForm/${params.id}`);
        }
        if (btnContinue) {
            history.push(`/videoExp/${params.id}`);
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
                                    {gameLink + ' - ' + gameText}
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