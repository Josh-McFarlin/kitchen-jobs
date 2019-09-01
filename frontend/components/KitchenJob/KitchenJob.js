import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { ListGroup, ListGroupItem, ModalHeader, ModalBody, ModalFooter, Button, Modal } from 'shards-react';
import _ from 'lodash';
import moment from 'moment';
import { Edit as EditIcon, Delete as DeleteIcon, CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';

import { deleteJob } from '../../firebase/actions';
import JobCreator from '../JobCreator';
import JobFinalizer from './JobFinalizer';


const styles = (theme) => ({
    group: {
        '&:not(:last-of-type)': {
            marginBottom: theme.spacing.unit * 2
        }
    },
    clickable: {
        cursor: 'pointer'
    },
    ownJob: {
        textDecoration: 'underline',
        cursor: 'pointer',
        backgroundColor: '#ffcbb1'
    },
    endIcon: {
        float: 'right',
        cursor: 'pointer',
        margin: `0 ${theme.spacing.unit}px`
    }
});

class KitchenJob extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showDelete: false,
            showEditor: false,
            showFinalizer: false
        };
    }

    toggleDelete = () => {
        this.setState((prevState) => ({
            showDelete: !prevState.showDelete
        }));
    };

    confirmDelete = async () => {
        const { job } = this.props;

        await deleteJob(job.key);
        window.location.reload();
    };

    toggleEditor = () => {
        this.setState((prevState) => ({
            showEditor: !prevState.showEditor
        }));
    };

    toggleFinalizer = () => {
        this.setState((prevState) => ({
            showFinalizer: !prevState.showFinalizer
        }));
    };

    preventRerender = () => {};

    render() {
        const { classes, job, currentUser, emailsToNames, toggleSwitcher } = this.props;
        const { showDelete, showEditor, showFinalizer } = this.state;

        return (
            <React.Fragment>
                <Modal
                    open={showDelete}
                    toggle={this.toggleDelete}
                >
                    <ModalHeader>Delete Job?</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete this kitchen job?
                        <ul>
                            <li>
                                Title: {job.title}
                            </li>
                            <li>
                                Date: {moment.unix(job.date._seconds).format('h:mma, dddd MMM Do')}
                            </li>
                            <li>
                                People:
                                <ul>
                                    {job.people.map((email) => (
                                        <li key={email}>
                                            {_.get(emailsToNames, email, email)}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            theme='success'
                            onClick={this.toggleDelete}
                        >
                            Cancel
                        </Button>
                        <Button
                            theme='danger'
                            onClick={this.confirmDelete}
                        >
                            Delete Job
                        </Button>
                    </ModalFooter>
                </Modal>
                <ListGroup className={classes.group}>
                    <ListGroupItem theme='secondary'>
                        <b>{job.title} due at {moment.unix(job.date._seconds).format('h:mma, dddd MMM Do')}</b>
                        {job.completed ? (
                            <CheckBox
                                className={classes.endIcon}
                                onClick={currentUser.isAdmin ? this.toggleFinalizer : this.preventRerender}
                            />
                        ) : (
                            <CheckBoxOutlineBlank
                                className={classes.endIcon}
                                onClick={currentUser.isAdmin ? this.toggleFinalizer : this.preventRerender}
                            />
                        )}
                        {currentUser.isAdmin && (
                            <EditIcon
                                className={classes.endIcon}
                                onClick={this.toggleEditor}
                            />
                        )}
                        {currentUser.isAdmin && (
                            <DeleteIcon
                                className={classes.endIcon}
                                onClick={this.toggleDelete}
                            />
                        )}
                    </ListGroupItem>
                    {job.people.map((email) => (
                        <ListGroupItem
                            key={email}
                            className={email === currentUser.email ? classes.ownJob : ''}
                            onClick={email === currentUser.email ? toggleSwitcher : this.preventRerender}
                        >
                            {_.get(emailsToNames, email, email)}
                        </ListGroupItem>
                    ))}
                </ListGroup>
                <JobCreator
                    modalOpen={showEditor}
                    closeModal={this.toggleEditor}
                    emailsToNames={emailsToNames}
                    job={job}
                />
                <JobFinalizer
                    modalOpen={showFinalizer}
                    closeModal={this.toggleFinalizer}
                    job={job}
                />
            </React.Fragment>
        );
    }
}

KitchenJob.propTypes = {
    classes: PropTypes.object.isRequired,
    job: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    emailsToNames: PropTypes.object.isRequired,
    toggleSwitcher: PropTypes.func.isRequired
};

export default withStyles(styles)(KitchenJob);
