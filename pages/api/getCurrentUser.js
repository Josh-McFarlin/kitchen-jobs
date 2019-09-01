const _ = require('lodash');

const admin = require('../../server/firebase');
const firebaseActions = require('../../server/firebase/actions');


export default async function (req, res) {
    const sessionCookie = req.body.session;

    if (_.isString(sessionCookie) && !_.isEmpty(sessionCookie)) {
        // Verify the session cookie
        await admin.auth()
            .verifySessionCookie(sessionCookie, false)
            .then(async (decodedClaims) => {
                const emails = decodedClaims.firebase.identities.email;

                if (emails.length > 0) {
                    await firebaseActions.people.fetchPerson(emails[0])
                        .then((person) => {
                            res.status(200)
                                .json({
                                    status: 'success',
                                    user: {
                                        isUser: true,
                                        ...person
                                    }
                                });
                        })
                        .catch((error) => {
                            console.error(error);

                            res.status(500).json({
                                status: 'failed',
                                user: {
                                    isUser: false
                                }
                            });
                        });
                } else {
                    console.error('Tried to fetch a user without pre-existing data in database!');

                    res.status(500).json({
                        status: 'failed',
                        user: {
                            isUser: false
                        }
                    });
                }
            })
            .catch((error) => {
                console.error(error);

                res.status(500).json({
                    status: 'failed',
                    user: {
                        isUser: false
                    }
                });
            });
    } else {
        res.status(500)
            .json({
                status: 'failed',
                user: {
                    isUser: false
                }
            });
    }
}
