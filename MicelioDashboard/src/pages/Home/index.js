import React from 'react';

import './style.css';

import PageFormat from '../../components/PageFormat';

function Home() {

  return (
    <PageFormat menuSelected={'home'}>
        <main className={'gamelist-container'}>

          <div className={'gamecards'}>
            <ul>
              <li>
                Card 1
              </li>
              <li>
                Card 2
              </li>
              <li>
                Card 3
              </li>
              <li>
                Card 4
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
