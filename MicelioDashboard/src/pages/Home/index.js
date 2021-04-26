import React from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai'

import './style.css';

import PageFormat from '../../components/PageFormat';

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

				<div className={'gamecards'}>
					<div className={'gamecards-header'}>
						<h2>Meus Jogos</h2>
						<AiOutlinePlusCircle size={25} />
					</div>
					<ul>
						<li>
							<h2>Control Harvest</h2>
							<Hr/>
							<div className={'information-line'}><b>Salas criadas:</b><p> 3</p></div>
							<div className={'information-line'}><b>Sessões Ativas:</b><p> 50</p></div>
							<div className={'information-line'}><b>Status:</b><p> shared</p></div>
						</li>
						<li>
							<h2>Bio Land</h2>
							<Hr/>
							<p>Salas criadas: 3</p>
						</li>
						<li>
							<h2>Micelio</h2>
							<Hr/>
							<p>Salas criadas: 3</p>
						</li>
						<li>
							<h2>Sargeiro</h2>
							<Hr/>
							<p>Salas criadas: 3</p>
						</li>
					</ul>
				</div>

				<div className={'gamelist'}>
					<h2>Lista de salas</h2>
					<ul>
						<li>Jogo 1</li>
						<li>Jogo 2</li>
						<li>Jogo 3</li>
						<li>Jogo 4</li>
					</ul>
				</div>

			</main>

		</PageFormat>
	)
}

export default Home;
