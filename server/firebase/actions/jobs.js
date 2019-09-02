const firebase = require('../index');
const sendGridActions = require('../../sendgrid/actions');
const urls = require('../../../utils/urls');


const fetchJobs = () =>
    firebase.firestore()
        .collection('jobs')
        .where('date', '>=', new Date())
        .orderBy('date')
        .get()
        .then(async (querySnapshot) => {
            const jobs = [];

            await querySnapshot.forEach((doc) => {
                jobs.push({
                    key: doc.id,
                    ...doc.data()
                });
            });

            return jobs;
        });

const fetchCompletedJobs = () =>
    firebase.firestore()
        .collection('jobs')
        .where('completed', '==', true)
        .orderBy('date', 'desc')
        .get()
        .then(async (querySnapshot) => {
            const jobs = [];

            await querySnapshot.forEach((doc) => {
                jobs.push({
                    key: doc.id,
                    ...doc.data()
                });
            });

            return jobs;
        });

const createJob = ({ date, people, title }) =>
    firebase.firestore()
        .collection('jobs')
        .add({
            completed: false,
            date: firebase.firestore.Timestamp.fromMillis(date),
            images: [],
            people,
            title
        });

const deleteJob = (key) =>
    firebase.firestore()
        .collection('jobs')
        .doc(key)
        .delete();

const editJob = async (key, job) => {
    const data = Object.assign({}, job);

    if (data.date != null) {
        data.date = firebase.firestore.Timestamp.fromMillis(data.date);
    }

    if (data.completedAt != null) {
        data.completedAt = firebase.firestore.Timestamp.fromMillis(data.completedAt);
    }

    if (data.people != null) {
        const people = data.people || [];
        const skipped = data.skipped || [];
        const stole = data.stole || [];

        data.doneBy =
            people.concat(stole)
                .filter((email) => skipped.indexOf(email) === -1);
    }

    await firebase.firestore()
        .collection('jobs')
        .doc(key)
        .set(data, {
            merge: true
        });
};


const switchRequest = async (key, switchInfo) => {
    const switchRef = await firebase.firestore()
        .collection('switchRequests')
        .add({
            job: key,
            from: switchInfo.fromEmail,
            to: switchInfo.toEmail
        });

    await sendGridActions.emails.sendSwitch({
        fromName: switchInfo.fromName,
        toName: switchInfo.toName,
        toEmail: switchInfo.toEmail,
        date: switchInfo.date,
        title: switchInfo.title,
        dueAt: switchInfo.dueAt,
        switchLink: urls.base + urls.api.confirmSwitch(switchRef.id)
    });
};

const confirmSwitch = async (key) => {
    await firebase.firestore()
        .collection('switchRequests')
        .doc(key)
        .get()
        .then(async (doc) => {
            if (doc.exists) {
                const switchData = doc.data();

                await firebase.firestore()
                    .collection('jobs')
                    .doc(switchData.job)
                    .get()
                    .then(async (jobDoc) => {
                        if (jobDoc.exists) {
                            const oldJob = jobDoc.data();

                            const people = oldJob.people || [];
                            const foundPerson = people.indexOf(switchData.from);
                            if (foundPerson !== -1) {
                                people[foundPerson] = switchData.to;
                            }

                            const switches = oldJob.switches || [];
                            switches.push({
                                from: switchData.from,
                                to: switchData.to
                            });

                            await editJob(switchData.job, {
                                people,
                                switches
                            });

                            await firebase.firestore()
                                .collection('switchRequests')
                                .doc(key)
                                .delete();
                        }
                    });
            }
        });
};

module.exports = {
    fetchJobs,
    fetchCompletedJobs,
    createJob,
    deleteJob,
    editJob,
    switchRequest,
    confirmSwitch
};
