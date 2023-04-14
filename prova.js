const fs = require('fs');
const axios = require('axios');
const Room = require('./Room.js');

/**
 * This function gets the data from the EasyStaff API
 * returning the raw json response
 * @param {string} date the date in the format dd-mm-yyyy.
 * @param {string} locationCode the location code
 * it can be found in the json file in the section "raggruppamenti".
 * @return {object} the raw json response
 */
async function getData(date, locationCode) {
  // eslint-disable-next-line max-len
  const data = `form-type=rooms&view=rooms&include=rooms&aula=&sede=${sede}&date=${giorno}&_lang=en&list=&week_grid_type=-1&ar_codes_=&ar_select_=&col_cells=0&empty_box=0&only_grid=0&highlighted_date=0&all_events=0&_lang=en`;

  const config = {
    method: 'post',
    url: 'https://agendastudentiunipd.easystaff.it/rooms_call.php',
    headers: {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'same-origin',
      'DNT': '1',
      'Sec-GPC': '1',
      'TE': 'trailers',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
    },
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Get current date in format dd-mm-yyyy
let giorno = new Date().toLocaleDateString('it-IT', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}).replace(/\//g, '-');
const sede = '00280'; // Polo Gradenigo

// giorno = '31-03-2023';


getData(giorno, sede).then((data) => {
  const events = data['events'].map((eventRoom) => {
    return {
      timestamp_from: eventRoom['timestamp_from'],
      timestamp_to: eventRoom['timestamp_to'],
      CodiceAula: eventRoom['CodiceAula'],
      NomeAula: eventRoom['NomeAula'],
      name: eventRoom['name'],
      orario: eventRoom['orario'],
    };
  });

  fs.writeFileSync('./data.json', JSON.stringify(events, null, 2), (err) => {
    if (err) {
      console.log(err);
    }
  });

  // Testing
  const map = new Map();
  // eslint-disable-next-line guard-for-in
  for (lesson in events) {
    if (!map.has(events[lesson].CodiceAula)) {
      map.set(events[lesson].CodiceAula,
          new Room(events[lesson].CodiceAula, events[lesson].NomeAula, giorno));
    }
    map.get(events[lesson].CodiceAula)
        .addLesson(events[lesson].timestamp_from, events[lesson].timestamp_to);
  }


  fs.writeFileSync('available.json',
      JSON.stringify(Object.fromEntries(map), null, 2), (err) => {
        if (err) {
          console.log(err);
        }
      });

  return events;
});
