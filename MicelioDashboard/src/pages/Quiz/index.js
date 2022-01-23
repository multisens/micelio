import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function Quiz () {

    const history = useHistory();
    const params = useParams();

    const [selected, setSelectedValue] = useState('I');

    const [question, setNewQuestion] = useState('');

    useEffect(() => {
        getContent();
    }, [])
    
    const getContent = async () => {
        try {
            const dataResponse = await Api.get(`/quiz/${params.id}`);
        } catch (e) {
            toast.error(`Não foi possível recuperar os dados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    const saveContent = async (link, text) => {
        try {
            const response = await Api.post(`/quiz/${params.id}`)
            
            if(!response.data.ok) {
                toast.error(`Não foi possível salvar os dados informados, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
            }
        }catch (e) {
                console.log(e.response.data)
                toast.error(`Não foi possível salvar os dados informados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Criação de Experimento - Passo 3/3"/>
                <div className={'container'}>
                    <div>
                        <h2>
                            Cria&ccedil;&atilde;o dos question&aacute;rios.
                        </h2><br/>
                        <div>
                            <form name={'form01'} onSubmit={saveContent}>
                                <div className={'radio-input'} id={'parent'}>
                                    <input type="radio" name={'page'} id={'gamePage'} value={'I'} checked={selected === 'I'} onChange={e => {setSelectedValue(e.target.value)}}/>
                                    <div className={'child'}>Question&aacute;rio Inicial</div>
                                    <input type="radio" name={'page'} id={'gamePage'} value={'E'} checked={selected === 'E'} onChange={e => {setSelectedValue(e.target.value)}}/>
                                    <div className={'child'}>Question&aacute;rio Especial</div>
                                    <input type="radio" name={'page'} id={'gamePage'} value={'F'} checked={selected === 'F'} onChange={e => {setSelectedValue(e.target.value)}}/>
                                    <div className={'child'}>Question&aacute;rio Final</div>
                                </div><br/>
                                <div>
                                    <div>
                                        <input type={'text'} className={'primary'} id={'gameLink'} placeholder="Digite aqui a pergunta..." value={setNewQuestion}
                                        rows="20" cols="20" size="400" onChange={e => {setNewQuestion(e.target.value)}}/>
                                    </div><br/>
                                </div>
                                <div id={'parent'}>
                                        <input type="radio" name={'page'} id={'gamePage'} value={'I'} checked={selected === 'I'} onChange={e => {setSelectedValue(e.target.value)}}/>
                                        <div className={'child'}>Quest&atilde;o dissertativa</div>
                                        <input type="radio" name={'page'} id={'gamePage'} value={'I'} checked={selected === 'I'} onChange={e => {setSelectedValue(e.target.value)}}/>
                                        <div className={'child'}>Quest&atilde;o optativa</div>
                                </div><br/>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className={'b-return'}><button className={'primary'} onClick={() => {history.push(`/link/${params.id}`)}}>Retornar</button></td>
                                            <td className={'b-continue'}><button className={'primary'} onClick={() => {history.push(`/experiment`)}}>Seguir</button></td>
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

export default Quiz;