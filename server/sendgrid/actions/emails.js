const sgMail = require('../index');


const sendSwitch = async ({ fromName, toName, toEmail, date, title, dueAt, switchLink }) => {
    const msg = {
        to: toEmail,
        from: 'meal@mcfarl.in',
        subject: `Kitchen Job Switch Request: ${title} on ${date}`,
        html: `
            <div>Hello ${toName},</div>
            <div>&nbsp;</div>
            <div>${fromName} wants you to take his kitchen job.</div>
            <ul>
                <li>Date: ${date}</li>
                <li>Job: ${title}</li>
                <li>Due at: ${dueAt}</li>
            </ul>
            <div>&nbsp;</div>
            <div style="text-align: center;"><a href="${switchLink}">If you would like to take this job, click this link.</a></div>
            <div style="text-align: center;">Otherwise, ignore this email.</div>
        `
    };

    await sgMail
        .send(msg)
        .catch((error) => {
            console.error('Failed to send switch email!', error);
        });
};

module.exports = {
    sendSwitch
};
