import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CreateQuestion from '../../components/CreateQuestion';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function FinalQuest () {

    const history = useHistory();
    const params = useParams();

    const [btnReturn, setBtnReturn] = useState(false);
    const [btnContinue, setBtnContinue] = useState(false)

    const [questionList, setQuestionList] = useState([]);

    let hasOption = false;

    useEffect(() => {
        Api.get(`/finalQuest/${params.id}`).then(response => {
            const questions = response.data;
            if (questions.length < 1) {
                setQuestionList([{txt_question: '', ind_type: 'D', options: ['']}]);
            } else {
                setQuestionList(response.data.questions);
            }
        });
    }, [params.id])

    const saveContent = async event => {
        event.preventDefault();

        try {
            for (let i=0;i<questionList.length;i++) {
                const response = await Api.post(`/finalQuest/${params.id}`, {
                    question: questionList[i].txt_question,
                    order: i,
                    length: questionList.length,
                    hasOption: questionList[i].ind_type,
                    options: questionList[i].options
                })

                if(!response.data.ok){
                    toast.error(`Não foi possível salvar os dados informados. Tente novamente`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
                }
            }
        }catch (e) {
            toast.error(`Não foi possível salvar os dados informados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }

        if (btnReturn) {
            history.push(`/specQuest/${params.id}`);
        }
        if (btnContinue) {
            history.push(`/experiment`, { saved: true} );
        }
    }

    const addQuestion = () => {
        setQuestionList([...questionList, {txt_question: '', ind_type: 'D', options: ['']}]);
    }

    const changeQuestion = (value, index) => {   
        let newArrayQuestion = questionList;
        newArrayQuestion[index].txt_question = value;
        setQuestionList(newArrayQuestion);
    }

    const removeQuestion = index => {
        if (questionList.length === 1) {
            setQuestionList(['']);
        } else {
            let newArrayQuestion = [];
            questionList.splice(index, 1);
            for (let i=0;i<questionList.length;i++) {
                newArrayQuestion[i] = questionList[i];
            }
            setQuestionList(newArrayQuestion); 
        }
    }

    const includeOptions = index => {
        let newArrayQuestion = questionList[index];
        if(newArrayQuestion.ind_type === 'D') {
            newArrayQuestion.ind_type = 'O';
        } else {
            newArrayQuestion.ind_type = 'D';
        }
        questionList.splice(index,1,newArrayQuestion);
        const questionAuxList = [];
        for (let i=0;i<questionList.length;i++) {
            questionAuxList[i] = questionList[i];
        }
        setQuestionList(questionAuxList);
    }

    const addOption = index => {
        let newArrayQuestion = questionList[index];
        newArrayQuestion.options.push('');
        questionList.splice(index,1,newArrayQuestion);
        const questionAuxList = [];
        for (let i=0;i<questionList.length;i++) {
            questionAuxList[i] = questionList[i];
        }
        setQuestionList(questionAuxList);
    }

    const changeOption = (value, questIndex, optionIndex) => {
        let newArrayQuestion = questionList;
        newArrayQuestion[questIndex].options[optionIndex] = value;
        setQuestionList(newArrayQuestion);
    }

    const removeOption = (questIndex, optionIndex) => {
        let newArrayQuestion = questionList[questIndex];
        if (newArrayQuestion.options.length > 1) {
            newArrayQuestion.options.splice(optionIndex, 1);
        } else {
            newArrayQuestion.options = [''];
        }
        questionList.splice(questIndex,1,newArrayQuestion);
        const questionAuxList = [];
        for (let i=0;i<questionList.length;i++) {
            questionAuxList[i] = questionList[i];
        }
        setQuestionList(questionAuxList);
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Criação de Experimento - Passo 6/6"/>
                <div className={'container'}>
                    <div>
                        <h2>
                            Cria&ccedil;&atilde;o do question&aacute;rio final.
                        </h2><br/>
                        <div>
                            <form name={'form01'} onSubmit={saveContent}>
                                <div>
                                    {questionList.map((question, index) => {
                                        if (question.ind_type === 'O') {
                                            hasOption = true;
                                        } else {
                                            hasOption = false;
                                        }
                                        return (
                                            <CreateQuestion key={index+questionList[index]}
                                                            index={index}
                                                            text={question.txt_question}
                                                            hasOption={hasOption}
                                                            optionsList={question.options}
                                                            onChangeFunction={changeQuestion}
                                                            onChangeFuncOpt={changeOption}
                                                            onClickFunction={removeQuestion}
                                                            onClickFuncOpt={includeOptions}
                                                            onClickAddOpt={addOption}
                                                            onClickRemoveOpt={removeOption}
                                            />
                                        );
                                    })}
                                    <div className={'buttons'}>
                                        <AiOutlinePlusCircle className={'child-add'} size={35} onClick={addQuestion}/>
                                    </div><br/><br/>
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

export default FinalQuest;