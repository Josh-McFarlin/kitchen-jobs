import fetch from 'isomorphic-unfetch';

import firebase from '../index';
import urls from '../../../utils/urls';
import { createPerson } from './people';


export const loginUser = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const { user, additionalUserInfo } = await firebase.auth().signInWithPopup(provider);
    const idToken = await user.getIdToken();

    await fetch(urls.auth.sessionLogin, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idToken
        })
    });

    await firebase.auth().signOut();

    if (additionalUserInfo.isNewUser) {
        await createPerson(user);
    }

    window.location.assign(urls.home);
};

export const signOut = () =>
    fetch(urls.auth.sessionLogout, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include'
    });

export const getCurrentUser = (session) =>
    fetch(urls.base + urls.auth.getCurrentUser, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session
        })
    })
        .then((response) => response.json())
        .then((json) => json.user);
