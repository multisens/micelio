export default class GraphicStrategy {
  constructor(graphicFactory) {
    this.graphicFactory = graphicFactory;
  }

  getGraphicConstructor(graphicType) {
    return {
      Timeline: this.graphicFactory.GetTimeline.bind(this.graphicFactory),
      ActivityList: this.graphicFactory.GetActivitiesCircle.bind(this.graphicFactory),
      HeatMap: this.graphicFactory.GetHeatMap.bind(this.graphicFactory),
      Population: this.graphicFactory.GetPopulation.bind(this.graphicFactory),
    }[graphicType];
  }
}
