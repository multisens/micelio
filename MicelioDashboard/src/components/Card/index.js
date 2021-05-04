import React from 'react';
import {AiOutlineShareAlt, AiOutlinePlusCircle} from 'react-icons/ai'


const Hr = () => {
  return (
    <hr style={{
      color: '#dfdfdf',
      backgroundColor: '#dfdfdf',
      height: .5,
      borderColor: '#dfdfdf'
    }}/>
  );
}

function Card(props) {

  return (
    <li>
      <div className={'card-header'}>
        <h2>{props.name}</h2>
        <Hr/>
      </div>
      <div className={'card-content'}>
        <p><b>Salas criadas: </b>{props.created}</p>
        <p><b>Sessões Ativas: </b>{props.active}</p>
        <p><b>Status: </b>{(props.shared) ? 'compartilhado' : 'privado'}</p>
      </div>
      <div className={'card-options'}>
        <div className={"card-option"}>
          <AiOutlineShareAlt size={25}/>
        </div>
        <div className={"card-option"}>
          <AiOutlinePlusCircle size={25}/>
        </div>
      </div>
    </li>

  )
}

export default Card;
