const functions = require('firebase-functions');

const admin = require('./admin');
const sgMail = require('./sendgrid');


exports.scheduledFunctionCrontab = functions.pubsub
    .schedule('8 00 * * *') // Run every day at 8:00am
    .timeZone('America/New_York')
    .onRun(async (context) => {
        const startDay = new Date();
        startDay.setHours(0, 0, 0, 0);

        const endDay = new Date();
        endDay.setHours(23, 59, 59, 999);

        const dateString = `${startDay.getMonth()}-${startDay.getDay()}-${startDay.getFullYear()}`;

        await admin.firestore()
            .collection('jobs')
            .where('completed', '==', false)
            .where('dueDate', '>', startDay)
            .where('dueDate', '<', endDay)
            .orderBy('date', 'desc')
            .get()
            .then(async (querySnapshot) => {
                const jobs = [];

                await querySnapshot.forEach(async (doc) => {
                    const { title, date, people } = doc.data();

                    const peopleObj = people.map((item) => ({
                        email: item
                    }));

                    const dateObj = date.toDate();
                    const dueAt = dateObj.toLocaleTimeString('en-US');

                    const msg = {
                        to: peopleObj,
                        from: 'meal@mcfarl.in',
                        subject: `Kitchen Job Today (${dateString})`,
                        html: `
                            <div>Hello,</div>
                            <div>&nbsp;</div>
                            <div>This is a reminder that you have a kitchen job today!</div>
                            <ul>
                                <li>Date: ${dateString}</li>
                                <li>Job: ${title}</li>
                                <li>Due at: ${dueAt}</li>
                            </ul>
                            <div>&nbsp;</div>
                            <div>When you are done with your job, remember to contact a kitchen manager to check-off your job!</div>
                        `
                    };

                    await sgMail
                        .send(msg, true)
                        .catch((error) => {
                            console.error('Failed to send job email!', error);
                        });
                });

                return jobs;
            });

        return null;
    });
