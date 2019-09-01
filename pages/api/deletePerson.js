const firebaseActions = require('../../server/firebase/actions');


export default async function (req, res) {
    const { email } = req.body;

    await firebaseActions.people.deletePerson(email)
        .then(() => {
            res.status(201).json({
                status: 'success'
            });
        })
        .catch(() => {
            res.status(500).json({
                status: 'failed'
            });
        });
}
