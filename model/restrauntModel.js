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
    let finalArray = [];
    let customer = await restrauntModel.find({ $and: [{ BookingDate: date }, { $or: [{ end: { $gt: starting }, start: { $lt: starting } }, { start: { $gte: starting, $lt: ending } }] }] })
    for (let data of customer) {
      custArr.push(data._id)
    }
    let users = await restrauntModel.find({ _id: { $in: custArr } })
    if (users.length) {
      for (let people of users) {
        peopleArr.push(people.totalGuest)
      }
      let totalPeople = peopleArr.reduce((a, b) => a + b, 0)
      let newdata = Guest + totalPeople;
      if (newdata <= 100) {
        return true
      } else {
        let filterSlot = await slots.filter(k => { return k > starting })
        for (let time of filterSlot) {
          let hour = time.split(":");
          let endHour = parseInt(hour[0]) + duration;
          let newEndTime = endHour.toString() + ":" + hour[1]
          let cust = await restrauntModel.find({ $or: [{ end: { $gt: time }, start: { $lt: time } }, { start: { $gte: time, $lte: newEndTime } }] })
          let arr = [];
          for (let data of cust) {
            arr.push(data.totalGuest)
          }
          let newTotalPeople = arr.reduce((a, b) => a + b, 0)
          let brandNewData = newTotalPeople + Guest
          if (brandNewData <= 100 && finalArray.length < 3) {
            let obj = {}
            obj.from = time;
            obj.to = newEndTime;
            finalArray.push(obj)
          }
        }
        res.send({
          responseCode: 400,
          resonseMessage: "you can select booking in these slots", finalArray
        });
      }
    } else {
      return true
    }
  }
  catch (error) {
    throw error;
  }
}

module.exports = restrauntModel