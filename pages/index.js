import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Row, Col, Button } from 'shards-react';

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
    }
});

class IndexPage extends React.PureComponent {
    static async getInitialProps() {
        const jobs = await fetchJobs();
        const emailsToNames = await fetchEmails();

        return {
            jobs,
            emailsToNames
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
        const { classes, currentUser, jobs, emailsToNames } = this.props;
        const { showCreator } = this.state;

        return (
            <React.Fragment>
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
                    emailsToNames={emailsToNames}
                />
            </React.Fragment>
        );
    }
}

IndexPage.propTypes = {
    classes: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    jobs: PropTypes.array.isRequired,
    emailsToNames: PropTypes.object.isRequired
};

export default withStyles(styles)(IndexPage);
