import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup } from 'shards-react';
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

class JobSwitcher extends React.Component {
    constructor(props) {
        super(props);

        const formattedNames = Object.keys(props.emailsToNames)
            .map((email) => ({
                label: props.emailsToNames[email],
                value: email
            }));

        const dateObj = _.has(props, 'job.date._seconds') ? moment.unix(_.get(props, 'job.date._seconds')) : moment();

        const people = _.get(props, 'job.people', [])
            .map((email) => ({
                label: props.emailsToNames[email],
                value: email
            }));

        this.state = {
            date: dateObj.format('YYYY-MM-DD'),
            time: dateObj.format('HH:mm'),
            title: _.get(props, 'job.title', ''),
            people,
            formattedNames
        };
    }

    confirmSwitch = async () => {
        const { closeModal, job } = this.props;
        const { date, time, title, people } = this.state;

        await editJob(job.key, {
            title,
            date: moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').valueOf(),
            people: people.map((person) => person.value)
        });

        closeModal();
        window.location.reload();
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    peopleChange = (event) => {
        this.setState({
            people: event
        });
    };

    render() {
        const { classes, modalOpen, closeModal, job } = this.props;
        const { date, time, title, people, formattedNames } = this.state;

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
                    Job Switcher
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <label htmlFor='#switch'>Who do you want to switch with?</label>
                            <Select
                                id='#switch'
                                options={formattedNames}
                                value={people}
                                onChange={this.peopleChange}
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
                        onClick={this.confirmSwitch}
                    >
                        Request Switch
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

JobSwitcher.propTypes = {
    classes: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    emailsToNames: PropTypes.object.isRequired,
    job: PropTypes.object.isRequired
};

export default withStyles(styles)(JobSwitcher);
