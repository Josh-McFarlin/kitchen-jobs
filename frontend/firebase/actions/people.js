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
    });

export const editPerson = (email, data) =>
    fetch(urls.base + urls.api.editPerson, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            data
        })
    });

export const fetchPeople = () =>
    fetch(urls.base + urls.api.fetchPeople, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include'
    })
        .then((response) => response.json())
        .then((json) => json.people);


export const fetchEmails = () =>
    fetch(urls.base + urls.api.fetchEmails, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include'
    })
        .then((response) => response.json())
        .then((json) => json.emails);

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
        .then((json) => json.person);
