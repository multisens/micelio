import React from 'react';
import { useHistory } from 'react-router-dom';
import {AiOutlineShareAlt, AiOutlinePlusCircle, AiOutlineCrown} from 'react-icons/ai'


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

function ExperimentCard(props) {

  const history = useHistory();

  return (
    <li id={props.id}>
      <div className={'card-header'} onClick={() => {history.push(`/consentTerm/${props.id}`)}}>
        <h2>{props.name}</h2>
        {(props.isOwner === 1)
          ? (<AiOutlineCrown size={24} color={'#E9C46A'}/>)
          : (<AiOutlineCrown size={24} color={'#7c7c7c'}/>)}
      </div>
      <Hr/>
      <div className={'card-content'}>
        <p><b>Jogo vinculado: </b>{props.game}</p>
      </div>
      <div className={'card-options'}>
        <div className={'card-option'} onClick={props.onShare}>
          <AiOutlineShareAlt size={25}/>
        </div>
      </div>
    </li>

  )
}

export default ExperimentCard;
