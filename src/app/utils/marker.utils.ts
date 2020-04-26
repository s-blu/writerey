import { MarkerDefinition } from 'src/app/models/markerDefinition.class';

export function sortMarkerArray(markerArray, markerDefinitions) {
  if (!markerDefinitions) return markerArray;
  markerArray.sort((a, b) => {
    const defA = markerDefinitions.find(m => m.id === a.id) || ({} as any);
    const defB = markerDefinitions.find(m => m.id === b.id) || ({} as any);

    return sortMarkerDefinitions(defA, defB, a.valueId, b.valueId);
  });
}

export function sortMarkerDefinitions(
  markerDefA: MarkerDefinition,
  markerDefB: MarkerDefinition,
  valueIdA?: string,
  valueIdB?: string
) {
  const indexA = markerDefA.index;
  const indexB = markerDefB.index;
  // markers with index should appear before markers without
  if (isIndexAvailable(indexA) || isIndexAvailable(indexB)) {
    if (!isIndexAvailable(indexA)) {
      return 1;
    } else if (!isIndexAvailable(indexB)) {
      return -1;
    } else if (indexA === indexB) {
      // if both indexes are equal, sort lexically
      return compareName(markerDefA, markerDefB, valueIdA, valueIdB);
    } else {
      return indexA < indexB ? -1 : 1;
    }
  } else {
    // if both definitions have no index, sort lexically
    return compareName(markerDefA, markerDefB, valueIdA, valueIdB);
  }

  function compareName(markerDefA, markerDefB, valueIdA?, valueIdB?) {
    let compareResult = compareStringsLexically(markerDefA.name, markerDefB.name);

    if (compareResult === 0) {
      const nameValueA = markerDefA.values.find(v => v.id === valueIdA)?.name;
      const nameValueB = markerDefB.values.find(v => v.id === valueIdB)?.name;

      compareResult = compareStringsLexically(nameValueA, nameValueB);
    }

    return compareResult;

    function compareStringsLexically(stringA, stringB) {
      return stringA < stringB ? -1 : stringA > stringB ? 1 : 0;
    }
  }

  function isIndexAvailable(index) {
    return index || index === 0;
  }
}
