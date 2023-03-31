/**
 * This class represents a room in the EasyStaff app.
 * The room is defined by its code, name and the free hours.
 * There are specified methods to add and remove free hours,
 * do not use them directly.
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
    this.freeHours = [
      Math.floor(start.getTime() / 1000),
      Math.floor(end.getTime() / 1000),
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
   * @param {int} startTime the epoch of the initial time.
   * @param {int} endTime the epoch of the final time.
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
}

module.exports = Room;
