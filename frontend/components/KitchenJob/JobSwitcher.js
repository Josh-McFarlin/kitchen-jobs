import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup } from 'shards-react';
import _ from 'lodash';
import moment from 'moment';
import Select from 'react-select';

import { switchRequest } from '../../firebase/actions';


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
            .filter((email) => email !== props.currentUser.email)
            .map((email) => ({
                label: props.emailsToNames[email],
                value: email
            }));

        const dateObj = _.has(props, 'job.date._seconds') ? moment.unix(_.get(props, 'job.date._seconds')) : moment();

        this.state = {
            date: dateObj.format('dddd, MMM Do'),
            time: dateObj.format('h:mma'),
            title: _.get(props, 'job.title', ''),
            person: {},
            formattedNames
        };
    }

    confirmSwitch = async () => {
        const { closeModal, job, currentUser, emailsToNames } = this.props;
        const { date, time, title, person } = this.state;

        await switchRequest(job.key, {
            fromName: emailsToNames[currentUser.email],
            fromEmail: currentUser.email,
            toName: person.label,
            toEmail: person.value,
            date,
            title,
            dueAt: time
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
            person: event
        });
    };

    render() {
        const { classes, modalOpen, closeModal } = this.props;
        const { date, person, formattedNames } = this.state;

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
                    Job Switcher for {date}
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <label htmlFor='#switch'>Who do you want to switch with?</label>
                            <Select
                                id='#switch'
                                options={formattedNames}
                                value={person}
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
    currentUser: PropTypes.object.isRequired,
    emailsToNames: PropTypes.object.isRequired,
    job: PropTypes.object.isRequired
};

export default withStyles(styles)(JobSwitcher);
