import React from 'react';
import './style.css';

const Header= (props) => {
    return (
        <header className={'main'}>
            <h1>{props.title}</h1>
        </header>
    );
}

export default Header;