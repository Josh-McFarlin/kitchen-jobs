const firebaseActions = require('../../server/firebase/actions');


export default async function (req, res) {
    await firebaseActions.jobs.fetchJobs()
        .then((jobs) => {
            res.status(200).json({
                status: 'success',
                jobs
            });
        })
        .catch((error) => {
            console.error(error);

            res.status(500).json({
                status: 'failed'
            });
        });
}
