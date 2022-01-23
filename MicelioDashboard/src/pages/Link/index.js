import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function Link () {

    const history = useHistory();
    const params = useParams();

    const [selected, setSelectedValue] = useState('G');

    const [gameLink, setGameLink] = useState('');
    const [newGameLink, setNewGameLink] = useState('');

    const [gameText, setGameText] = useState('');
    const [newGameText, setNewGameText] = useState('');

    const [videoLink, setVideoLink] = useState('');
    const [newVideoLink, setNewVideoLink] = useState('');

    const [videoText, setVideoText] = useState('');
    const [newVideoText, setNewVideoText] = useState('');

    useEffect(() => {
        loadPage('G');
        getContent();
    }, [])
    
    const getContent = async () => {
        try {
            const dataResponse = await Api.get(`/link/${params.id}`);

            const game = dataResponse.data.game;

            if(!dataResponse.data.game){
                setGameLink('');
                setGameText('');
            } else {
                setGameLink(game.txt_game_link);
                setNewGameLink(game.txt_game_link);
                setGameText(game.txt_game_page);
                setNewGameText(game.txt_game_page);
            }

            const video = dataResponse.data.video;

            if(!dataResponse.data.video){
                setVideoLink('');
                setVideoText('');
            } else {
                setVideoLink(video.txt_video_link);
                setNewVideoLink(video.txt_video_link);
                setVideoText(video.txt_video_page);
                setNewVideoText(video.txt_video_page);
            }
        } catch (e) {
            toast.error(`Não foi possível recuperar os dados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    const saveContent = async (link, text) => {
        try {
            const response = await Api.post(`/link/${params.id}`, {
                page: selected,
                link,
                text
            })
            
            if(!response.data.ok) {
                toast.error(`Não foi possível salvar os dados informados, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
            }
        }catch (e) {
                console.log(e.response.data)
                toast.error(`Não foi possível salvar os dados informados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    const loadPage = async (e) => {
        if (e === 'G'){
            document.getElementById('game-page').style.display = '';
            document.getElementById('video-page').style.display = 'none';
        } else {
            document.getElementById('game-page').style.display = 'none';
            document.getElementById('video-page').style.display = '';
        }
        setSelectedValue(e);
        if(gameLink !== newGameLink || gameText !== newGameText){
            saveContent(newGameLink, newGameText);

            setGameLink(newGameLink);
            setGameText(newGameText);
        }
        if(videoLink !== newVideoLink || videoText !== newVideoText){
            saveContent(newVideoLink, newVideoText);

            setVideoLink(newVideoLink);
            setVideoText(newVideoText);
        }
    }

    const clickedButton = async (button) => {
        if(gameLink !== newGameLink || gameText !== newGameText){
            saveContent(newGameLink, newGameText);

            setGameLink(newGameLink);
            setGameText(newGameText);
        }
        if(videoLink !== newVideoLink || videoText !== newVideoText){
            saveContent(newVideoLink, newVideoText);

            setVideoLink(newVideoLink);
            setVideoText(newVideoText);
        }
        if (button === 'R') {
            history.push(`/consentTerm/${params.id}`);
        } else {
            history.push(`/quiz/${params.id}`);
        }
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Criação de Experimento - Passo 2/3"/>
                <div className={'container'}>
                    <div>
                        <h2>
                            Cria&ccedil;&atilde;o das p&aacute;ginas de informa&ccedil;&otilde;es do Jogo e da V&iacute;deo-Aula.
                        </h2><br/>
                        <div>
                            <form name={'form01'} onSubmit={saveContent}>
                                <div className={'radio-input'} id={'parent'}>
                                    <input type="radio" name={'page'} id={'gamePage'} value={'G'} checked={selected === 'G'} onChange={e => {loadPage(e.target.value)}}/>
                                    <div className={'child'}>Jogo</div>
                                </div><br/>
                                <div className={'radio-input'} id={'parent'}>
                                    <input type="radio" name={'page'} id={'videoPage'} value={'V'} checked={selected === 'V'} onChange={e => {loadPage(e.target.value)}}/>
                                    <div className={'child'}>V&iacute;deo-Aula</div>
                                </div><br/>
                                <div className={'game-page'} id={'game-page'}>
                                    <input type={'text'} className={'primary'} id={'gameLink'} placeholder="Insira aqui o link do seu jogo..." value={newGameLink}
                                           rows="20" cols="20" size="400"
                                           onChange={e => {setNewGameLink(e.target.value)}}
                                    />
                                    <br/><br/>
                                    <textarea className={'primary'} id={'gameText'} placeholder="Insira aqui o texto sobre seu jogo..." value={newGameText}
                                              rows="20" cols="200" size="4000"
                                              onChange={e => {setNewGameText(e.target.value)}}
                                    />
                                </div>
                                <div className={'video-page'} id={'video-page'}>
                                    <input type={'text'} className={'primary'} id={'videoLink'} placeholder="Insira aqui o link da vídeo-aula..." value={newVideoLink}
                                           rows="20" cols="20" size="400"
                                           onChange={e => {setNewVideoLink(e.target.value)}}
                                    />
                                    <br/><br/>
                                    <textarea className={'primary'} id={'videoText'} placeholder="Insira aqui as informações para a vídeo-aula..." value={newVideoText}
                                              rows="20" cols="200" size="4000"
                                              onChange={e => {setNewVideoText(e.target.value)}}
                                    />
                                </div><br/>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className={'b-return'}><button className={'primary'} onClick={() => {clickedButton('R')}}>Retornar</button></td>
                                            <td className={'b-continue'}><button className={'primary'} onClick={() => {clickedButton('C')}}>Seguir</button></td>
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

export default Link;