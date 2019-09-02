const firebaseActions = require('../../../server/firebase/actions');
const urls = require('../../../utils/urls');


export default async function (req, res) {
    const { key } = req.query;

    if (key != null && key.length > 0) {
        await firebaseActions.jobs.confirmSwitch(key)
            .then(() => {
                res.writeHead(302, {
                    Location: `${urls.home}?switch=success`
                });
                res.end();
            })
            .catch((error) => {
                console.error(error);

                res.writeHead(302, {
                    Location: `${urls.home}?switch=error`
                });
                res.end();
            });
    } else {
        res.writeHead(302, {
            Location: `${urls.home}?switch=error`
        });
        res.end();
    }
}
