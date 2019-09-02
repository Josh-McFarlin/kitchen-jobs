import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import {
    Button, Modal, ModalBody, ModalHeader, ModalFooter, Form,
    FormInput, FormGroup, FormTextarea, FormSelect
} from 'shards-react';
import _ from 'lodash';
import moment from 'moment';
import Select from 'react-select';

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

        const completedObj = _.has(props, 'job.completedAt._seconds') ?
            moment.unix(_.get(props, 'job.completedAt._seconds')) :
            moment();

        const peopleInJob = _.get(props, 'job.people', []);

        const otherPeople = Object.keys(props.emailsToNames)
            .filter((person) => !peopleInJob.includes(person))
            .map((email) => ({
                label: props.emailsToNames[email],
                value: email
            }));

        const people = peopleInJob.map((email) => ({
            label: props.emailsToNames[email],
            value: email
        }));

        this.state = {
            completed: _.get(props, 'job.completed', false),
            completedAt: completedObj.format('HH:mm'),
            skipped: _.get(props, 'job.skipped', []),
            stole: _.get(props, 'job.stole', []),
            notes: _.get(props, 'job.notes', ''),
            people,
            otherPeople
        };
    }

    confirmFinalize = async () => {
        const { closeModal, job } = this.props;
        const { completed, completedAt, skipped, stole, notes } = this.state;

        const date = moment().format('YYYY-MM-DD');

        await editJob(job.key, {
            completed: completed === 'true',
            completedAt: moment(`${date} ${completedAt}`, 'YYYY-MM-DD HH:mm').valueOf(),
            skipped: skipped.map((person) => person.value),
            stole: stole.map((person) => person.value),
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

    skippedChange = (event) => {
        this.setState({
            skipped: event
        });
    };

    stoleChange = (event) => {
        console.log(event);

        this.setState({
            stole: event
        });
    };

    render() {
        const { classes, modalOpen, closeModal } = this.props;
        const { completed, completedAt, skipped, stole, notes, people, otherPeople } = this.state;

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
                            <label htmlFor='#skipped'>Who skipped?</label>
                            <Select
                                id='#skipped'
                                options={people}
                                value={skipped}
                                multi
                                onChange={this.skippedChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label htmlFor='#stole'>Who stole?</label>
                            <Select
                                id='#stole'
                                options={otherPeople}
                                value={stole}
                                multi
                                onChange={this.stoleChange}
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
    emailsToNames: PropTypes.object.isRequired,
    job: PropTypes.object
};

JobFinalizer.defaultProps = {
    job: null
};

export default withStyles(styles)(JobFinalizer);
