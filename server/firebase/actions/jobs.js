const firebase = require('../index');


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

const editJob = async (key, { date, completedAt, ...rest }) => {
    const data = rest;

    if (date != null) {
        data.date = firebase.firestore.Timestamp.fromMillis(date);
    }

    if (completedAt != null) {
        data.completedAt = firebase.firestore.Timestamp.fromMillis(completedAt);
    }

    await firebase.firestore()
        .collection('jobs')
        .doc(key)
        .set(data, {
            merge: true
        });
};

module.exports = {
    fetchJobs,
    fetchCompletedJobs,
    createJob,
    deleteJob,
    editJob
};
