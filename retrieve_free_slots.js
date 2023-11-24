const axios = require('axios');
const zlib = require('zlib'); // use zlib to decompress
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
  const data = `form-type=rooms&view=rooms&include=rooms&aula=&sede=${locationCode}&date=${date}&_lang=en&list=&week_grid_type=-1&ar_codes_=&ar_select_=&col_cells=0&empty_box=0&only_grid=0&highlighted_date=0&all_events=0&_lang=en`;


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
    // responseType: 'arraybuffer', // Axios is not able to decompress the response
    data: data,
  };

  try {
    const response = await axios(config);
    console.log(response);
    // const decompressedData = zlib.gunzipSync(response.data).toString('utf-8');
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}



/**
 * This function retrieves all available slots for a given date and location
 * per each room.
 * @param {string} date The date in the format dd-mm-yyyy.
 * @param {string} locationCode The location code for the building complex.
 */
async function retrieveSlots(date, locationCode) {
  const data = await getData(date, locationCode);
  /*
    Convert the data to a more readable format
    the new object will have the following structure:
    {
      timestamp_from: <timestamp>,
      timestamp_to: <timestamp>,
      CodiceAula: <room code>,
      NomeAula: <room name>,
      name: <lesson name>,
      orario: <time in format hh:mm - hh:mm>,
    }
  */
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

  // Create a map of rooms
  const map = new Map();
  // eslint-disable-next-line guard-for-in
  for (lesson in events) {
    if (!map.has(events[lesson].CodiceAula)) {
      map.set(events[lesson].CodiceAula,
          new Room(events[lesson].CodiceAula, events[lesson].NomeAula, date));
    }
    map.get(events[lesson].CodiceAula)
        .addLesson(events[lesson].timestamp_from, events[lesson].timestamp_to);
  }

  return map;
}

module.exports = retrieveSlots;

/*
  An example usage of the output of the function:

  // Get current date in format dd-mm-yyyy
  const giorno = new Date().toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-');
  const sede = '00280'; // Polo Gradenigo

  const rooms = await retrieveSlots(giorno, sede);
  for (const room of rooms.values()) {
    const hours = room.getFreeHours();
    for (let i = 0; i < hours.length-1; i+= 2) {
      // Multiply by 1000 to get milliseconds
      const initDate = new Date(hours[i]*1000);
      const endDate = new Date(hours[i+1]*1000);

      const hh_mm_start = `${initDate.getHours().toString().padStart(2, '0')}:${initDate.getMinutes().toString().padStart(2, '0')}`;
      const hh_mm_end = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

      console.log(
          `Room ${room.roomName} free from ${hh_mm_start} to ${hh_mm_end}`);
    }
  }
*/
