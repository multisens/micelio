import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import {AiOutlineCopy} from 'react-icons/ai';
import './style.css';

import Api from '../../services/Api';

import PageFormat from '../../components/PageFormat';
import ExperimentCards from '../../components/ExperimentCardsContainer';
import ExperimentCard from '../../components/ExperimentCard';
import Popup from '../../components/Popup'

import 'react-toastify/dist/ReactToastify.min.css';

const EXPLIST_MAX_CARDS = 4;

function Experiment() {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isGamesExpanded, setIsGamesExpanded] = useState(false);
  const [experimentCards, setExperimentCards] = useState(EXPLIST_MAX_CARDS);

  const [newExperiment, setNewExperiment] = useState('');
  const [experimentGame, setExperimentGame] = useState('');

  const [experimentList, setExperimentList] = useState([]);

  const [isSearchingGame, setIsSearchingGame] = useState(false);

  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const [isGroupPopupOpen, setIsGroupPopupOpen] = useState(false);
  const [sessionGroup, setSessionGroup] = useState();
  const [sessionGroupExp, setSessionGroupExp] = useState();
  
  const location = useLocation();

  useEffect(() => {
    updateExperimentList();

    if (location.state) {
      if (location.state.saved) {
        toast.success('Criação de experimento finalizada com sucesso.', {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}});
        location.state.saved = false;
        console.log(location.state.saved)
      }
    }
  }, [])

  useEffect(() => {
    if(isGamesExpanded || isSearchingGame) {
      setExperimentCards(Infinity);
      return;
    }
    setExperimentCards(EXPLIST_MAX_CARDS);

  }, [isGamesExpanded, isSearchingGame])

  const updateExperimentList = () => {
    Api.get('/experiment').then(response => {
      setExperimentList(response.data.data);
    })
  }

  const doCreateExperiment = async event => {
    event.preventDefault()

    try {
      const response = await Api.post('/experiment', {
        nameExperiment: newExperiment,
        nameGame: experimentGame
      })

      if(!response.data.ok) {
        return alert('Não foi possível efetuar cadastro. Por favor, tente novamente')
      }

      setNewExperiment('')
      setExperimentGame('')
      setIsPopupOpen(false)

      toast.success('Cadastrado com sucesso', {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})

      updateExperimentList()

    }catch (e) {
      console.log(e.response.data)
      toast.error(`Não foi possível efetuar cadastro. Por favor, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
    }
  }

  const openSharePopup = experiment_id => {
    const link = window.location.href.replace('experiment', 'form')
    setShareLink(`${link}/${experiment_id}`);
    setIsSharePopupOpen(true);
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copiado com sucesso.', {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}});
  }

  const addSessionGroup = exp => {
    setSessionGroupExp(exp);
    setIsGroupPopupOpen(true);
  }

  const doAddSessionGroup = async event => {
    event.preventDefault()

    try {
      const response = await Api.post(`/experiment/${sessionGroupExp}`, {
        session_group_id: sessionGroup
      })
      
      if(response.data.error === 'no_data_found'){
        return toast.error(`Grupo de sessão ${sessionGroup} não cadastrado.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
      } else if (response.data.error === 'already_registered') {
        return toast.error(`Grupo de sessão ${sessionGroup} já cadastrado para esse experimento.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
      }

      setIsGroupPopupOpen(false)
      setSessionGroup('')

      toast.success('Cadastrado com sucesso', {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})

      updateExperimentList()

    }catch (e) {
      console.log(e.response.data)
      toast.error(`Não foi possível efetuar cadastro. Por favor, tente novamente.`, {style: {boxShadow: '1px 1px 5px rgba(0,0,0,.4)'}})
    }
  }

  const filterExperimentList = (keyboardEvent) => {
    const filterText = keyboardEvent.target.value.toLowerCase().replaceAll(' ', '');

    if(filterText) {
      setIsSearchingGame(true);
    }else{
      setIsSearchingGame(false);
    }

    experimentList.forEach(experiment => {
      const expName = experiment.txt_experiment_name.toLowerCase().replaceAll(' ', '');
      const gameName = experiment.gameName.toLowerCase().replaceAll(' ', '');
      const $experimentCard = document.getElementById(experiment.experiment_id);

      if(!$experimentCard) {
        return;
      }

      if(gameName.indexOf(filterText) === -1 && expName.indexOf(filterText) === -1) {
        $experimentCard.style.display = 'none';
        return;
      }

      $experimentCard.style.display = 'flex';
    })
  }

  return (
    <>
      <ToastContainer />

      <Popup isOpen={isSharePopupOpen} onClose={() => {setIsSharePopupOpen(false)}}>
        <h2>Compartilhe o experimento</h2>
        <br/>
        <div>
          <div>
            <input type={'text'} readOnly={true} value={shareLink}/>
          </div>
          <div className={'card-options'}>
            <div className={'card-option'}>
              <AiOutlineCopy size={25} onClick={copyLink}/>
            </div>
          </div>
        </div>
      </Popup>

      <Popup isOpen={isGroupPopupOpen} onClose={() => {setIsGroupPopupOpen(false)}}>
        <h2>Adicione um grupo de sessão</h2>
        <form onSubmit={doAddSessionGroup}>
          <input required type="text" className="primary" placeholder={'Digite o código do grupo...'} value={sessionGroup}
                 onChange={e => setSessionGroup(e.target.value)}/>
          <button className="primary">Adicionar</button>
        </form>
      </Popup>

      <Popup isOpen={isPopupOpen} onClose={() => {setIsPopupOpen(false)}}>
        <h2>Cadastre um novo experimento</h2>
        <form onSubmit={doCreateExperiment}>
          <input required type="text" className="primary" placeholder={'Nome'} value={newExperiment}
                 onChange={e => setNewExperiment(e.target.value)}/>
          <input required type="text" className="primary" placeholder={'Jogo do Experimento'} value={experimentGame}
                 onChange={e => setExperimentGame(e.target.value)}/>
          <button className="primary">Cadastrar</button>
        </form>
      </Popup>

      <PageFormat menuSelected={'experiment'}>
        <main className={'experimentlist-container'}>

          <ExperimentCards title="Meus Experimentos" onSearch={filterExperimentList} onClickAdd={() => {setIsPopupOpen(true);}}>
            {
              experimentList.length > 0 ? experimentList.slice(0, experimentCards).map((exp) => {
                return (<ExperimentCard key={exp.experiment_id}
                                        id={exp.experiment_id}
                                        name={exp.txt_experiment_name}
                                        game={exp.gameName}
                                        groups={exp.groups}
                                        isOwner={1}
                                        onShare={() => {openSharePopup(exp.experiment_id)}} 
                                        addGroup={() => {addSessionGroup(exp.experiment_id)}} />);
              }) : (<span>Não há experimentos cadastrados</span>)
            }
          </ExperimentCards>

          {
            experimentList.length > 4 && !isSearchingGame ? (
              <div className={'more-experiments'}>
                <button className={'primary'} onClick={() => {setIsGamesExpanded(!isGamesExpanded)}}>{isGamesExpanded ? 'Ver menos' : 'Ver mais'}</button>
              </div>
            ) : ''
          }

        </main>
      </PageFormat>
    </>
  )
}

export default Experiment;
