import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Row, Col, Button, ListGroupItem, ListGroup } from 'shards-react';
import _ from 'lodash';
import moment from 'moment';

import { fetchCompletedJobs, fetchEmails } from '../frontend/firebase/actions';


const styles = (theme) => ({
    group: {
        '&:not(:last-of-type)': {
            marginBottom: theme.spacing.unit * 2
        }
    },
    ownJob: {
        textDecoration: 'underline',
        cursor: 'pointer',
        backgroundColor: '#ffcbb1'
    },
    checkbox: {
        float: 'right',
        margin: 0
    },
    createButton: {
        float: 'right',
        marginBottom: theme.spacing.unit * 2
    }
});

class LogPage extends React.PureComponent {
    static async getInitialProps() {
        const jobs = await fetchCompletedJobs();
        const emailsToNames = await fetchEmails();

        return {
            jobs,
            emailsToNames
        };
    }

    render() {
        const { classes, jobs, emailsToNames } = this.props;

        return (
            <React.Fragment>
                {jobs.map((job) => (
                    <ListGroup
                        key={job.title + job.date._seconds}
                        className={classes.group}
                    >
                        <ListGroupItem theme='secondary'>
                            <b>{job.title} due at {moment.unix(job.date._seconds).format('h:mma, dddd MMM Do')}</b>
                        </ListGroupItem>

                        {(job.completedAt != null) && (
                            <ListGroupItem>
                                Completed At: {moment.unix(job.completedAt._seconds).format('h:mma')}
                            </ListGroupItem>
                        )}

                        {(job.people != null && job.people.length > 0) && (
                            <React.Fragment>
                                <ListGroupItem>
                                    Assigned To:
                                    <ul>
                                        {job.people.map((email) => (
                                            <li key={email}>
                                                {_.get(emailsToNames, email, email)}
                                            </li>
                                        ))}
                                    </ul>
                                </ListGroupItem>
                            </React.Fragment>
                        )}

                        {(job.skipped != null && job.skipped.length > 0) && (
                            <React.Fragment>
                                <ListGroupItem>
                                    Skipped By:
                                    <ul>
                                        {job.skipped.map((email) => (
                                            <li key={email}>
                                                {_.get(emailsToNames, email, email)}
                                            </li>
                                        ))}
                                    </ul>
                                </ListGroupItem>
                            </React.Fragment>
                        )}

                        {(job.stole != null && job.stole.length > 0) && (
                            <React.Fragment>
                                <ListGroupItem>
                                    Stolen By:
                                    <ul>
                                        {job.stole.map((email) => (
                                            <li key={email}>
                                                {_.get(emailsToNames, email, email)}
                                            </li>
                                        ))}
                                    </ul>
                                </ListGroupItem>
                            </React.Fragment>
                        )}

                        {(job.notes != null && job.notes.length > 0) && (
                            <ListGroupItem>
                                Notes: {job.notes}
                            </ListGroupItem>
                        )}
                    </ListGroup>
                ))}
            </React.Fragment>
        );
    }
}

LogPage.propTypes = {
    classes: PropTypes.object.isRequired,
    jobs: PropTypes.array.isRequired,
    emailsToNames: PropTypes.object.isRequired
};

export default withStyles(styles)(LogPage);
