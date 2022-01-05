import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './style.css';

import PageFormat from '../../components/PageFormat';
import Api from "../../services/Api";

function ExpDetails() {

  const params = useParams();

  const [experiment, setExperiment] = useState(null);

  useEffect(() => {
    getExperimentById();
  }, [])

  const getExperimentById = async () => {
    try{
      const expResponse = await Api.get(`/experiment/${params.id}`);

      const {experiment: expData} = expResponse.data;
      setExperiment(expData);
    }catch (e) {
      // todo: jogo não encontrado
    }
  }

  return (
      <PageFormat menuSelected={'dashboard'}>
        <div className="dashboard-container">
          {/*<button className={'primary'} style={{marginBottom: 20}}>Ver</button>*/}
          {experiment && (
            <div className={'gameinfo-container'}>
              <div className={'gameinfo-avatar'}>
                {
                  experiment.name.slice(0, 1).toUpperCase()
                }
              </div>
              <div className={'gameinfo'}>
                {
                  experiment.token && (<span><strong>Token:</strong> {experiment.token}</span>)
                }
                <span><strong>Nome:</strong> {experiment.name}</span>
                <span><strong>Versão:</strong> {experiment.version}</span>
                <span><strong>Criador:</strong> {experiment.username}</span>
              </div>
            </div>
          )}
        </div>
      </PageFormat>
  ) 
}

export default ExpDetails;
