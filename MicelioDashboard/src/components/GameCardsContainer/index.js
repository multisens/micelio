import React from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai'

import './style.css';

function GameCards({title, children, onClickAdd, onSearch}) {

	return (
        <div className={'gamecards'}>
            <div className={'gamecards-header'}>
              <div>
                <h2>{title}</h2>
                <AiOutlinePlusCircle size={25} onClick={onClickAdd} />
              </div>
              <div>
                <input type={'text'} className={'primary'} placeholder={'Busque um jogo'} onKeyUp={onSearch}/>
              </div>
            </div>
            <ul>
                {children}
            </ul>
        </div>
	)
}

export default GameCards;
