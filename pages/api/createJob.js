const firebaseActions = require('../../server/firebase/actions');


export default async function (req, res) {
    const { job } = req.body;

    await firebaseActions.jobs.createJob(job)
        .then(() => {
            res.status(201).json({
                status: 'success'
            });
        })
        .catch((error) => {
            console.error(error);

            res.status(500).json({
                status: 'failed'
            });
        });
}
