/* eslint-disable max-len */
/**
 * This class represents a room in the EasyStaff app.
 * The room is defined by its code, name and the free hours.
 * There are specified methods to add and remove free hours,
 * do not use them directly.
  * The members of the class are:
  * - roomCode: the code of the room
  * - roomName: the name of the room
  * - freeHours: an array of free hours, in the format [start, end, start, end, ...] (seconds epochs italian time)
 */
class Room {
  /**
   * This class represents a room in the EasyStaff app
   * @param {string} roomCode CodiceAula.
   * @param {string} roomName NomeAula.
   * @param {string} date Date in forma DD-MM-YYYY.
   */
  constructor(roomCode, roomName, date) {
    // convert from DD-MM-YYYY to YYYY-MM-DD
    date = date.split('-').reverse().join('-');
    const start = new Date(`${date}T08:30:00`);
    const end = new Date(`${date}T18:30:00`);
    this.roomCode = roomCode;
    this.roomName = roomName;
    // Dividing by 1000 to get seconds
    this.freeHours = [
      start.getTime() / 1000,
      end.getTime() / 1000,
    ];
  }

  /**
   * This method returns the free hours of the room.
   * @return {Array} Array of free hours.
   * The format is [start, end, start, end, ...]
   */
  getFreeHours() {
    return this.freeHours;
  }

  /**
   * This methods adds a lesson to the room,
   * removing the free hours.
   * @param {int} S the epoch of the initial time.
   * @param {int} E the epoch of the final time.
   */
  addLesson(S, E) {
    for (let i = 0; i < this.freeHours.length - 1; i += 2) {
      if (this.freeHours[i] < S && this.freeHours[i+1] > S && this.freeHours[i+1] <= E) {
        // Partially sovrapposed, it is needed to adjust the upper bound
        this.freeHours.splice(i+1, 1, S);
      } else if (this.freeHours[i] < S && this.freeHours[i+1] > E) {
        // This lesson divided in two my free slot
        const temp = this.freeHours[i+1];
        this.freeHours.splice(i+1, 1, S, E, temp);
      } else if (this.freeHours[i] == S && this.freeHours[i+1] <= E) {
        // This lesson completely covers this free time
        this.freeHours.splice(i, 2);
        i -= 2;
      } else if (this.freeHours[i] == S && this.freeHours[i+1] > E) {
        // This lesson partially obscures this freetime, only at the end something is left
        const temp = this.freeHours[i+1];
        this.freeHours.splice(i, 2, E, temp);
      } else if (this.freeHours[i] > S && this.freeHours[i+1] == E) {
        // This lesson completely covers this free time
        this.freeHours.splice(i, 2);
        i -= 2;
      } else if (this.freeHours[i] > S && this.freeHours[i] < E && this.freeHours[i+1] > E) {
        // This lesson partially cover this free time, some time is left at the end
        const temp = this.freeHours[i+1];
        this.freeHours.splice(i, 2, E, temp);
      } else if (this.freeHours[i] >= E) {
        // I am looking too far, no free slots from now on is any of my business
        break;
      }
    }
  }

  /**
   * This method checks if the room is available at the given date.
   * (It is meant to be used with the output of the function retrieveSlots)
   * @param {Date} date A JS Date object for which
   * you want to know if the room is available
   * @return {boolean} True if the room is available at the given date, false otherwise
   */
  isAvailableAt(date) {
    // Dividing by 1000 to get seconds
    const dateEpoch = date.getTime() / 1000;

    for (let i = 0; i < this.freeHours.length - 1; i += 2) {
      if (this.freeHours[i] <= dateEpoch && this.freeHours[i+1] >= dateEpoch) {
        return true;
      }
    }
    return false;
  }
}

module.exports = Room;
