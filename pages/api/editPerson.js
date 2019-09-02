const firebaseActions = require('../../server/firebase/actions');


export default async function (req, res) {
    const { email, data } = req.body;

    await firebaseActions.people.editPerson(email, data)
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
