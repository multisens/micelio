import React from 'react';
import ReactMarkdown from 'react-markdown'

import './style.css';

function BuildQuestion(props) {

  return (
    <div>
      <p><ReactMarkdown>{props.question}</ReactMarkdown></p><br/>
      <div>
        <input  type={'text'}
                className={'primary'} size={100} 
                placeholder={'Digite sua resposta...'} 
                defaultValue={props.text}
                onChange={(event)=>props.onChangeFunction(event.target.value, props.index)}
                />
      </div><br/><br/>
    </div>
  );
}

export default BuildQuestion;
