let {Screen} = require('./../models/book');

//function to check if given seats are available to be booked.
let isAvailable = (screenName, seats) => {

  return new Promise((resolve, reject) => {
    Screen.findOne({name: screenName}).then((screen) => {
      if(!screen) return reject("No such screen exist")
      for (var row in seats) {
        //  console.log(seats)
        let actualRow = screen.seatInfo.get(row);
//console.log(screen)
       // console.log(row)
       // console.log(actualRow)
        if(!actualRow) return reject("No such row exist in this screen");
        let numberOfSeats = actualRow.numberOfSeats;
        //console.log(numberOfSeats)
        let reservedSeats = actualRow.reservedSeats;
        //console.log(reservedSeats)
        let seatsToReserve = seats[row];
        //console.log(seatsToReserve)
        var reservedSeatsSet = new Set(reservedSeats);
        for(i in seatsToReserve){
          if (seatsToReserve[i] >= numberOfSeats) {
            return reject("Please enter correct seat number. "+
            "Given seat number exceeds total number of seat in given row");
          }
          if (reservedSeatsSet.has(seatsToReserve[i])) {
            return reject("This seat is already reserved. Please try with some other seat!!");
          }
        }
        screen.seatInfo.get(row).reservedSeats.push(...seatsToReserve);
      }
      screen.save().then((scr) => {
        if(!scr){
          return reject("Failed to save changes in screen during reservation");
        }
        return resolve();
      });
    }, (err) => {
      return reject(err);
    });
  });

};

module.exports = {isAvailable};