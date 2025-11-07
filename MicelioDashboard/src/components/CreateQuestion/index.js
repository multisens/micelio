import React from 'react';
import { AiFillCloseCircle, AiOutlineUpCircle, AiOutlineDownCircle } from 'react-icons/ai';

import CreateOptions from '../../components/CreateOptions';
import './style.css';

function CreateQuestion(props) {

  return (
    <div>
      <p>Questão {props.index + 1}</p><br/>
      <div className='question'>
        <input type={'text'}
               id={'question'}
               className={'primary'} size={100} 
               placeholder={'Digite a pergunta...'} 
               defaultValue={props.text}
               onChange={(event)=>props.onChangeFunction(event.target.value, props.index)}
        />
        <div>
          {props.hasOption ? <AiOutlineUpCircle className={'include-options'} onClick={()=>props.onClickFuncOpt(props.index)}/>
                           : <AiOutlineDownCircle className={'include-options'} onClick={()=>props.onClickFuncOpt(props.index)}/>}
        </div>
        <div>
          <AiFillCloseCircle className={'remove-question'} onClick={()=>props.onClickFunction(props.index)}/>
        </div>
      </div>
      <div>
        {props.hasOption ? props.optionsList.map((option, index) => {
          return (
            <CreateOptions key={index}
                           index={index}
                           questIndex={props.index}
                           text={option}
                           onChangeFuncOpt={props.onChangeFuncOpt}
                           onClickAddOpt={props.onClickAddOpt}
                           onClickRemoveOpt={props.onClickRemoveOpt}
            />
          );
        })
        : ''}
      </div><br/><br/>
    </div>
  );
}

export default CreateQuestion;
