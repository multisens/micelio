import React from 'react';
import { AiOutlinePlusCircle, AiFillCloseCircle } from 'react-icons/ai';

import './style.css';

function CreateOption(props) {

  return (
    <div className='option'>
      {String.fromCharCode(props.index + 1 + 64)})&nbsp;
      <div>
        <input type={'text'}
               id={'option'}
               className={'option'} size={85} 
               placeholder={'Digite a pergunta...'} 
               defaultValue={props.text}
               onChange={event=>props.onChangeFuncOpt(event.target.value, props.questIndex, props.index)}
        />
      </div>&nbsp;
      <div>
          <AiOutlinePlusCircle className={'add-option'} onClick={()=>props.onClickAddOpt(props.questIndex)}/>
          <AiFillCloseCircle className={'remove-option'} onClick={()=>props.onClickRemoveOpt(props.questIndex, props.index)}/>
        </div>
    </div>
  );
}

export default CreateOption;
