export function getPopulation(activities, agentsTrack = [], entitiesTrack = []) {
  const counters = {};      // { <nome>: quantidade atual }
  const output   = [];

  const pushPoint = (time, name, type) => {
    counters[name] = (counters[name] || 0) + 1;
    output.push({ time, agent: name, quantity: counters[name], type });
  };

  for (const { time, agents = [], entities = [] } of activities) {
    // agentes
    for (const a of agents) {
      if (agentsTrack.includes(a.name)) {
        pushPoint(time, a.name, "agent");
      }
    }

    // entidades
    for (const e of entities) {
      if (entitiesTrack.includes(e.name)) {
        pushPoint(time, e.name, "entity");
      }
    }
  }

  return output;
}