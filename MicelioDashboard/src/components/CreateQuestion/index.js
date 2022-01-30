import React from 'react';

import './style.css';

function CreateQuestion(props) {
  return (
    <div id={'question_' + props.id}>
      <p>Quest&atilde;o {props.id + 1}</p><br/>
      <div>
        <input type={'text'} id={'input_' + props.id} className={'primary'} size={100} 
               placeholder={'Digite a pergunta...'} value={props.text}
               onChange={props.onChange} onClick={props.onClick}/>
      </div><br/><br/>
    </div>
  );
}

export default CreateQuestion;
