import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'shards-react';


const styles = () => ({
    paper: {
        overflowX: 'auto'
    },
    userPhoto: {
        height: 'auto',
        width: 50
    }
});

class ConfirmDialog extends React.PureComponent {
    render() {
        const { classes, header, message, visible, toggleVisibility, confirmedAction, confirmText } = this.props;

        return (
            <Modal
                open={visible}
                toggle={toggleVisibility}
            >
                <ModalHeader>{header}</ModalHeader>
                <ModalBody>{message}</ModalBody>
                <ModalFooter>
                    <Button
                        theme='success'
                        onClick={toggleVisibility}
                    >
                        Cancel
                    </Button>
                    <Button
                        theme='danger'
                        onClick={confirmedAction}
                    >
                        {confirmText}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

ConfirmDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    header: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    toggleVisibility: PropTypes.func.isRequired,
    confirmedAction: PropTypes.func.isRequired,
    confirmText: PropTypes.string
};

ConfirmDialog.defaultProps = {
    confirmText: 'Ok'
};

export default withStyles(styles)(ConfirmDialog);
