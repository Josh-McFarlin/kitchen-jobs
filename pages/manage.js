import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Button } from 'shards-react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Router from 'next/router';

import ConfirmDialog from '../frontend/components/ConfirmDialog';
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
            deleteEmail: null,
            showOwner: false,
            ownerEmail: null
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

    startOwner = (email) => {
        this.setState({
            showOwner: true,
            ownerEmail: email
        });
    };

    cancelOwner = () => {
        this.setState({
            showOwner: false,
            ownerEmail: null
        });
    };

    makeOwner = async (email) => {
        const { currentUser } = this.props;

        await editPerson(currentUser.email, {
            isOwner: false,
            isAdmin: false
        });

        await editPerson(email, {
            isOwner: true,
            isAdmin: true
        });

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
        const { showDelete, deleteEmail, showOwner, ownerEmail } = this.state;

        return (
            <React.Fragment>
                <ConfirmDialog
                    header='Delete User?'
                    message={`Are you sure you want to delete the account associated with: ${deleteEmail}`}
                    visible={showDelete}
                    toggleVisibility={this.cancelDelete}
                    confirmedAction={this.confirmDelete}
                    confirmText='Delete User'
                />
                <ConfirmDialog
                    header='Make Owner?'
                    message={`Are you sure you want to transfer complete ownership to: ${ownerEmail}? This is irreversible!`}
                    visible={showOwner}
                    toggleVisibility={this.cancelOwner}
                    confirmedAction={this.makeOwner}
                    confirmText='Delete User'
                />
                <Paper className={classes.paper}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                {!isMobile && (
                                    <TableCell align='center'>Photo</TableCell>
                                )}
                                <TableCell align='center'>Name</TableCell>
                                <TableCell align='center'>Email</TableCell>
                                {(currentUser.isOwner) && (
                                    <React.Fragment>
                                        <TableCell align='center'>Owner</TableCell>
                                        <TableCell align='center'>Admin</TableCell>
                                    </React.Fragment>
                                )}
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
                                    {(currentUser.isOwner) && (
                                        <React.Fragment>
                                            <TableCell align='center'>
                                                <Button
                                                    theme='danger'
                                                    disabled={item.isOwner}
                                                    onClick={() => this.startOwner(item.email)}
                                                >
                                                    Make Owner
                                                </Button>
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
                                        </React.Fragment>
                                    )}
                                    <TableCell align='center'>
                                        <Button
                                            theme='danger'
                                            disabled={item.isOwner || item.isAdmin || currentUser.email === item.email}
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
