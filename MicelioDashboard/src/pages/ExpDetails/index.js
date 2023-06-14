import React, {useState, useEffect} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import { useParams } from 'react-router-dom';
import { CSVLink } from 'react-csv';

import './style.css';

import PageFormat from '../../components/PageFormat';
import AnswerGroupsContainer from '../../components/AnswerGroupsContainer';
import AnswerGroupsCard from '../../components/AnswerGroupsCard';
import Api from "../../services/Api";

function ExpDetails() {

  const ref = React.useRef(null)

  const params = useParams();

  const [experiment, setExperiment] = useState(null);
  const [answerGroups, setAnswerGroups] = useState([]);
  const [groupExport, setGroupExport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const [groups, setGroups] = useState([0,1,2,3,4]);
  const [group, setGroup] = useState(0);
  const [form, setForm] = useState('I');
  const [textForm, setTextForm] = useState('Inicial');

  const [sessionGroupExp, setSessionGroupExp] = useState('0');


  useEffect(() => {
    getExperimentById();
  }, [])

  const getExperimentById = async () => {
    try{
      const expResponse = await Api.get(`/expDetails/${params.id}`);

      const {expDetails: expData} = expResponse.data;
      const {groupsArray: groupData} = expResponse.data;
      setExperiment(expData);
      setAnswerGroups(groupData ? groupData : []);
    }catch (e) {
      // todo: jogo não encontrado
    }
  }

  const getAnswers = async () => {
    if (!isLoading) {
      setIsLoading(true);
      try{
        await Api.get(`/expDetails/${params.id}/${form}/${group}/${sessionGroupExp}`).then((expResponse) => {
          setGroupExport(expResponse.data.data);
          if (sessionGroupExp === '0') {
            setFileName(`${experiment.txt_experiment_name}_Quest ${textForm}.csv`);
          } else {
            setFileName(`${experiment.txt_experiment_name}_Sessao ${sessionGroupExp}_Quest ${textForm}.csv`);
          }
          if(expResponse.data.notFound){
            toast.error('Não há dados para os filtros selecionados.')
            return;
          }
          ref.current.link.click();
        })
        setIsLoading(false);
      }catch (e) {
        toast.error('Algo deu errado na recuperação dos dados para exportação.')
        setIsLoading(false);
      }
    }
  }

  const setExpGroups = sel => {
    setForm(sel)
    if (sel === 'I' || sel === 'F') {
      setGroups([0,1,2,3,4])
      setGroup(0)
      if(sel === 'I') {
        setTextForm('Inicial')
      } else {
        setTextForm('Final')
      }
    } else if (sel === 'G') {
      setGroups([0,2,4])
      setGroup(0)
      setTextForm('Jogo')
    } else {
      setGroups([1])
      setGroup(1)
      setTextForm('Especifico')
    }
  }

  return (
    <>
      <ToastContainer />
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
                <div>
                  <strong>Questionário:&nbsp;</strong>
                  <select id={'export-select'} className={'export-select'} onChange={e => {setExpGroups(e.target.value)}}>
                    <option value={'I'}>Inicial</option>
                    {(experiment.has_game_form === 'S') ? <option value={'G'}>sobre o Jogo</option> : ''}
                    <option value={'E'}>Específico</option>
                    <option value={'F'}>Final</option>
                  </select>
                </div>
                <div>
                  <strong>Grupo:&nbsp;</strong>
                  <select id={'export-select'} className={'export-select'} onChange={e => {setGroup(e.target.value)}}>
                    {groups.map(g => {
                      return(
                        <option value={g}>{(g === 0) ? 'Todos' : g}</option>
                      )
                    })}
                  </select>
                </div>
                { experiment.sessionGroups ? experiment.sessionGroups.length > 1 ?
                <div>
                  <strong>Grupo de sessão:&nbsp;</strong>
                  <select id={'export-select'} className={'export-select'} onChange={e => {setSessionGroupExp(e.target.value)}}>
                    {experiment.sessionGroups.map(e => {
                      return(
                        <option value={e}>{(e === '0') ? '' : e}</option>
                      )
                    })}
                  </select>
                </div>
                : '' : ''}
              </div>
              <button className={'export-button'}
                       onClick={getAnswers}>
                  {(isLoading) 
                   ? 'Carregando...'
                   : 'Exportar'}
              </button>
              <CSVLink className={'export-csvlink'}
                       data={groupExport}
                       filename={fileName}
                       ref={ref}
                       target='_blank'/>
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
    </>
  ) 
}

export default ExpDetails;
