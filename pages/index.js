import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Row, Col, Button, Alert } from 'shards-react';

import KitchenJob from '../frontend/components/KitchenJob';
import JobCreator from '../frontend/components/JobCreator';
import { fetchJobs, fetchEmails } from '../frontend/firebase/actions';


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
    },
    alert: {
        position: 'absolute',
        width: '100%',
        left: 0,
        bottom: 0,
        margin: 0
    }
});

class IndexPage extends React.PureComponent {
    static async getInitialProps({ query }) {
        const jobs = await fetchJobs();
        const emailsToNames = await fetchEmails();

        return {
            jobs,
            emailsToNames,
            query
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            showCreator: false
        };
    }

    toggleCreator = () => {
        this.setState((prevState) => ({
            showCreator: !prevState.showCreator
        }));
    };

    render() {
        const { classes, currentUser, jobs, emailsToNames, query } = this.props;
        const { showCreator } = this.state;

        return (
            <React.Fragment>
                {(currentUser.isAdmin) && (
                    <Row>
                        <Col>
                            <Button
                                className={classes.createButton}
                                theme='success'
                                onClick={this.toggleCreator}
                            >
                                Create Job
                            </Button>
                        </Col>
                    </Row>
                )}
                {jobs.map((job) => (
                    <KitchenJob
                        key={job.title + job.date._seconds}
                        job={job}
                        currentUser={currentUser}
                        emailsToNames={emailsToNames}
                    />
                ))}
                <JobCreator
                    modalOpen={showCreator}
                    closeModal={this.toggleCreator}
                    currentUser={currentUser}
                    emailsToNames={emailsToNames}
                />
                {(query.switch != null) && (
                    <Alert
                        className={classes.alert}
                        theme={query.switch === 'success' ? 'success' : 'warning'}
                    >
                        {query.switch === 'success' ?
                            'Successfully switched kitchen jobs!' :
                            'An error occurred while switching kitchen jobs! Try again later, or contact a manager!'
                        }
                    </Alert>
                )}
            </React.Fragment>
        );
    }
}

IndexPage.propTypes = {
    classes: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    jobs: PropTypes.array.isRequired,
    emailsToNames: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired
};

export default withStyles(styles)(IndexPage);
