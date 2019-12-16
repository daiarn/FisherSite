import React, { Component } from "react";
import { userService } from "../services/userService";
import { authenticationService } from "../services/authentication";
import jwt from "jwt-decode";
import {
    Input,
    FormGroup,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table,
    Button
} from "reactstrap";

class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isLoaded: false,
            currentUser: jwt(authenticationService.currentUserValue.token),
            isAdmin:
                jwt(authenticationService.currentUserValue.token).role ===
                "Admin",
            editUserModal: false,
            editUser: {}
        };
    }

    handleEditUserChange = event => {
        event.preventDefault();
        const name = event.target.name;
        const { editUser } = this.state;
        editUser[name] = event.target.value;
        this.setState({ editUser });
    };

    toggleEditUserModal = () => {
        this.setState({
            editUserModal: !this.state.editUserModal
        });
    };

    updateUser = () => {
        const { editUser } = this.state;
        userService.putUser(editUser).then(response => {
            this._refreshUsers();
            this.setState({
                editUserModal: !this.state.editUserModal
            });
        });
    };

    editUser(user) {
        this.setState({
            editUserModal: !this.state.editUserModal,
            editUser: { ...user }
        });
    }

    deleteUser(id) {
        userService.deleteUser(id).then(response => {
            this._refreshUsers();
        });
    }

    componentDidMount() {
        this._refreshUsers();
    }

    _refreshUsers = () => {
        const { isAdmin, currentUser } = this.state;
        if (isAdmin) {
            userService
                .getAllUsers()
                .then(data => this.setState({ data: data, isLoaded: true }));
        } else {
            userService
                .getUser(currentUser.id)
                .then(data => this.setState({ data: data, isLoaded: true }));
        }
    };

    render() {
        let { isLoaded, data, currentUser, isAdmin } = this.state;
        if (isLoaded && !isAdmin) {
            let newData = [];
            newData.push(data);
            data = newData;
        }
        return (
            <div className="App container">
                <h1>All users page</h1>

                <Modal
                    isOpen={this.state.editUserModal}
                    toggle={this.toggleEditUserModal}
                >
                    <ModalHeader toggle={this.toggleEditUserModal}>
                        Edit article
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={this.state.editUser.name}
                                onChange={this.handleEditUserChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="surname">Surname</Label>
                            <Input
                                id="surname"
                                name="surname"
                                value={this.state.editUser.surname}
                                onChange={this.handleEditUserChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="username">Vsername</Label>
                            <Input
                                id="username"
                                name="username"
                                value={this.state.editUser.username}
                                onChange={this.handleEditUserChange}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateUser}>
                            Update user
                        </Button>{" "}
                        <Button
                            color="secondary"
                            onClick={this.toggleEditUserModal}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>

                <Table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Username</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoaded ? (
                            data.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.surname}</td>
                                    <td>{user.username}</td>
                                    <td>
                                        {currentUser.id == user.id ? (
                                            <Button
                                                color="success"
                                                size="sm"
                                                className="mr-2"
                                                onClick={this.editUser.bind(
                                                    this,
                                                    user
                                                )}
                                            >
                                                Edit
                                            </Button>
                                        ) : (
                                            ""
                                        )}
                                        {currentUser.role === "Admin" ||
                                        currentUser.id == user.id ? (
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={this.deleteUser.bind(
                                                    this,
                                                    user.id
                                                )}
                                            >
                                                Delete
                                            </Button>
                                        ) : (
                                            ""
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr></tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default UsersTable;
