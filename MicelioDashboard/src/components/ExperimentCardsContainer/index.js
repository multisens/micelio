import React from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai'

import './style.css';

function ExperimentCards({title, children, onClickAdd, onSearch}) {

	return (
        <div className={'experimentcards'}>
            <div className={'experimentcards-header'}>
              <div>
                <h2>{title}</h2>
                <AiOutlinePlusCircle size={25} onClick={onClickAdd} />
              </div>
              <div>
                <input type={'text'} className={'primary'} placeholder={'Busque um experimento'} onKeyUp={onSearch}/>
              </div>
            </div>
            <ul>
                {children}
            </ul>
        </div>
	)
}

export default ExperimentCards;
