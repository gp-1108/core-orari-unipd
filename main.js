/**
 * Created by gp-1008 on 24/11/2023
 * @function: main.js
 * @description: This file is the main file of the project, it contains the main function
 * in which not only you see free slots, but also you see if any of the slots are
 * available at your given time.
 */

const retrieveSlots = require('./retrieve_free_slots');
const {getFormattedHoursMinutes} = require('./utility');

// Get current date in format dd-mm-yyyy
const giorno = new Date().toLocaleDateString('it-IT', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}).replace(/\//g, '-');
const sede = '00280'; // Polo Gradenigo

// Printing the free slots
retrieveSlots(giorno, sede).then((map) => {
  for (const room of map.values()) {
    const hours = room.getFreeHours();
    for (let i = 0; i < hours.length-1; i+= 2) {
      // Multiply by 1000 to get milliseconds
      const initDate = new Date(hours[i]*1000);
      const endDate = new Date(hours[i+1]*1000);

      const initHHMM = getFormattedHoursMinutes(initDate);
      const endHHMM = getFormattedHoursMinutes(endDate);

      console.log(`Room ${room.roomName} free from ${initHHMM} to ${endHHMM}`);
    }
  }
});
