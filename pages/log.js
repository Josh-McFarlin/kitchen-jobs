import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Row, Col, Button, ListGroupItem, ListGroup } from 'shards-react';
import _ from 'lodash';

import KitchenJob from '../frontend/components/KitchenJob';
import JobCreator from '../frontend/components/JobCreator';
import JobSwitcher from '../frontend/components/JobSwitcher';
import { fetchCompletedJobs, fetchEmails } from '../frontend/firebase/actions';
import moment from 'moment';
import { CheckBox, CheckBoxOutlineBlank, Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';


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
        const { classes, currentUser, jobs, emailsToNames } = this.props;

        return (
            <React.Fragment>
                {jobs.map((job) => (
                    <ListGroup className={classes.group}>
                        <ListGroupItem theme='secondary'>
                            <b>{job.title} due at {moment.unix(job.date._seconds).format('h:mma, dddd MMM Do')}</b>
                        </ListGroupItem>
                        {job.people.map((email) => (
                            <ListGroupItem key={email}>
                                {_.get(emailsToNames, email, email)}
                            </ListGroupItem>
                        ))}
                        {job.completedAt != null && (
                            <ListGroupItem>
                                Completed At: {moment.unix(job.completedAt._seconds).format('h:mma')}
                            </ListGroupItem>
                        )}
                        {job.notes != null && (
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
    currentUser: PropTypes.object.isRequired,
    jobs: PropTypes.array.isRequired,
    emailsToNames: PropTypes.object.isRequired
};

export default withStyles(styles)(LogPage);
