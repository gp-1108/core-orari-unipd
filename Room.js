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
  addLesson(startTime, endTime) {
    const newFreeHours = [];

    // Where can I insert the lesson?
    let startIndex = 0;

    for (; this.freeHours[startIndex] < startTime; startIndex++);

    let endIndex = startIndex;

    for (; this.freeHours[endIndex] < endTime; endIndex++);

    for (let i = 0; i < startIndex; i++) {
      newFreeHours.push(this.freeHours[i]);
    }
    newFreeHours.push(startTime);

    if (startIndex == endIndex) {
      newFreeHours.push(endTime);
    }

    for (let i = endIndex; i < this.freeHours.length; i++) {
      newFreeHours.push(this.freeHours[i]);
    }

    if (this.roomName == 'Ke') {
      console.log(`Iteration ${startTime} ${endTime}`);
      console.log(`${startIndex} ${endIndex}`);
      console.log(this.freeHours);
      console.log(newFreeHours);
    }

    this.freeHours = newFreeHours;
  }
}

module.exports = Room;
