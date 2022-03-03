import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function VideoExp () {

    const history = useHistory();
    const params = useParams();
    const location = useLocation();

    const [btnReturn, setBtnReturn] = useState(false);
    const [btnContinue, setBtnContinue] = useState(false);

    const [videoLink, setVideoLink] = useState('');
    const [videoText, setVideoText] = useState('');

    const [partId, setPartId] = useState();
    const [groupId, setGroupId] = useState();

    useEffect(() => {
        setPartId(location.state.params.partId);
        setGroupId(location.state.params.groupId);
    }, [location.state.params])

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
                setVideoText(video.txt_video_page);
            }
        } catch (e) {
            toast.error(`Não foi possível recuperar os dados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    const workFlow = () => {
        if (btnReturn) {
            history.push(`/initialForm/${params.id}`, {params: partId});
        }
        if (btnContinue) {
            if(groupId === "1"){
                history.push(`/specForm/${params.id}`, {params: partId});
            } else if (groupId === "2") {
                history.push(`/gameExp/${params.id}`, {params: {partId, groupId}});
            } else {
                history.push(`/finalForm/${params.id}`, {params: partId});
            }
        }
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Acesso a videoaula"/>
                <div className={'container'}>
                    <div>
                        <div>
                            <form name={'form01'} onSubmit={workFlow}>
                                <div className={'video-page'} id={'video-page'}>
                                    {videoLink + ' - ' + videoText}
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

export default VideoExp;