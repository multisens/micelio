import React, { useEffect, useState } from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Api from '../../services/Api';

import 'react-toastify/dist/ReactToastify.min.css';

function InitialQuest () {

    const history = useHistory();
    const params = useParams();

    const [btnReturn, setBtnReturn] = useState(false);
    const [btnContinue, setBtnContinue] = useState(false)

    const [selectedOpt, setSelectedOptValue] = useState([]);
    const [questAmount, setQuestAmount] = useState(1);

    const [question, setQuestion] = useState([]);
    const [optAmount, setOptAmount] = useState(0);

    useEffect(() => {
        getContent();
    }, [])
    
    const getContent = async (e) => {
        try {
            const questionData = await Api.get(`/initialQuest/${params.id}`);
            if (!questionData) {
                setQuestion(['']);
            } else {
                setQuestion(question);
            }
            questionsDisplay();
            setQuestAmount(1);
        } catch (e) {
            toast.error(`Não foi possível recuperar os dados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    const saveContent = async () => {
        try {
            for(let i = 0;i<questAmount;i++){
                const response = await Api.post(`/initialQuest/${params.id}`, {
                    question: question[i],
                    selectedOpt: selectedOpt[i],
                    order: i
                });
            
                if(!response.data.ok) {
                    toast.error(`Não foi possível salvar os dados informados, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
                }
            }
            if (btnReturn) {
                history.push(`/link/${params.id}`);
            }
            if (btnContinue) {
                history.push(`/initialQuest/${params.id}`);
            }
        }catch (e) {
                toast.error(`Não foi possível salvar os dados informados.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
        }
    }

    const addQuestion = async () => {

        question[questAmount] = '';
        let output_HTML = '';
        output_HTML += '<div>';
        output_HTML += '<input type="text" className="primary" id="question_'+questAmount+'" placeholder="Digite aqui a pergunta..." value="' + question[questAmount] + '" rows="20" cols="20" size="400"/>'
        output_HTML += '</div></br>';
        output_HTML += '<div id="parent">';
        output_HTML += '<input type="radio" name="option_'+questAmount+'" id="essay_' + questAmount +'" value="D" checked/>';
        output_HTML += '<span className="child">Quest&atilde;o dissertativa</span>';
        output_HTML += '<input type="radio" name="option_'+questAmount+'" id="optative_' + questAmount + '" value="O"/>';
        output_HTML += '<span className="child">Quest&atilde;o optativa</span>';
        output_HTML += '<span className="child" id="display-options_'+questAmount+'">';
        output_HTML += '<input type="text" class="opt-amount" id="opt-amount_' + questAmount + '" maxLength="1" value="' + optAmount + '"/>';
        output_HTML += '<span>&nbsp;&nbsp;N&uacute;mero de op&ccedil;&otilde;es</span>';
        output_HTML += '</span><br/>';
        output_HTML += '</div><br/>';
        document.getElementById('questions').innerHTML += output_HTML;

        loadOptions('D', questAmount);
        document.getElementById('question_'+questAmount).addEventListener('change', e => {questionInsert(e.target.value)});
        document.getElementById('essay_'+questAmount).addEventListener('change', e => {loadOptions(e.target.value, questAmount)});
        document.getElementById('optative_'+questAmount).addEventListener('change', e => {loadOptions(e.target.value, questAmount)});
        document.getElementById('opt-amount_'+questAmount).addEventListener('change', e => {setOptAmount(e.target.value)});
        setQuestAmount(questAmount+1);
    }

    const loadOptions = async (e, i) => {

        if (e === 'D') {
            document.getElementById('display-options_'+i).style.display = 'none';
            document.getElementById('essay_'+i).checked = true;
            document.getElementById('optative_'+i).checked = false;
            setSelectedOptValue(selectedOpt => [selectedOpt, e]);
        } else {
            document.getElementById('display-options_'+i).style.display = '';
            document.getElementById('essay_'+i).checked = false;
            document.getElementById('optative_'+i).checked = true;
            setSelectedOptValue(selectedOpt => [selectedOpt, e]);
        }
    }

    const questionsDisplay = async () => {
        let output_HTML = '';

        for (let i = 0;i<questAmount;i++){
            question[i] = '';
            output_HTML += '<div>';
            output_HTML += '<input type="text" className="primary" id="question_'+i+'" placeholder="Digite aqui a pergunta..." value="' + question[i] + '" rows="20" cols="20" size="400"/>'
            output_HTML += '</div></br>';
            output_HTML += '<div id="parent">';
            output_HTML += '<input type="radio" name="option_'+i+'" id="essay_' + i +'" value="D" checked/>';
            output_HTML += '<span className="child">Quest&atilde;o dissertativa</span>';
            output_HTML += '<input type="radio" name="option_'+i+'" id="optative_' + i + '" value="O"/>';
            output_HTML += '<span className="child">Quest&atilde;o optativa</span>';
            output_HTML += '<span className="child" id="display-options_'+i+'">';
            output_HTML += '<input type="text" class="opt-amount" id="opt-amount_' + i + '" maxLength="1" value="' + optAmount + '"/>';
            output_HTML += '<span>&nbsp;&nbsp;N&uacute;mero de op&ccedil;&otilde;es</span>';
            output_HTML += '</span><br/>';
            output_HTML += '</div><br/>';
            document.getElementById('questions').innerHTML += output_HTML;
        }

        for (let i=0;i<questAmount;i++){
            loadOptions('D', i);
            document.getElementById('question_'+i).addEventListener('change', e => {questionInsert(e.target.value)});
            document.getElementById('essay_'+i).addEventListener('change', e => {loadOptions(e.target.value, i)});
            document.getElementById('optative_'+i).addEventListener('change', e => {loadOptions(e.target.value, i)});
            document.getElementById('opt-amount_'+i).addEventListener('change', e => {setOptAmount(e.target.value)});
        }
    }

    const questionInsert = async (e) => {
        setQuestion(question => [question, e]);
    }

    return (
        <>
            <ToastContainer />
            <div className={'content-body'}>
                <Header title="Criação de Experimento - Passo 3/3"/>
                <div className={'container'}>
                    <div>
                        <h2>
                            Cria&ccedil;&atilde;o do question&aacute;rio inicial.
                        </h2><br/>
                        <div>
                            <form name={'form01'} onSubmit={saveContent}>
                                <div>
                                    <div className={'questions-begin'}>
                                        Quest&otilde;es:
                                    </div><br/>
                                    <div id={'questions'}>
                                        <div id={'options'}></div>
                                    </div><br/>
                                    <div className={'add-button'}>
                                        <div className={'child-add'}><AiOutlinePlusCircle size={35} onClick={addQuestion}/></div>
                                    </div><br/><br/><br/>
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

export default InitialQuest;