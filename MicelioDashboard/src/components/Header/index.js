import React from 'react';
import './style.css';

import {useAuth} from "../../context/AuthContext";

const Header = (props) => {
  const {auth} = useAuth();
  console.log(auth);

  return (
    <header className={'main'}>
      <h1>{props.title}</h1>
    </header>
  );
}

export default Header;
