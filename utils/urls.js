const dev = process.env.NODE_ENV !== 'production';

module.exports = {
    base: dev ? 'http://localhost:3000' : 'https://meal.mcfarl.in',
    home: '/',
    manage: '/manage',
    log: '/log',
    auth: {
        sessionLogin: '/api/sessionLogin',
        sessionLogout: '/api/sessionLogout',
        getCurrentUser: '/api/getCurrentUser'
    },
    api: {
        createPerson: '/api/createPerson',
        deletePerson: '/api/deletePerson',
        fetchPeople: '/api/fetchPeople',
        fetchEmails: '/api/fetchEmails',
        fetchPerson: '/api/fetchPerson',
        fetchJobs: '/api/fetchJobs',
        fetchCompletedJobs: '/api/fetchCompletedJobs',
        createJob: '/api/createJob',
        deleteJob: '/api/deleteJob',
        editJob: '/api/editJob'
    }
};
