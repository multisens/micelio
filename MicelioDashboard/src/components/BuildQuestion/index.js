import React from 'react';

import './style.css';

function BuildQuestion(props) {

  return (
    <div>
      <p>{props.question}</p><br/>
      <div>
        <input  type={'text'}
                className={'primary'} size={100} 
                placeholder={'Digite a pergunta...'} 
                defaultValue={props.text}
                onChange={(event)=>props.onChangeFunction(event.target.value, props.index)}
                />
      </div><br/><br/>
    </div>
  );
}

export default BuildQuestion;
