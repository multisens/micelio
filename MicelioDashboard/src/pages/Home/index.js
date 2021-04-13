import React from 'react';

import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MainMenu from "../../components/MainMenu";

function Home() {

  return (
    <>
      <Header title="Micelio"/>

      <div className="home-container">

        <MainMenu selected={'start'} />

        <main class={'gamelist'}>
          <h2>Lista de salas</h2>
          <ul>
            <li>Jogo 1</li>
            <li>Jogo 2</li>
            <li>Jogo 3</li>
            <li>Jogo 4</li>
          </ul>
        </main>

      </div>
      <Footer />
    </>
  )
}

export default Home;
