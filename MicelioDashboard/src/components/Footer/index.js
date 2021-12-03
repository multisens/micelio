import React from 'react';
import './style.css';

import {AiFillGithub} from 'react-icons/ai'
// colocar link no primeiro span: eic.cefet-rj.br/gpmm

const Footer = () => {
    return (
        <footer className={'main'}>
            <a href="https://eic.cefet-rj.br/gpmm">Micelio - Cefet/RJ | GPMM</a>
            <a href="https://github.com/GPMM/micelio"><AiFillGithub size={32} /></a>
            <span>Igor, Lucas e Marcelo</span>
        </footer>
    );
}

export default Footer;