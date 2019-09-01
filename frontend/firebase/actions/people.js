import fetch from 'isomorphic-unfetch';

import urls from '../../../utils/urls';


export const createPerson = (user) =>
    fetch(urls.base + urls.api.createPerson, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user
        })
    })
        .catch((error) => {
            console.error(error);
        });

export const deletePerson = (email) =>
    fetch(urls.base + urls.api.deletePerson, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email
        })
    })
        .catch((error) => {
            console.error(error);
        });

export const fetchPeople = () =>
    fetch(urls.base + urls.api.fetchPeople, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include'
    })
        .then((response) => response.json())
        .then((json) => json.people)
        .catch((error) => {
            console.error(error);
        });


export const fetchEmails = () =>
    fetch(urls.base + urls.api.fetchEmails, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include'
    })
        .then((response) => response.json())
        .then((json) => json.emails)
        .catch((error) => {
            console.error(error);
        });

export const fetchPerson = (email) =>
    fetch(urls.base + urls.api.fetchPerson, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email
        })
    })
        .then((response) => response.json())
        .then((json) => json.person)
        .catch((error) => {
            console.error(error);
        });
