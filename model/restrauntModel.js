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
    // let customer = await restrauntModel.find({ $and: [{ BookingDate: date }, { $or: [{ end: { $gt: starting } }, { start: { $gte: starting } }] }] })
    // let customer = await restrauntModel.find({ BookingDate: date, end: { $gt: starting } })
    console.log("HERE===============>>>>>>>>>>>>>>>>>>>>>>>>", date, starting, ending, Guest, slots, duration)

    let customer = await restrauntModel.find({ $and: [{ BookingDate: date }, { $or: [{ end: { $gt: starting } }, { start: { $gte: starting, $lte: ending } }] }] })
    for (let data of customer) {
      custArr.push(data._id)
    }
    console.log("CUST ARRAY-====================>>>>", custArr)
    // let users = await restrauntModel.find({ _id: { $in: custArr }, start: { $gte: starting } , end : { $lte : ending}})
    let users = await restrauntModel.find({ _id: { $in: custArr } })
    if (users.length) {
      console.log("HERE======================================>>>>>>>>>>>>>>>>>>>>>>>>")
      for (let people of users) {
        peopleArr.push(people.totalGuest)
      }
      let totalPeople = peopleArr.reduce((a, b) => a + b, 0)
      console.log("============>>>",totalPeople)
      let newdata = Guest + totalPeople;
      if (newdata <= 100) {
        console.log("IDHARRRRRRRRRRRRRRRRRRRRRRRRRRRRr")
        return true
      } else {
        // could be a function
        let filterSlot = await slots.filter(k => { return k > starting })
        console.log("filter shot =====================>>>",filterSlot)
        for (let a of filterSlot) {
          let spl =  a.split(":");
          let A = parseInt(spl[0]) + duration;
          console.log(duration,"======AAAAAAAAAAAAAAAAA===============>>>>AAAAAAAAAAAAA------------",A)

          // console.log(duration,"=======AAAAAAAAAAA================>>>>a------------",a,"============",A.add(1, 'hours').format('HH:mm'),"========*********=",A)
          let b = A.toString()+ ":" +spl[1]
          console.log(duration,"======BBBBBBBBBBB===============>>>>b------------",a,"====",b)

          if (b > a) {
            let cust = await restrauntModel.find({ end: { $gt: a } }, { start: { $gte: a, $lte: b } })
            let newTotalPeople = cust.totalGuest.reduce((a, b) => a + b, 0)
            let brandNewData = newTotalPeople + Guest
            if (brandNewData <= 100) {
              let obj = {}
              obj.from = a;
              obj.to = b;
              finalArray.push(obj)
            }
          }
          // let newSlot = await restrauntModel.find({ end: { $gt: starting, lte: "23:00" } })
          // if (newSlot.length) {
          //   for (let k of newSlot) {
          //     if (k.totalPeople <= Guest) {

          //     }
          //   }

          //   // res.send({
          //   //   responseCode: 400,
          //   //   resonseMessage: "you can select booking in these slots"
          //   // });
          // }
          // else {
          //   console.log("soryy we dont have slots")

          // }
        }
        res.send({
          responseCode: 400,
          resonseMessage: "you can select booking in these slots", finalArray
        });
        // return finalArray;
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