import React from 'react';

import './style.css';

function AnswerGroupsContainer({title, children}) {

	return (
        <div className={'answerGroupsList'}>
            <div className={'answerGroupsList-header'}>
                <h2>{title}</h2>
            </div>
            <ul>
                {children}
            </ul>
        </div>
	)
}

export default AnswerGroupsContainer;
