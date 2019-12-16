import React, { Component } from "react";
import { authenticationService } from "../services/authentication";
import { commentService } from "../services/commentSetvice";
import { userService } from "../services/userService";
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

class MyComments extends Component {
    constructor(props) {
        super(props);
        if (!authenticationService.currentUserValue) {
            this.props.history.push("/");
        }
        this.state = {
            data: {},
            isLoaded: false,
            editComment: {},
            editCommentModal: false,
            user: jwt(authenticationService.currentUserValue.token)
        };
    }

    handleEditCommentChange = event => {
        event.preventDefault();
        const name = event.target.name;
        const { editComment } = this.state;
        editComment[name] = event.target.value;
        this.setState({ editComment });
    };

    toggleEditCommentModal = () => {
        this.setState({
            editCommentModal: !this.state.editCommentModal
        });
    };

    updateComment = () => {
        const { editComment } = this.state;
        commentService.putComment(editComment).then(response => {
            this._refreshComments();
            this.setState({
                editCommentModal: !this.state.editCommentModal
            });
        });
    };

    editComment(comment) {
        this.setState({
            editCommentModal: !this.state.editCommentModal,
            editComment: { ...comment }
        });
    }

    deleteComment(id) {
        commentService.deleteComment(id).then(response => {
            this._refreshComments();
        });
    }

    componentDidMount() {
        this._refreshComments();
    }

    _refreshComments = () => {
        userService
            .getCurrentUserComments()
            .then(data => this.setState({ data: data, isLoaded: true }));
    };

    render() {
        const { isLoaded, data } = this.state;
        return (
            <div className="App container">
                <h1>My comments page</h1>

                <Modal
                    isOpen={this.state.editCommentModal}
                    toggle={this.toggleEditCommentModal}
                >
                    <ModalHeader toggle={this.toggleEditCommentModal}>
                        Edit comment
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="text">Text</Label>
                            <Input
                                id="text"
                                name="text"
                                value={this.state.editComment.text}
                                onChange={this.handleEditCommentChange}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateComment}>
                            Update comment
                        </Button>{" "}
                        <Button
                            color="secondary"
                            onClick={this.toggleEditCommentModal}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>

                <Table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Text</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoaded ? (
                            data.map(comment => (
                                <tr key={comment.id}>
                                    <td>{comment.id}</td>
                                    <td>{comment.text}</td>
                                    <td>
                                        <Button
                                            color="success"
                                            size="sm"
                                            className="mr-2"
                                            onClick={this.editComment.bind(
                                                this,
                                                comment
                                            )}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color="danger"
                                            size="sm"
                                            onClick={this.deleteComment.bind(
                                                this,
                                                comment.id
                                            )}
                                        >
                                            Delete
                                        </Button>
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

export default MyComments;
