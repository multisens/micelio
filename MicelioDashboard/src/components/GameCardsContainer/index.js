import React from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai'

import './style.css';

function GameCards({title, children, onClickAdd}) {

	return (
        <div className={'gamecards'}>
            <div className={'gamecards-header'}>
                <h2>{title}</h2>
                <AiOutlinePlusCircle size={25} onClick={onClickAdd} />
            </div>
            <ul>
                {children}
            </ul>
        </div>
	)
}

export default GameCards;
