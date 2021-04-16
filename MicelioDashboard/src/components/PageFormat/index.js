import React from 'react';

import './style.css';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MainMenu from "../../components/MainMenu";

function PageFormat(props) {

  return (
    <div className={'content-body'}>
      <Header title="Micelio"/>

      <div className="content-container">

        <MainMenu selected={props.menuSelected} />

        {props.children}

      </div>
      <Footer />
    </div>
  )
}

export default PageFormat;
