export function getPopulation(
  session,
  agentsNameList,
  entitiesNameList,
  activitiesMap
) {
  var clone = (obj) => {
    return JSON.parse(JSON.stringify(obj))
  }

  var agentsList = {}
  var entitiesList = {}

  if (agentsNameList) {
    for (var i in agentsNameList) {
      agentsList[agentsNameList[i]] = 0
    }
  } else {
    agentsNameList = []
  }

  if (entitiesNameList) {
    for (var i in entitiesNameList) {
      entitiesList[entitiesNameList[i]] = 0
    }
  } else {
    entitiesNameList = []
  }

  var population = []

  var includeList = activitiesMap["insert"] ? activitiesMap["insert"] : []
  var excludeList = activitiesMap["remove"] ? activitiesMap["remove"] : []

  //resolver problema de role undefined
  for (var i in session.activities) {
    var activity = session.activities[i]

    if (includeList.some((a) => a.name === activity.name)) {
      let activityAux = includeList.filter((a) => a.name === activity.name)[0]

      for (var j in activity.agents) {
        var agent = activity.agents[j]

        if (agentsNameList.includes(agent.name) && activityAux !== undefined) {
          if (activityAux.role === undefined) {
            agentsList[agent.name]++

            population.push(
              clone({
                time: activity.time,
                agent: agent.name,
                quantity: agentsList[agent.name],
                type: "agent",
              })
            )
          } else {
            if (activityAux.role.includes(agent.role)) {
              agentsList[agent.name]++

              population.push(
                clone({
                  time: activity.time,
                  agent: agent.name,
                  quantity: agentsList[agent.name],
                  type: "agent",
                })
              )
            }
          }
        }
      }

      for (var j in activity.entities) {
        var entity = activity.entities[j]

        if (
          entitiesNameList.includes(entity.name) &&
          activityAux !== undefined
        ) {
          if (activityAux.role === undefined) {
            entitiesList[entity.name]++

            population.push(
              clone({
                time: activity.time,
                agent: entity.name,
                quantity: entitiesList[entity.name],
                type: "entity",
              })
            )
          } else {
            if (activityAux.role.includes(entity.role)) {
              entitiesList[entity.name]++

              population.push(
                clone({
                  time: activity.time,
                  agent: entity.name,
                  quantity: entitiesList[entity.name],
                  type: "entity",
                })
              )
            }
          }
        }
      }
    }

    if (excludeList.some((a) => a.name === activity.name)) {
      let activityAux = includeList.filter((a) => a.name === activity.name)[0]

      for (var j in activity.agents) {
        var agent = activity.agents[j]

        if (agentsNameList.includes(agent.name) && activityAux !== undefined) {
          if (activityAux.role === undefined) {
            agentsList[agent.name]--

            population.push(
              clone({
                time: activity.time,
                agent: agent.name,
                quantity: agentsList[agent.name],
                type: "agent",
              })
            )
          } else {
            if (activityAux.role.includes(agent.role)) {
              agentsList[agent.name]--

              population.push(
                clone({
                  time: activity.time,
                  agent: agent.name,
                  quantity: agentsList[agent.name],
                  type: "agent",
                })
              )
            }
          }
        }
      }

      for (var j in activity.entities) {
        var entity = activity.entities[j]

        if (
          entitiesNameList.includes(entity.name) &&
          activityAux !== undefined
        ) {
          if (activityAux.role === undefined) {
            entitiesList[entity.name]--

            population.push(
              clone({
                time: activity.time,
                agent: entity.name,
                quantity: entitiesList[entity.name],
                type: "entity",
              })
            )
          } else {
            if (activityAux.role.includes(entity.role)) {
              entitiesList[entity.name]--

              population.push(
                clone({
                  time: activity.time,
                  agent: entity.name,
                  quantity: entitiesList[entity.name],
                  type: "entity",
                })
              )
            }
          }
        }
      }
    }
  }
  return population
}
