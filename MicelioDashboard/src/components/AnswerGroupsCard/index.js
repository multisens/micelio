import React from 'react';
import { useHistory } from 'react-router-dom';
import {AiOutlineSync, AiOutlineCheck} from 'react-icons/ai'

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

function AnswerGroupsCard(props) {
  return (
    <li id={props.id}>
      <div className={'card-header'}>
        <h2>Grupo {props.id}</h2>
        <p>{props.ended} / {props.total}</p>
      </div>
      <Hr/>
      <div className={'card-content'}>
        <table>
          <tr>
            <td className='text-content'><b>Participantes</b></td>
            <td className='text-ended'><b>Situação</b></td>
          </tr>
        {
          props.partList.map((list) => {
            return(
              <tr>
                <td className='text-content'>
                  {list.participant_id}
                </td>
                <td className='text-ended'>
                  {(list.has_ended_exp === 'S')
                   ? (<AiOutlineCheck size={22} color={'#2A9D8F'} alt={'Finalizado'}/>)
                   : (<AiOutlineSync size={22} color={'#727272'} alt={'Em andamento'}/>)}
                </td>
              </tr>
            )
          })
        }
        </table>
      </div>
    </li>
  )
}

export default AnswerGroupsCard;
