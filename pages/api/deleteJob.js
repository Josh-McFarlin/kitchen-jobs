const firebaseActions = require('../../server/firebase/actions');


export default async function (req, res) {
    const { key } = req.body;

    await firebaseActions.jobs.deleteJob(key)
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
