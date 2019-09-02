import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'shards-react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Router from 'next/router';

import urls from '../utils/urls';
import { fetchPeople, deletePerson, editPerson } from '../frontend/firebase/actions';


const styles = () => ({
    paper: {
        overflowX: 'auto'
    },
    userPhoto: {
        height: 'auto',
        width: 50
    }
});

class ManagePage extends React.PureComponent {
    static async getInitialProps({ res }, currentUser) {
        const allPeople = await fetchPeople();

        if (!currentUser.isUser || !currentUser.isAdmin) {
            if (res) {
                res.writeHead(302, {
                    Location: urls.home
                });
                res.end();
            } else {
                Router.push(urls.home);
            }
        }

        return {
            allPeople
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            showDelete: false,
            deleteEmail: null
        };
    }

    startDelete = (email) => {
        this.setState({
            showDelete: true,
            deleteEmail: email
        });
    };

    cancelDelete = () => {
        this.setState({
            showDelete: false,
            deleteEmail: null
        });
    };

    confirmDelete = async () => {
        const { deleteEmail } = this.state;

        await deletePerson(deleteEmail);
        window.location.reload();
    };

    makeAdmin = async (email) => {
        await editPerson(email, {
            isAdmin: true
        });

        window.location.reload();
    };

    removeAdmin = async (email) => {
        await editPerson(email, {
            isAdmin: false
        });

        window.location.reload();
    };

    render() {
        const { classes, currentUser, allPeople, isMobile } = this.props;
        const { showDelete, deleteEmail } = this.state;

        return (
            <React.Fragment>
                <Modal
                    open={showDelete}
                    toggle={this.cancelDelete}
                >
                    <ModalHeader>Delete User?</ModalHeader>
                    <ModalBody>Are you sure you want to delete the account associated with <b>{deleteEmail}</b>?</ModalBody>
                    <ModalFooter>
                        <Button
                            theme='success'
                            onClick={this.cancelDelete}
                        >
                            Cancel
                        </Button>
                        <Button
                            theme='danger'
                            onClick={this.confirmDelete}
                        >
                            Delete User
                        </Button>
                    </ModalFooter>
                </Modal>
                <Paper className={classes.paper}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                {!isMobile && (
                                    <TableCell align='center'>Photo</TableCell>
                                )}
                                <TableCell align='center'>Name</TableCell>
                                <TableCell align='center'>Email</TableCell>
                                <TableCell align='center'>Jobs Completed</TableCell>
                                <TableCell align='center'>Jobs Skipped</TableCell>
                                <TableCell align='center'>Jobs Stolen</TableCell>
                                <TableCell align='center'>Admin</TableCell>
                                <TableCell align='center'>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allPeople.map((item) => (
                                <TableRow key={item.email}>
                                    {!isMobile && (
                                        <TableCell
                                            component='th'
                                            scope='row'
                                            align='center'
                                        >
                                            <img
                                                className={classes.userPhoto}
                                                src={item.photo}
                                                alt={item.name}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell align='center'>
                                        <b>{item.name}</b>
                                    </TableCell>
                                    <TableCell align='center'>
                                        {item.email}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {item.jobsCompleted}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {item.jobsSkipped}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {item.jobsStolen}
                                    </TableCell>
                                    {(item.isAdmin) ? (
                                        <TableCell align='center'>
                                            <Button
                                                theme='danger'
                                                disabled={item.isAdmin && currentUser.email !== item.email}
                                                onClick={() => this.removeAdmin(item.email)}
                                            >
                                                Remove Manager
                                            </Button>
                                        </TableCell>
                                    ) : (
                                        <TableCell align='center'>
                                            <Button
                                                theme='info'
                                                disabled={item.isAdmin && currentUser.email !== item.email}
                                                onClick={() => this.makeAdmin(item.email)}
                                            >
                                                Make Manager
                                            </Button>
                                        </TableCell>
                                    )}
                                    <TableCell align='center'>
                                        <Button
                                            theme='danger'
                                            disabled={item.isAdmin || currentUser.email === item.email}
                                            onClick={() => this.startDelete(item.email)}
                                        >
                                            Delete User
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </React.Fragment>
        );
    }
}

ManagePage.propTypes = {
    classes: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    allPeople: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired
};

export default withStyles(styles)(ManagePage);
