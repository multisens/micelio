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
      const expResponse = await Api.get(`/expDetails/${params.id}`);

      const {experiment: expData} = expResponse.data;
      setExperiment(expData);
    }catch (e) {
      // todo: jogo não encontrado
    }
  }

  return (
      <PageFormat menuSelected={'dashboard'}>
        <div className="dashboard-container">
          <div className={'gameinfo-container'}>
              <div className={'gameinfo'}>
                <span><strong>Nome:</strong></span>
                <span><strong>Criador:</strong></span>
              </div>
          </div>
        </div>
      </PageFormat>
  ) 
}

export default ExpDetails;
