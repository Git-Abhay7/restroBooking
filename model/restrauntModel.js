const moment = require("moment");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const restrauntKey = new schema(
  {
    openTime: {
      type: String,
    },
    closeTime: {
      type: String,
    },
    start: {
      type: String,
    },
    end: {
      type: String,
    },
    BookingDate: {
      type: String,
    },
    email: {
      type: String,
    },
    totalGuest: {
      type: Number
    },
    duration: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

const restrauntModel = mongoose.model("restraunt", restrauntKey, "restraunt");



restrauntModel['CustomerRes'] = async (date, starting, ending, Guest, slots, res, duration) => {
  try {
    let custArr = [];
    let peopleArr = [];
    let intervalArr = [];
    const inArray = await slots.filter(z => {
      return z == starting
    })
    let customer = await restrauntModel.find({ $and: [{ BookingDate: date }, { $or: [{ end: { $gt: starting }, start: { $lt: starting } }, { start: { $gte: starting, $lt: ending } }] }] })
    console.log("===", customer)
    for (let data of customer) {
      custArr.push(data._id)
    }
    let users = await restrauntModel.find({ _id: { $in: custArr } })
    if (users.length) {
      for (let people of users) {
        peopleArr.push(people.totalGuest)
      }
      let totalPeople = peopleArr.reduce((a, b) => a + b, 0)
      let newdataLength = Guest + totalPeople;
      let existUser = await restrauntModel.find({ start: starting })                                // if user pre exist 
      console.log()
      if (existUser.length && newdataLength <= 100 && inArray.length) {
        let existArr = []
        for (let exist of existUser) {
          existArr.push(exist.totalGuest)
        }
        let preExistGuest = existArr.reduce((a, b) => a + b, 0)
        let newSum = preExistGuest + Guest;
        if (newSum <= 20) {                                                                        // if length is less than 20 then make new login 
          return true
        }
        else {
          let array = await freeSlot(slots, duration, Guest)
          res.send({
            responseCode: 400,
            resonseMessage: "you can select booking in these slots", array
          });
        }
      } else if (inArray.length == 0) {
        const startingTime = slots.filter(k => { return k < starting }).sort((a, b) => {
          return a > b ? -1 : 1
        })[0]
        let hour = startingTime.split(":");
        let addHour = parseInt(hour[1]) + 15;
        const endingtime = hour[0] + ":" + addHour.toString()
        let intervalUser = await restrauntModel.find({ start: { $gt: startingTime, $lt: endingtime } })
        for (let data of intervalUser) {
          intervalArr.push(data.totalGuest)
        }
        let intRes = intervalArr.reduce((a, b) => a + b, 0)
        let newIntRes = intRes + Guest;
        if (newdataLength <= 100 && newIntRes <= 20) {
          return true
        } else {
          let array = await freeSlot(slots, duration, Guest)
          res.send({
            responseCode: 400,
            resonseMessage: "you can select booking in these slots", array
          });
        }
      } else if (inArray.length) {
        if (newdataLength <= 100) {
          return true
        } else {
          let array = await freeSlot(slots, duration, Guest)
          res.send({
            responseCode: 400,
            resonseMessage: "you can select booking in these slots", array
          });
        }
      }
    } else {
      return true
    }
  }
  catch (error) {
    throw error;
  }
}

module.exports = restrauntModel;

async function freeSlot(timeSlot, Duration, guest) {
  try {
    let finalArray = [];
    for (let time of timeSlot) {
      let hour = time.split(":");
      let endHour = parseInt(hour[0]) + Duration;
      let newEndTime = endHour.toString() + ":" + hour[1];
      let cust = await restrauntModel.find({ $or: [{ end: { $gt: time }, start: { $lt: time } }, { start: { $gte: time, $lt: newEndTime } }] })
      let arr = [];
      let newArr = [];
      for (let data of cust) {
        arr.push(data.totalGuest)
      }
      let newTotalPeople = arr.reduce((a, b) => a + b, 0)
      let brandNewData = newTotalPeople + guest;
      let existUser = await restrauntModel.find({ start: time })
      if (existUser.length && brandNewData <= 100) {
        for (let data of existUser) {
          newArr.push(data.totalGuest)
        }
        let preExistGuest = newArr.reduce((a, b) => a + b, 0)
        let newSum = preExistGuest + guest;
        if (finalArray.length < 3 && newSum <= 20) {
          let obj = {}
          obj.from = time;
          obj.to = newEndTime;
          finalArray.push(obj)
        }
      }
      else {
        if (finalArray.length < 3 && brandNewData <= 100) {
          let obj = {}
          obj.from = time;
          obj.to = newEndTime;
          finalArray.push(obj)
        }
      }
    }
    return finalArray
  } catch (error) {
    throw error
  }
}
