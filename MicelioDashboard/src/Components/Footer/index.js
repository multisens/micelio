import React from 'react';
import './style.css';

import {AiFillGithub} from 'react-icons/ai'

const Footer = () => {
    return (
        <footer className={'main'}>
            <span>Micelio - Cefet-RJ | GPMM</span>
            <AiFillGithub size={32} />
            <span>Igor, Lucas e Marcelo</span>
        </footer>
    );
}

export default Footer;