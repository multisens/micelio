import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'

import './style.css';

function BuildQuestion(props) {

  const [selected, setSelected] = useState([]);

  const selectedUpdate = (value, index) => {
    setSelected(value);
    props.onChangeFunction(value, index);
  }

  return (
    <div>
      <p><ReactMarkdown>{props.question}</ReactMarkdown></p><br/>
      <div>
        {props.hasOption === 'D' ? 
          <input type={'text'}
                 className={'primary'} size={100} 
                 placeholder={'Digite sua resposta...'} 
                 defaultValue={props.text}
                 onChange={(event)=>props.onChangeFunction(event.target.value, props.index)}
          />
        : props.options.map((option) => {
          return(
            <div className={'option'}>
              <input type={'radio'}
                     className={'option-text'}
                     value={option}
                     checked={selected === props.text}
                     onClick={(event)=>selectedUpdate(event.target.value, props.index)}
              />{option}
            </div>
          );
        })
        }
      </div><br/><br/>
    </div>
  );
}

export default BuildQuestion;
