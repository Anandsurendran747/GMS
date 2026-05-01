const cron = require("node-cron");
const GymRat = require("../Models/Member");
const whatsappService = require("./whatsapp-service");

function startExpiryChecker() {

    // runs every day at 9 AM
    cron.schedule("0 9 * * *", async () => {

        console.log("Checking expired memberships...");

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        await GymRat.updateMany(
            { feesExpiryDate: { $lt: oneWeekAgo } },
            { active: false }
        );
        const expiredMembers = await GymRat.find({
            feesExpiryDate: { $lte: oneWeekAgo },
            active: true
        });

        for (let member of expiredMembers) {

            const message = `Hello ${member.name}, your gym membership has expired. Please renew to continue training.🚨🚨🚨`;

            whatsappService.sendMessage(member.phoneNumber, message);

        }

    });

}

module.exports = startExpiryChecker;