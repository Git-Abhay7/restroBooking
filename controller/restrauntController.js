var restraunt = require("../model/restrauntModel");
const bcrypt = require("bcrypt");

module.exports = {
    custReservation: async (req, res) => {
        try {
            let result = await restraunt.CustomerRes(req.body.BookingDate, req.body.start, req.body.end, req.body.totalGuest,res)
            if (result == true) {
                let finalData = await new restraunt(req.body).save();
                delete finalData.openTime ,finalData.closeTime;
                res
                    .send({
                        responseCode: 200,
                        resonseMessage: "Your Table Booked Successfully.", finalData
                    });
            }
            // const moment = require("moment")
            // let startTime = moment(req.body.openTime, 'HH:mm');
            // let endTime = moment(req.body.closeTime, 'HH:mm');
            // let timeSlots = [];
            // while(startTime <= endTime){
            //     timeSlots.push(new moment(startTime).format('HH:mm'));
            //     startTime.add(15, 'minutes');
            // }
            // console.log('timeStops ', timeSlots)
            // res
            //     .send({
            //         responseMessage: "time_slot", timeSlots
            //     });
        } catch (error) {
            throw error
        }
    }
};