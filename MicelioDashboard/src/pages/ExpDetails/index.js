import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import './style.css';

import PageFormat from '../../components/PageFormat';
import AnswerGroupsContainer from '../../components/AnswerGroupsContainer';
import AnswerGroupsCard from '../../components/AnswerGroupsCard';
import Api from "../../services/Api";

function ExpDetails() {

  const params = useParams();

  const [experiment, setExperiment] = useState(null);
  const [answerGroups, setAnswerGroups] = useState([]);
  const [partTotal, setPartTotal] = useState(0);

  useEffect(() => {
    getExperimentById();
  }, [])

  const getExperimentById = async () => {
    try{
      const expResponse = await Api.get(`/expDetails/${params.id}`);

      const {expDetails: expData} = expResponse.data;
      const {groupsArray: groupData} = expResponse.data;
      const {countTotal: countData} = expResponse.data;
      setExperiment(expData);
      setAnswerGroups(groupData);
      setPartTotal(countData);
    }catch (e) {
      // todo: jogo não encontrado
    }
  }

  const filterGroupsList = () => {
    alert(1);
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
            </div>
            <br/><br/>
            <div>
              <AnswerGroupsContainer title="Lista de Participantes" onSearch={filterGroupsList}>
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
