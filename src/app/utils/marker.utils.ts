import { MarkerDefinition } from 'src/app/models/markerDefinition.class';

export function sortMarkerArray(markerArray, markerDefinitions) {
  console.log('================>')
  console.log('sortMarkerArray', markerArray, markerDefinitions)
  if (!markerDefinitions) return markerArray;
  markerArray.sort((a, b) => {
    const defA = markerDefinitions.find(m => m.id === a.id) || ({} as any);
    const defB = markerDefinitions.find(m => m.id === b.id) || ({} as any);
    return sortMarkerDefinitions(defA, defB);
  });
}

export function sortMarkerDefinitions(markerDefA: MarkerDefinition, markerDefB: MarkerDefinition) {
  console.log('===============================');
  const indexA = markerDefA.index;
  const indexB = markerDefB.index;
  console.log('sortMarkerDefinitions', markerDefA.name, indexA, markerDefB.name, indexB);
  // markers with index should appear before markers without
  if (isIndexAvailable(indexA) || isIndexAvailable(indexB)) {
    console.log('at least one index available, sorting after index');
    if (!isIndexAvailable(indexA)) {
      console.log('indexA undefined, return 1');
      return 1;
    } else if (!isIndexAvailable(indexB)) {
      console.log('indexB undefined, return -1');
      return -1;
    } else if (indexA === indexB) {
      console.log('indexes are equal, decide via name', compareName(markerDefA, markerDefB));
      // if both indexes are equal, sort lexically
      return compareName(markerDefA, markerDefB);
    } else {
      console.log('decide via index', indexA < indexB ? -1 : 1);
      return indexA < indexB ? -1 : 1;
    }
  } else {
    console.log('no index available, sorting after name', compareName(markerDefA, markerDefB));
    // if both definitions have no index, sort lexically
    return compareName(markerDefA, markerDefB);
  }

  function compareName(markerDefA, markerDefB) {
    return markerDefA.name < markerDefB.name ? -1 : markerDefA.name > markerDefB.name ? 1 : 0;
  }

  function isIndexAvailable(index) {
    return index || index === 0;
  }
}
