function getValueFacet(aggregations, fieldName) {
  if (
    aggregations &&
    aggregations[fieldName] &&
    aggregations[fieldName].buckets &&
    aggregations[fieldName].buckets.length > 0
  ) {
    return [
      {
        field: fieldName,
        type: 'value',
        data: aggregations[fieldName].buckets.map((bucket) => ({
          // Boolean values and date values require using `key_as_string`
          value: bucket.key_as_string || bucket.key,
          count: bucket.doc_count,
        })),
      },
    ];
  }
}

function getRangeFacet(aggregations, fieldName) {
  if (
    aggregations &&
    aggregations[fieldName] &&
    aggregations[fieldName].buckets &&
    aggregations[fieldName].buckets.length > 0
  ) {
    return [
      {
        field: fieldName,
        type: 'range',
        data: aggregations[fieldName].buckets.map((bucket) => ({
          // Boolean values and date values require using `key_as_string`
          value: {
            to: bucket.to,
            from: bucket.from,
            name: bucket.key,
          },
          count: bucket.doc_count,
        })),
      },
    ];
  }
}

export default function buildStateFacets(aggregations) {
  const tissues = getValueFacet(aggregations, 'tissue');
  const assays = getValueFacet(aggregations, 'assay');
  const sex = getValueFacet(aggregations, 'sex');
  const adj_p_value = getRangeFacet(aggregations, 'adj_p_value');
  const zscore = getRangeFacet(aggregations, 'zscore');

  const facets = {
    ...(tissues && { tissues }),
    ...(assays && { assays }),
    ...(sex && { sex }),
    ...(adj_p_value && { adj_p_value }),
    ...(zscore && { zscore }),
  };

  if (Object.keys(facets).length > 0) {
    return facets;
  }
}
