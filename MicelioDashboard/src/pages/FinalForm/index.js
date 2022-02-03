import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BuildQuestion from '../../components/BuildQuestion';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function FinalForm () {

    const history = useHistory();
    const params = useParams();

    const [btnReturn, setBtnReturn] = useState(false);
    const [btnContinue, setBtnContinue] = useState(false)

    const [questionList, setQuestionList] = useState([]);

    const [answerList, setAnswerList] = useState([]);

    useEffect(() => {
        Api.get(`/finalForm/${params.id}`).then(response => {
            const questions = response.data;
            if (questions.length < 1) {
                setQuestionList(['']);
                setAnswerList(['']);
            } else {
                setQuestionList(response.data);
                setAnswerList(['']);
            }
        });
    }, [params.id])

    const saveContent = async event => {
        event.preventDefault();

        try {
            for (let i=0;i<questionList.length;i++) {
                const response = await Api.post(`/finalForm/${params.id}`, {
                    question: questionList[i],
                    order: i
                })

                if(!response.data.ok){
                    toast.error(`Não foi possível salvar os dados informados. Tente novamente`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
                }
            }


        }catch (e) {
            toast.error(`Não foi possível salvar os dados informados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }

        if (btnReturn) {
            history.push(`/specForm/${params.id}`);
        }
        if (btnContinue) {
            history.push(`/finalForm/${params.id}`);
        }
    }

    const changeAnswer = (value, index) => {   
        let newArrayAnswer = answerList;
        newArrayAnswer[index] = value;
        setQuestionList(newArrayAnswer);
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Questionário Final"/>
                <div className={'container'}>
                    <div>
                        <div>
                            <form name={'form01'} onSubmit={saveContent}>
                                <div>
                                    {questionList.map((question, index) => {
                                        return (
                                            <BuildQuestion key={index+questionList[index]}
                                                            index={index}
                                                            question={question}
                                                            text={answerList[index]}
                                                            onChangeFunction={changeAnswer}
                                            />
                                        );
                                    })}
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className={'b-return'}><button className={'primary'} onClick={() => {setBtnReturn(true)}}>Retornar</button></td>
                                                <td className={'b-continue'}><button className={'primary'} onClick={() => {setBtnContinue(true)}}>Concluir</button></td>
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

export default FinalForm;