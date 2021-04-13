import React from 'react';

import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MainMenu from "../../components/MainMenu";

function Dashboard() {

  return (
    <>
      <Header title="Micelio"/>

      <div className="home-container">

        <MainMenu selected={'dashboard'} />

        <div className="dashboard-container">
          xxx
        </div>

      </div>
      <Footer />
    </>
  )
}

export default Dashboard;
