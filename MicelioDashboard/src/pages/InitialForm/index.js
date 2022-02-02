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

function InitialForm () {

    const history = useHistory();
    const params = useParams();

    const [btnReturn, setBtnReturn] = useState(false);
    const [btnContinue, setBtnContinue] = useState(false)

    const [questionList, setQuestionList] = useState([]);

    useEffect(() => {
        Api.get(`/initialForm/${params.id}`).then(response => {
            const questions = response.data;
            if (questions.length < 1) {
                setQuestionList(['']);
            } else {
                setQuestionList(response.data);
            }
        });
    }, [params.id])

    const saveContent = async event => {
        event.preventDefault();

        try {
            for (let i=0;i<questionList.length;i++) {
                const response = await Api.post(`/initialForm/${params.id}`, {
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
            history.push(`/consentTerm/${params.id}`);
        }
        if (btnContinue) {
            history.push(`/gameLink/${params.id}`);
        }
    }

    const changeQuestion = (value, index) => {   
        let newArrayQuestion = questionList;
        newArrayQuestion[index] = value;
        setQuestionList(newArrayQuestion);
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
                                    {questionList.map((question, index) => {
                                        return (
                                            <BuildQuestion key={index+questionList[index]}
                                                            index={index}
                                                            question={question}
                                                            text={question}
                                                            onChangeFunction={changeQuestion}
                                            />
                                        );
                                    })}
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

export default InitialForm;