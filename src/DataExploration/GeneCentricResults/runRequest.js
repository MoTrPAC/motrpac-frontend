import axios from 'axios';

export default async function runRequest(searchTerm, searchContext) {
  try {
    const geneData = await axios.get(`/api/${searchContext}/${searchTerm}`);
    // collect all unique feature_ids
    const featureIds =
      geneData && geneData.data && geneData.data.length
        ? geneData.data.reduce((acc, item) => {
            if (!acc.includes(item._source.feature_id)) {
              acc.push(item._source.feature_id);
            }
            return acc;
          }, [])
        : [];

    // set up requests for each unique feature_id
    const requests = featureIds.map((featureId) =>
      axios.get(`/api/dea/${featureId}`)
    );

    // wait for all requests to complete
    const deaData = await axios.all(requests).then(
      axios.spread((...args) => {
        return args.map((item) => item.data);
      })
    );

    // set up variables for returned data
    const featureResults = [];
    let totalHits = 0;

    // loop through results returned from each request
    // concatenate results into single array
    deaData.forEach((item) => {
      if (item.hits && item.hits.hits && item.hits.hits.length) {
        featureResults.push(...item.hits.hits);
        totalHits += item.hits.total.value;
      }
    });

    // return the data
    return {
      hits: {
        total: {
          value: totalHits,
        },
        hits: featureResults,
      },
    };
  } catch (err) {
    console.log(err);
  }
}
