import React from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai'

import './style.css';

function GameCards(props) {

	return (
        <div className={'gamecards'}>
            <div className={'gamecards-header'}>
                <h2>{props.title}</h2>
                <AiOutlinePlusCircle size={25} />
            </div>
            <ul>
                {props?.children}
            </ul>
        </div>
	)
}

export default GameCards;
