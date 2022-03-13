import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function VideoLink () {

    const history = useHistory();
    const params = useParams();

    const [btnReturn, setBtnReturn] = useState(false);
    const [btnContinue, setBtnContinue] = useState(false);

    const [videoLink, setVideoLink] = useState('');
    const [newVideoLink, setNewVideoLink] = useState('');

    const [videoText, setVideoText] = useState('');
    const [newVideoText, setNewVideoText] = useState('');

    useEffect(() => {
        getVideoLink();
    }, [])
    
    const getVideoLink = async () => {
        try {
            const dataResponse = await Api.get(`/videoLink/${params.id}`);

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

    const saveContent = async event => {
        event.preventDefault();

        if(videoLink !== newVideoLink || videoText !== newVideoText){
            try {
                const response = await Api.post(`/videoLink/${params.id}`, {
                    newVideoLink,
                    newVideoText
                })

                setVideoLink(newVideoLink);
                setVideoText(newVideoText);
                
                if(!response.data.ok) {
                    toast.error(`Não foi possível salvar os dados informados, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
                }
            }catch (e) {
                    toast.error(`Não foi possível salvar os dados informados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
            }
        }

        if (btnReturn) {
            history.push(`/gameLink/${params.id}`);
        }
        if (btnContinue) {
            history.push(`/initialQuest/${params.id}`);
        }
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Criação de Experimento - Passo 3/6"/>
                <div className={'container'}>
                    <div>
                        <h2>
                            Cria&ccedil;&atilde;o da p&aacute;gina de informa&ccedil;&otilde;es da Videoaula.
                        </h2><br/>
                        <div>
                            <form name={'form01'} onSubmit={saveContent}>
                                <div className={'video-page'} id={'video-page'}>
                                    <input type={'text'} className={'primary'} id={'videoLink'} size={100}
                                           placeholder="Insira aqui o link da vídeo-aula..." value={newVideoLink}
                                           onChange={e => {setNewVideoLink(e.target.value)}}
                                    />
                                    <br/><br/>
                                    <textarea className={'primary'} id={'videoText'} rows={15} cols={100} size={4000}
                                              placeholder="Insira aqui as informações para a vídeo-aula..." value={newVideoText}
                                              onChange={e => {setNewVideoText(e.target.value)}}
                                    />
                                </div>
                                <div>Utilize o coringa [LINK] para posicionar o lugar onde o link deve aparecer no texto.</div>
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

export default VideoLink;