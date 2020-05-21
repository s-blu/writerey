import { LabelDefinition } from 'src/app/models/labelDefinition.class';

export function sortLabelArray(labelArray, labelDefinitions) {
  if (!labelDefinitions) return labelArray;
  labelArray.sort((a, b) => {
    const defA = labelDefinitions.find(m => m.id === a.id) || ({} as any);
    const defB = labelDefinitions.find(m => m.id === b.id) || ({} as any);

    return sortLabelDefinitions(defA, defB, a.valueId, b.valueId);
  });
}

export function sortLabelDefinitions(
  labelDefA: LabelDefinition,
  labelDefB: LabelDefinition,
  valueIdA?: string,
  valueIdB?: string
) {
  const indexA = labelDefA.index;
  const indexB = labelDefB.index;
  // labels with index should appear before labels without
  if (isIndexAvailable(indexA) || isIndexAvailable(indexB)) {
    if (!isIndexAvailable(indexA)) {
      return 1;
    } else if (!isIndexAvailable(indexB)) {
      return -1;
    } else if (indexA === indexB) {
      // if both indexes are equal, sort lexically
      return compareName(labelDefA, labelDefB, valueIdA, valueIdB);
    } else {
      return indexA < indexB ? -1 : 1;
    }
  } else {
    // if both definitions have no index, sort lexically
    return compareName(labelDefA, labelDefB, valueIdA, valueIdB);
  }

  function compareName(labelDefA, labelDefB, valueIdA?, valueIdB?) {
    let compareResult = compareStringsLexically(labelDefA.name, labelDefB.name);

    if (compareResult === 0) {
      const nameValueA = labelDefA.values?.find(v => v.id === valueIdA)?.name;
      const nameValueB = labelDefB.values?.find(v => v.id === valueIdB)?.name;

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

export function getReadableNameForLabelContext(context, labelDefs) {
  if (!labelDefs) return context;
  if (context?.includes(':')) {
    const [labelId, valueId] = context.split(':');
    const labelDef = labelDefs.find(m => m.id === labelId);
    const valueName = labelDef?.values?.find(v => v.id === valueId)?.name;
    return `[${labelDef?.name}] ${valueName}`;
  } else {
    return context;
  }
}
