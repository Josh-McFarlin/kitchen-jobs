const urls = require('../../utils/urls');


export default async function handle(req, res) {
    const sessionCookie = req.body.session;

    const expiresIn = 0;
    let fullCookie = `session=${sessionCookie}; HttpOnly; Max-Age=${expiresIn}; SameSite=Strict; Path=/`;
    if (process.env.NODE_ENV === 'production') {
        fullCookie += '; Secure';
    }

    res.setHeader('Set-Cookie', [fullCookie]);

    res.writeHead(302, {
        Location: urls.home
    });
    res.end();
}
