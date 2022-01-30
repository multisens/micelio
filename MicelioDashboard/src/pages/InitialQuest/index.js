import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { AiOutlinePlusCircle, AiFillCloseCircle } from 'react-icons/ai'
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CreateQuestion from '../../components/CreateQuestion';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function InitialQuest () {

    const history = useHistory();
    const params = useParams();

    const [btnReturn, setBtnReturn] = useState(false);
    const [btnContinue, setBtnContinue] = useState(false)

    const [lastIndex, setLastIndex] = useState();

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        getContent();
    }, [])
    
    const getContent = async () => {
        try {
            const questionData = await Api.get(`/initialQuest/${params.id}`);
            if (true) {
                setQuestions(['Maça', 'Banana', 'Pera']);
            } else {
                setQuestions(questionData);
            }
        } catch (e) {
            toast.error(`Não foi possível recuperar os dados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    const saveContent = async event => {
        event.preventDefault();

        try {
            let response;
            questions.map((question, index) => (
                    response = Api.post(`/initialQuest/${params.id}`, {
                        question,
                        order: index
                    })
            ))
            if(!response.data.ok) {
                toast.error(`Não foi possível salvar os dados informados, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
            }

        }catch (e) {
                toast.error(`Não foi possível salvar os dados informados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }

        if (btnReturn) {
            history.push(`/videoLink/${params.id}`);
        }
        if (btnContinue) {
            history.push(`/initialQuest/${params.id}`);
        }
    }

    const addQuestion = async () => {
        setQuestions([...questions, '']);
    }

    const changeQuestion = (keyboardEvent) => {
        const questionText = keyboardEvent.target.value;
        setQuestions([...questions, questionText]);
    }

    const removeQuestion = async () => {
        setQuestions(questions.slice(0, -1));
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Criação de Experimento - Passo 4/6"/>
                <div className={'container'}>
                    <div>
                        <h2>
                            Cria&ccedil;&atilde;o do question&aacute;rio inicial.
                        </h2><br/>
                        <div>
                            <form name={'form01'} onSubmit={saveContent}>
                                <div>
                                    {questions.map((question, index) => {
                                        return (
                                            <CreateQuestion key={index}
                                                            id={index}
                                                            text={question}
                                                            onChange={changeQuestion}
                                            />
                                        );
                                    })}
                                    <div id={'parent'} className={'buttons'}>
                                        <AiOutlinePlusCircle className={'child-add'} size={35} onClick={addQuestion}/>
                                        <AiFillCloseCircle className={'child-remove'} size={35} onClick={removeQuestion}/>
                                    </div><br/><br/>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className={'b-return'}><button className={'primary'} onClick={() => {setBtnReturn(true)}}>Retornar</button></td>
                                                <td className={'b-continue'}><button className={'primary'} onClick={() => {setBtnContinue(true)}}>Seguir</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    );
};

export default InitialQuest;