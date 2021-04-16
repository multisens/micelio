import React from 'react';
import './style.css';

const FormCard = (props) =>{

    return (
        <div className={'form-card'}>
            <div>
                <h1 className={'card-title'}>{props.title}</h1>
            </div>
            <div className={'form'}>
               {props.children}
            </div>
        </div>
    );

}

export default FormCard;