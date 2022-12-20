import * as vl from 'vega-lite-api';
import embed from 'vega-embed';
import { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';

const getPopulation = (session, agentsNameList, entitiesNameList, activitiesMap) => {
  var clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };

  var agentsList = {};
  var entitiesList = {};

  if (agentsNameList) {
    for (var i in agentsNameList) {
      agentsList[agentsNameList[i]] = 0;
    }
  } else {
    agentsNameList = [];
  }

  if (entitiesNameList) {
    for (var i in entitiesNameList) {
      entitiesList[entitiesNameList[i]] = 0;
    }
  } else {
    entitiesNameList = [];
  }

  var population = [];

  var includeList = activitiesMap['insert'] ? activitiesMap['insert'] : [];
  var excludeList = activitiesMap['remove'] ? activitiesMap['remove'] : [];

  //resolver problema de role undefined
  for (var i in session.activities) {
    var activity = session.activities[i];

    if (includeList.some((a) => a.name === activity.name)) {
      let activityAux = includeList.filter((a) => a.name === activity.name)[0];

      for (var j in activity.agents) {
        var agent = activity.agents[j];

        if (agentsNameList.includes(agent.name) && activityAux !== undefined) {
          if (activityAux.role === undefined) {
            agentsList[agent.name]++;

            population.push(
              clone({
                time: activity.time,
                agent: agent.name,
                quantity: agentsList[agent.name],
                type: 'agent',
              })
            );
          } else {
            if (activityAux.role.includes(agent.role)) {
              agentsList[agent.name]++;

              population.push(
                clone({
                  time: activity.time,
                  agent: agent.name,
                  quantity: agentsList[agent.name],
                  type: 'agent',
                })
              );
            }
          }
        }
      }

      for (var j in activity.entities) {
        var entity = activity.entities[j];

        if (entitiesNameList.includes(entity.name) && activityAux !== undefined) {
          if (activityAux.role === undefined) {
            entitiesList[entity.name]++;

            population.push(
              clone({
                time: activity.time,
                agent: entity.name,
                quantity: entitiesList[entity.name],
                type: 'entity',
              })
            );
          } else {
            if (activityAux.role.includes(entity.role)) {
              entitiesList[entity.name]++;

              population.push(
                clone({
                  time: activity.time,
                  agent: entity.name,
                  quantity: entitiesList[entity.name],
                  type: 'entity',
                })
              );
            }
          }
        }
      }
    }

    if (excludeList.some((a) => a.name === activity.name)) {
      let activityAux = includeList.filter((a) => a.name === activity.name)[0];

      for (var j in activity.agents) {
        var agent = activity.agents[j];

        if (agentsNameList.includes(agent.name) && activityAux !== undefined) {
          if (activityAux.role === undefined) {
            agentsList[agent.name]--;

            population.push(
              clone({
                time: activity.time,
                agent: agent.name,
                quantity: agentsList[agent.name],
                type: 'agent',
              })
            );
          } else {
            if (activityAux.role.includes(agent.role)) {
              agentsList[agent.name]--;

              population.push(
                clone({
                  time: activity.time,
                  agent: agent.name,
                  quantity: agentsList[agent.name],
                  type: 'agent',
                })
              );
            }
          }
        }
      }

      for (var j in activity.entities) {
        var entity = activity.entities[j];

        if (entitiesNameList.includes(entity.name) && activityAux !== undefined) {
          if (activityAux.role === undefined) {
            entitiesList[entity.name]--;

            population.push(
              clone({
                time: activity.time,
                agent: entity.name,
                quantity: entitiesList[entity.name],
                type: 'entity',
              })
            );
          } else {
            if (activityAux.role.includes(entity.role)) {
              entitiesList[entity.name]--;

              population.push(
                clone({
                  time: activity.time,
                  agent: entity.name,
                  quantity: entitiesList[entity.name],
                  type: 'entity',
                })
              );
            }
          }
        }
      }
    }
  }
  return population;
};

const Visualization = ({ gameData, config }) => {
  const [t, setT] = useState();
  useEffect(() => {
    if (!config || !config.graphs || !gameData) return;

    const activitiesList = config.graphs[0].activities;
    const activitiesHeatMapList = config.graphs[3].activities;
    const agents = config.graphs[4].agents;
    const entities = config.graphs[4].entities;
    const activitiesMap = {
      insert: config.graphs[4].insert,
      remove: config.graphs[4].remove,
    };

    const specialWidth = config.screen_width;
    const CircleBins = config.graphs[0].circle_bins;

    const width = 800;

    var populationData = getPopulation(gameData, agents, entities, activitiesMap);

    var data = gameData.activities.filter((a) => {
      if (activitiesList.includes(a.name)) return a;
    });
    var heatMapData = gameData.activities.filter((a) => {
      if (activitiesHeatMapList.includes(a.name)) return a;
    });

    //criação dos filtros
    const brush = vl.selectInterval('abc').encodings('x');

    const selectActivityName = vl.selectMulti().fields('name');

    //crição dos gráficos
    const timeLine = vl
      .markArea()
      .data(data)
      .encode(
        vl.x().fieldQ('time').title('Tempo de jogo'),
        vl.y().count().title(''),
        vl.color().fieldN('name').scale({ scheme: 'paired' }).title('Atividades')
      )
      .title('Linha do Tempo')
      .select(brush, selectActivityName)
      .height(40)
      .width(specialWidth);

    const activitiesCircle = vl
      .markCircle()
      .data(data)
      .encode(
        vl.y().fieldN('name').title('').axis({ grid: true, gridColor: '#F0F0F0' }).sort(activitiesList),
        vl.x().fieldQ('time').title('Tempo de jogo').bin({ maxbins: CircleBins }),
        vl
          .size()
          .count()
          .scale({ range: [20, 500] })
          .title('QTD'), //.legend({orient: "bottom"}),
        vl.color().fieldN('name').scale({ scheme: 'paired' }).legend(false),
        vl.tooltip('name')
      )
      .title('Atividades')
      .transform([vl.filter(selectActivityName), vl.filter(brush)])
      .height(400)
      .width(specialWidth);

    const heatMap = vl
      .markRect({ clip: true })
      .data(heatMapData)
      .encode(
        vl
          .x()
          .fieldQ('position_x')
          .bin({ maxbins: 20 })
          .axis({ grid: true, gridColor: '#FFFFFF' })
          .title('')
          .scale({ domainMin: 0 }),
        vl
          .y()
          .fieldQ('position_y')
          .bin({ maxbins: 20 })
          .axis({ grid: true, gridColor: '#FFFFFF' })
          .title('')
          .scale({ domainMin: 0 })
          .sort('descending'),
        vl.color().count().scale({ scheme: 'reds' }).legend({ orient: 'bottom', padding: 10 }),
        vl.tooltip(['name', 'time'])
      )
      .title('Heat Map')
      .transform([vl.filter(brush)])
      .width(width / 2)
      .height(width / 3);

    const population = vl
      .markLine({ interpolate: 'step', clip: true })
      .data(populationData)
      .encode(
        vl.x().fieldQ('time').title('Tempo de jogo'),
        vl.y().fieldQ('quantity').scale({ domainMin: 0 }),
        vl.color().fieldN('agent'),
        vl.color().fieldN('agent').title('Insetos').legend({ orient: 'bottom' })
      )
      .title('Gráfico de População')
      .transform(vl.filter(brush))
      .width(specialWidth);

    //returna o concatenado dos gráficos
    const visualization = vl.vconcat(timeLine, heatMap, activitiesCircle, population);
    embed('#teste', JSON.parse(visualization));
  }, [gameData, config]);

  return (
    <>
      <Flex id={'teste'}></Flex>
    </>
  );
};

export default Visualization;
