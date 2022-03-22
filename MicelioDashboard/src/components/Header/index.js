import React from 'react';
import './style.css';

const Header = (props) => {

  const title = props.title || 'Micelio'

  return (
    <header className={'main'}>
      <h1>{title}</h1>
    </header>
  );
}

export default Header;
