import React, {useState, useEffect} from 'react';
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

      const {expDetails: expData} = expResponse.data;
      setExperiment(expData);
    }catch (e) {
      // todo: jogo não encontrado
    }
  }

  return (
      <PageFormat menuSelected={'dashboard'}>
        <div className="dashboard-container">
        {experiment && (
            <div className={'expinfo-container'}>
              <div className={'expinfo-avatar'}>
                {
                  experiment.txt_experiment_name.slice(0, 1).toUpperCase()
                }
              </div>
              <div className={'expinfo'}>
                <span><strong>Nome:</strong> {experiment.txt_experiment_name}</span>
                <span><strong>Criador:</strong> {experiment.username}</span>
              </div>
            </div>
          )}
        </div>
      </PageFormat>
  ) 
}

export default ExpDetails;
