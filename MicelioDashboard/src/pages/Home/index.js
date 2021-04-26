import React from 'react';
import './style.css';

import PageFormat from '../../components/PageFormat';
import GameCardsContainer from '../../components/GameCardsContainer';
import Card from '../../components/Card';
import SessionGroupList from '../../components/SessionGroupList';

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

function Home() {

	return (
		<PageFormat menuSelected={'home'}>
			<main className={'gamelist-container'}>

				<GameCardsContainer title="Meu Jogos">
					<Card name={'Control Harvest'} created={3} active={'50'} shared={true}/>
					<Card name={'Bio Land'} created={3} active={'50'} shared={true}/>
					<Card name={'Animal Crossing'} created={3} active={'50'} shared={true}/>
				</GameCardsContainer>

				<SessionGroupList/>

			</main>

		</PageFormat>
	)
}

export default Home;
