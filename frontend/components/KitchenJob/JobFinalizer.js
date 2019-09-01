import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import {
    Button, Modal, ModalBody, ModalHeader, ModalFooter, Form,
    FormInput, FormGroup, FormTextarea, FormSelect
} from 'shards-react';
import _ from 'lodash';
import moment from 'moment';

import { editJob } from '../../firebase/actions';


const styles = () => ({
    header: {
        display: 'flex',
        justifyContent: 'center'
    }
});

class JobFinalizer extends React.Component {
    constructor(props) {
        super(props);

        const completedObj = _.has(props, 'job.completedAt._seconds') ? moment.unix(_.get(props, 'job.completedAt._seconds')) : moment();

        this.state = {
            completed: _.get(props, 'job.completed', false),
            completedAt: completedObj.format('HH:mm'),
            notes: _.get(props, 'job.notes', '')
        };
    }

    confirmFinalize = async () => {
        const { closeModal, job } = this.props;
        const { completed, completedAt, notes } = this.state;

        const date = moment().format('YYYY-MM-DD');

        await editJob(job.key, {
            completed: completed === 'true',
            completedAt: moment(`${date} ${completedAt}`, 'YYYY-MM-DD HH:mm').valueOf(),
            notes
        });

        closeModal();
        window.location.reload();
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const { classes, modalOpen, closeModal, job } = this.props;
        const { completed, completedAt, notes } = this.state;

        return (
            <Modal
                open={modalOpen}
                size='lg'
                toggle={closeModal}
            >
                <ModalHeader
                    className={classes.header}
                    titleClass={classes.title}
                >
                    Finalize Job
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <label htmlFor='#completed'>Completed</label>
                            <FormSelect
                                id='#completed'
                                name='completed'
                                value={completed}
                                onChange={this.handleChange}
                            >
                                <option value='true'>Yes</option>
                                <option value='false'>No</option>
                            </FormSelect>
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor='#completedAt'>Completed At</label>
                            <FormInput
                                id='#completedAt'
                                name='completedAt'
                                type='time'
                                value={completedAt}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor='#notes'>Notes</label>
                            <FormTextarea
                                id='#notes'
                                name='notes'
                                value={notes}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        theme='warning'
                        onClick={closeModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        theme='primary'
                        onClick={this.confirmFinalize}
                    >
                        Finalize Job
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

JobFinalizer.propTypes = {
    classes: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    job: PropTypes.object
};

JobFinalizer.defaultProps = {
    job: null
};

export default withStyles(styles)(JobFinalizer);
