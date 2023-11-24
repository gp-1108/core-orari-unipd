/**
 * @author gp-1108
 * @date 24/11/2023
 * @description This file contains the utility functions used in the project.
 * Some of them are used for many reasons, if they were not fitting in the
 * other files they were collected here
 */

/**
 * This function given a JS Date object returns the time in format hh:mm
 * @param {Date} date A JS Date object
 * @return {string} The time in format hh:mm
 */
function getFormattedHoursMinutes(date) {
  hours = date.getHours().toString().padStart(2, '0');
  minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

module.exports = {
  getFormattedHoursMinutes,
};
