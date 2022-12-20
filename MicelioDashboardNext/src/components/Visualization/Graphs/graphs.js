import * as vl from 'vega-lite-api';

const specialWidth = 400;
export const GetTimeline = (
  data,
  brush,
  selectActivityName,
  { xTitle = 'Tempo de jogo', legendTitle = 'Atividades', mainTitle = 'Linha do Tempo' } = {}
) => {
  return vl
    .markArea()
    .data(data)
    .encode(
      vl.x().fieldQ('time').title(xTitle),
      vl.y().count().title(''),
      vl.color().fieldN('name').scale({ scheme: 'paired' }).title(legendTitle)
    )
    .title(mainTitle)
    .select(brush, selectActivityName)
    .height(40)
    .width(specialWidth);
};

export const GetActivitiesCircle = (
  data,
  brush,
  selectActivityName,
  maxCircleBins,
  activitiesList,
  { xTitle = 'Tempo de jogo', legendTitle = 'QTD', mainTitle = 'Atividades' } = {}
) => {
  return vl
    .markCircle()
    .data(data)
    .encode(
      vl.y().fieldN('name').title('').axis({ grid: true, gridColor: '#F0F0F0' }).sort(activitiesList),
      vl.x().fieldQ('time').title(xTitle).bin({ maxbins: maxCircleBins }),
      vl
        .size()
        .count()
        .scale({ range: [20, 500] })
        .title(legendTitle),
      vl.color().fieldN('name').scale({ scheme: 'paired' }).legend(false),
      vl.tooltip('name')
    )
    .title(mainTitle)
    .transform([vl.filter(selectActivityName), vl.filter(brush)])
    .height(400)
    .width(specialWidth);
};

export const GetHeatMap = (data, brush, { mainTitle = 'Heat Map' } = {}) => {
  return vl
    .markRect({ clip: true })
    .data(data)
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
    .width(800 / 2)
    .height(800 / 3);
};

export const GetPopulation = (
  data,
  brush,
  { mainTitle = 'Gráfico de População', xTitle = 'Tempo de jogo', legendTitle = 'Personagens' } = {}
) => {
  return vl
    .markLine({ interpolate: 'step', clip: true })
    .data(data)
    .encode(
      vl.x().fieldQ('time').title(xTitle),
      vl.y().fieldQ('quantity').scale({ domainMin: 0 }),
      vl.color().fieldN('agent'),
      vl.color().fieldN('agent').title(legendTitle).legend({ orient: 'bottom' })
    )
    .title(mainTitle)
    .transform(vl.filter(brush))
    .width(specialWidth);
};
