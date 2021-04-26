import React from 'react';
import './style.css';


const Hr = () => {
	return (
		<hr style={{
			color: '#dfdfdf',
			backgroundColor: '#dfdfdf',
			height: .5,
			borderColor: '#dfdfdf'
		}} />
	);
}

function SessionGroupList() {

	return (
		<div className={'grouplist'}>
            <div className={'grouplist-header'}>
                <h2>Grupos Criados</h2>
                <p>Grupos de sessão criados para os seus jogos.</p>
            </div>
            <ul>
                <li>
                    <h3>Control Harvest - SDKAJD-SNDKASDN-DKSAJDNAKJ</h3>
                    <Hr/>
                    <p><b>Status: </b>aberto</p>
                    <p><b>Criador: </b>Lucas</p>
                    <p><b>Sessões: </b>40</p>
                </li>
                <li>
                    <h3>Control Harvest - SDKAJD-SNDKASDN-DKSAJDNAKJ</h3>
                    <Hr/>
                    <p><b>Status: </b>aberto</p>
                    <p><b>Criador: </b>Lucas</p>
                    <p><b>Sessões: </b>40</p>
                </li>
            </ul>
        </div>
	)
}

export default SessionGroupList;
