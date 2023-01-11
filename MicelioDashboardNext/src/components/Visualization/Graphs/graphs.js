import * as vl from 'vega-lite-api';

const getPopulation = (session, agentsNameList, entitiesNameList, activitiesMap) => {
  debugger;
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

export class GraphFactory {
  selectActivityName = vl.selectMulti().fields('name');

  visualizationConfig = null;

  constructor(visualizationConfig) {
    this.visualizationConfig = visualizationConfig;
    this.brush = vl.selectInterval('abc').encodings('x');
  }
  GetTimeline(
    activities,
    timelineConfiguration,
    { xTitle = 'Tempo de jogo', legendTitle = 'Atividades', mainTitle = 'Linha do Tempo' } = {}
  ) {
    const filteredActivities = activities.filter((activity) => {
      if (timelineConfiguration.activities.includes(activity.name)) return activity;
    });

    return vl
      .markArea()
      .data(filteredActivities)
      .encode(
        vl.x().fieldQ('time').title(xTitle),
        vl.y().count().title(''),
        vl.color().fieldN('name').scale({ scheme: 'paired' }).title(legendTitle)
      )
      .title(mainTitle)
      .select(this.brush, this.selectActivityName)
      .height(40)
      .width(this.visualizationConfig.screen_width);
  }

  GetActivitiesCircle(
    activities,
    { circle_bins, activitiesList },
    { xTitle = 'Tempo de jogo', legendTitle = 'QTD', mainTitle = 'Atividades' } = {}
  ) {
    return vl
      .markCircle()
      .data(activities)
      .encode(
        vl.y().fieldN('name').title('').axis({ grid: true, gridColor: '#F0F0F0' }).sort(activitiesList),
        vl.x().fieldQ('time').title(xTitle).bin({ maxbins: circle_bins }),
        vl
          .size()
          .count()
          .scale({ range: [20, 500] })
          .title(legendTitle),
        vl.color().fieldN('name').scale({ scheme: 'paired' }).legend(false),
        vl.tooltip('name')
      )
      .title(mainTitle)
      .transform([vl.filter(this.selectActivityName), vl.filter(this.brush)])
      .height(400)
      .width(this.visualizationConfig.screen_width);
  }

  GetHeatMap(activities, { activities: activitiesHeatMapList }, { mainTitle = 'Heat Map' } = {}) {
    var heatMapData = activities.filter((a) => {
      if (activitiesHeatMapList.includes(a.name)) return a;
    });

    return vl
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
      .transform([vl.filter(this.brush)])
      .width(800 / 2)
      .height(800 / 3);
  }

  GetPopulation(
    activities,
    { agents, entities, insert, remove },
    { mainTitle = 'Gráfico de População', xTitle = 'Tempo de jogo', legendTitle = 'Personagens' } = {}
  ) {
    const activitiesMap = {
      insert,
      remove,
    };

    const populationData = getPopulation({ activities }, agents, entities, activitiesMap);

    return vl
      .markLine({ interpolate: 'step', clip: true })
      .data(populationData)
      .encode(
        vl.x().fieldQ('time').title(xTitle),
        vl.y().fieldQ('quantity').scale({ domainMin: 0 }),
        vl.color().fieldN('agent'),
        vl.color().fieldN('agent').title(legendTitle).legend({ orient: 'bottom' })
      )
      .title(mainTitle)
      .transform(vl.filter(this.brush))
      .width(this.visualizationConfig.screen_width);
  }
}
