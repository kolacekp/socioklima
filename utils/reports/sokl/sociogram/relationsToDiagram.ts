import consumers from 'stream/consumers';
import { attribute as _, Digraph, Subgraph, Node, Edge, toDot } from 'ts-graphviz';
import { toStream } from '@ts-graphviz/adapter';
import { Pupils, PupilName, PupilGender, GenderColor, Layer, LayerColor, Relations } from './index.model';

const genderCodeToColor = (code: PupilGender): GenderColor => {
  const colors: { [key: PupilGender]: GenderColor } = {
    0: 'gray',
    1: 'lightblue',
    2: 'pink',
    3: 'green'
  };
  return colors[code];
};

const layerToColor = (layer: Layer): LayerColor => {
  const colors: { [key in Layer]: LayerColor } = {
    positive: '#FFC107',
    negative: '#000000',
    aspirational: '#1E90FF'
  };
  return colors[layer];
};

const generateSubgraph = (layer: Layer, relations: Relations, isVisible: boolean, graph: Digraph): Subgraph => {
  const S = new Subgraph(layer);
  Object.entries(relations).map(([from, classmates]) =>
    classmates.map((classmate: PupilName) => {
      const E = new Edge([graph.getNode(from)!, graph.getNode(classmate)!], {
        [_.color]: isVisible ? layerToColor(layer) : 'invis',
        [_.arrowsize]: 1.5,
        [_.penwidth]: 2.0,
        [_.dir]: relations[classmate].includes(from) ? 'both' : 'forward'
      });
      S.addEdge(E);
    })
  );
  return S;
};

const generateGraph = (
  pupils: Pupils,
  relations: {
    positive: Relations;
    negative: Relations;
    aspirational: Relations;
  },
  layer: Layer
): string => {
  const G = new Digraph('sociogram', true, {
    [_.layout]: 'circo',
    [_.overlap]: false,
    [_.concentrate]: true
  });
  Object.values(pupils)
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(({ gender, name }) => {
      const N = new Node(name, {
        [_.shape]: 'box',
        [_.style]: 'filled',
        [_.fillcolor]: genderCodeToColor(gender)
      });
      G.addNode(N);
    });
  G.addSubgraph(generateSubgraph('positive', relations.positive, layer === 'positive', G));
  G.addSubgraph(generateSubgraph('negative', relations.negative, layer === 'negative', G));
  G.addSubgraph(generateSubgraph('aspirational', relations.aspirational, layer === 'aspirational', G));
  const dot = toDot(G);
  return dot;
};

export const diagramLayerToPngAsBase64 = async (
  pupils: Pupils,
  relations: {
    positive: Relations;
    negative: Relations;
    aspirational: Relations;
  },
  layer: Layer
): Promise<string> => {
  const dotString = generateGraph(pupils, relations, layer);
  const stream = await toStream(dotString, { format: 'png', layout: 'circo' });
  const buffer = await consumers.buffer(stream);
  const base64 = buffer.toString('base64');
  return base64;
};
