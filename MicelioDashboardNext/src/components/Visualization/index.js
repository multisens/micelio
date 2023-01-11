import * as vl from 'vega-lite-api';
import embed from 'vega-embed';
import { useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import { GraphFactory } from './Graphs/graphs';
import GraphicStrategy from '../../strategies/GraphicStrategy';

const Visualization = ({ activities, config }) => {
  useEffect(() => {
    if (!config || !config.graphs || !activities) return;

    const graphicStrategy = new GraphicStrategy(new GraphFactory(config));
    const graphicsList = [];

    for (const graph of config.graphs) {
      const graphicsFunction = graphicStrategy.getGraphicConstructor(graph.type);
      if (typeof graphicsFunction === 'function') {
        graphicsList.push(graphicsFunction(activities, graph));
      }
    }

    const visualization = vl.vconcat(graphicsList);

    embed('#visualization', JSON.parse(visualization));
  }, [activities, config]);

  return (
    <>
      <Flex id={'visualization'}></Flex>
    </>
  );
};

export default Visualization;
