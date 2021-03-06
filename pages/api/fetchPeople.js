const firebaseActions = require('../../server/firebase/actions');


export default async function (req, res) {
    await firebaseActions.people.fetchPeople()
        .then((people) => {
            res.status(200).json({
                status: 'success',
                people
            });
        })
        .catch((error) => {
            console.error(error);

            res.status(500).json({
                status: 'failed'
            });
        });
}
