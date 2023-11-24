const axios = require('axios');

/**
 * This function retrieves all available locations
 * with their respective codes.
 * @return {string} An object containing the response data
 * or null if an error occurs.
 * The response is a string of literal javascript code,
 * the interesting part is the array of locations, which is the first array.
 */
async function getAPIData() {
  const config = {
    method: 'get',
    url: 'https://agendastudentiunipd.easystaff.it/combo.php?sw=rooms_&_=1700852769317',
    headers: {
      // eslint-disable-next-line max-len
      'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://agendastudentiunipd.easystaff.it/index.php?view=rooms&include=rooms&_lang=en',
      'X-Requested-With': 'XMLHttpRequest',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'DNT': '1',
      'Sec-GPC': '1',
      'TE': 'trailers',
      'Host': 'agendastudentiunipd.easystaff.it',
    },
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

/**
 * This function retrieves all available locations. It returns an array of objects,
 * each one with its name and code.
 * @return {Array} An array of locations, each one with its code
 * Format: [{name: 'Polo Gradenigo', code: '00280'}, ...]
 */
async function retrieveLocations() {
  const data = await getAPIData();
  /*
    Given the response data, the locations are in the first array.
    To look for it and parse it correctly, we need to find the first and last
    open bracket [ and ]. Then we can parse it as JSON.
  */
  const firstOpenBracket = data.indexOf('[');
  const lastOpenBracket = data.indexOf(']');

  const locationsString = data.substring(firstOpenBracket, lastOpenBracket+1);
  let locations = JSON.parse(locationsString);
  locations = locations.map((location) => {
    return {
      name: location['label'],
      code: location['valore'],
    };
  });
  return locations;
}

module.exports = retrieveLocations;
