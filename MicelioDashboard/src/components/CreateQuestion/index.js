import React from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

import './style.css';

function CreateQuestion(props) {

  return (
    <div>
      <p>Questão {props.index + 1}</p><br/>
      <div>
        <input type={'text'}
               id={'question'}
               className={'primary'} size={100} 
               placeholder={'Digite a pergunta...'} 
               defaultValue={props.text}
               onChange={(event)=>props.onChangeFunction(event.target.value, props.index)}
        />&nbsp;&nbsp;&nbsp;&nbsp;
        <AiFillCloseCircle className={'remove-question'} onClick={()=>props.onClickFunction(props.index)}/>
      </div><br/><br/>
    </div>
  );
}

export default CreateQuestion;
