import fetch from 'isomorphic-unfetch';

import urls from '../../../utils/urls';


export const fetchJobs = () =>
    fetch(urls.base + urls.api.fetchJobs, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include'
    })
        .then((response) => response.json())
        .then((json) => json.jobs);

export const fetchCompletedJobs = () =>
    fetch(urls.base + urls.api.fetchCompletedJobs, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include'
    })
        .then((response) => response.json())
        .then((json) => json.jobs);

export const createJob = (job) =>
    fetch(urls.base + urls.api.createJob, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            job
        })
    });

export const deleteJob = (key) =>
    fetch(urls.base + urls.api.deleteJob, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            key
        })
    });

export const editJob = (key, job) =>
    fetch(urls.base + urls.api.editJob, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            key,
            job
        })
    });

export const switchRequest = (key, switchInfo) =>
    fetch(urls.base + urls.api.switchRequest, {
        method: 'post',
        mode: 'same-origin',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            key,
            switchInfo
        })
    });
