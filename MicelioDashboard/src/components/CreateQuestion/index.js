import React from 'react';

import './style.css';

function CreateQuestion(props) {
  return (
    <div id={props.id}>
      <p>Quest&atilde;o {props.id + 1}</p><br/>
      <div>
        <input type={'text'} className={'primary'} size={100} placeholder={'Digite a pergunta...'} value={props.text} onKeyUp={props.onChange}/>
      </div><br/><br/>
    </div>
  );
}

export default CreateQuestion;
