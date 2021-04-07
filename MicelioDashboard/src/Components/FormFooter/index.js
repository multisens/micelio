import React from 'react';
import './style.css';
import {Link} from 'react-router-dom';

const FormFooter = (props) =>{

    return (
    	<span>{props?.beginingText}
            <Link to={ (props?.url)? props.url:"#"}>{props?.linkText}</Link>
            {props?.endingText}
        </span>
    );

}

export default FormFooter;