import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { CSVLink } from 'react-csv';

import './style.css';

import PageFormat from '../../components/PageFormat';
import AnswerGroupsContainer from '../../components/AnswerGroupsContainer';
import AnswerGroupsCard from '../../components/AnswerGroupsCard';
import Api from "../../services/Api";

function ExpDetails() {

  const params = useParams();

  const [experiment, setExperiment] = useState(null);
  const [answerGroups, setAnswerGroups] = useState([]);
  const [groupExport, setGroupExport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const data = [{nome: 'Pedro',
                sobrenome: 'Telles'}]

  useEffect(() => {
    getExperimentById();
  }, [])

  const getExperimentById = async () => {
    try{
      const expResponse = await Api.get(`/expDetails/${params.id}`);

      const {expDetails: expData} = expResponse.data;
      const {groupsArray: groupData} = expResponse.data;
      setExperiment(expData);
      setAnswerGroups(groupData);
    }catch (e) {
      // todo: jogo não encontrado
    }
  }

  const exportAnswers = async (event, done) => {
    const $exportSselect = document.getElementById('export-select').value;
    if(!isLoading){
      setIsLoading(true);
      try{
        const expResponse = await Api.post(`/expDetails/${params.id}`, {
          group: $exportSselect
        })
        setGroupExport([expResponse.data.data]);
        setIsLoading(false);
        done(true);
      } catch (e) {
        setIsLoading(false);
        done(false);
      }
    }
  }

  return (
      <PageFormat menuSelected={'dashboard'}>
        <div className="dashboard-container">
        {experiment && (
          <div>
            <div className={'expinfo-container'}>
              <div className={'expinfo-avatar'}>
                {
                  experiment.txt_experiment_name.slice(0, 1).toUpperCase()
                }
              </div>
              <div className={'expinfo'}>
                <span><strong>Nome:</strong> {experiment.txt_experiment_name}</span>
                <span><strong>Criador:</strong> {experiment.username}</span>
                <span><strong>Finalizados:</strong> {experiment.partEnded}</span>
                <span><strong>Total de participantes:</strong> {experiment.partTotal}</span>
              </div>
              <div className={'exp-export'}>
                <select id={'export-select'} className={'export-select'}>
                  <option value={1}>Grupo 1</option>
                  <option value={2}>Grupo 2</option>
                  <option value={3}>Grupo 3</option>
                  <option value={4}>Grupo 4</option>
                </select>
                <CSVLink className={'export-button'}
                         data={groupExport}
                         filename={'teste.csv'}
                         asyncOnClick={true}
                         onClick={exportAnswers}>
                  {(isLoading) 
                   ? 'Carregando...'
                   : 'Exportar'}
                </CSVLink>
              </div>
            </div>
            <br/><br/>
            <div>
              <AnswerGroupsContainer title="Lista de Participantes">
              {
                answerGroups.length > 0 ? answerGroups.map((aG) => {
                  return (<AnswerGroupsCard key={aG.group_id}
                                            id={aG.group_id}
                                            total={aG.num_part_total}
                                            ended={aG.num_ended_total}
                                            partList={aG.partList} />);
                }) : (<span>Experimento ainda não teve entrada de participantes.</span>)
              }
              </AnswerGroupsContainer>
            </div>
          </div>
        )}
        </div>
      </PageFormat>
  ) 
}

export default ExpDetails;
