import React from 'react';
import './style.css';

const FormFooter = (props) =>{

    return (
    	<span>{props?.beginingText}
            <a href={ (props?.url)? props.url:"#"}>{props?.linkText}</a>
            {props?.endingText}
        </span>
    );

}

export default FormFooter;