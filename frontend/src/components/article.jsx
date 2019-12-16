import React, { Component } from "react";
import { articleService } from "../services/articleService";
import { commentService } from "../services/commentSetvice";
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

class Article extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articleId: this.props.match.params.id,
            data: {},
            isLoaded: false,
            user: jwt(authenticationService.currentUserValue.token),
            newCommentModal: false,
            editCommentModal: false,
            newComment: {
                Text: "",
                Article: {
                    Id: this.props.match.params.id
                },
                User: {
                    UserId: ""
                }
            },
            editComment: {}
        };
    }

    handleNewCommentChange = event => {
        event.preventDefault();
        const name = event.target.name;
        const { newComment } = this.state;
        newComment[name] = event.target.value;
        this.setState({ newComment });
    };

    handleEditCommentChange = event => {
        event.preventDefault();
        const name = event.target.name;
        const { editComment } = this.state;
        editComment[name] = event.target.value;
        this.setState({ editComment });
    };

    toggleNewCommentModal = () => {
        this.setState({
            newCommentModal: !this.state.newCommentModal
        });
    };
    toggleEditCommentModal = () => {
        this.setState({
            editCommentModal: !this.state.editCommentModal
        });
    };

    addComment = () => {
        let { newComment, user } = this.state;
        newComment.User.UserId = user.id;
        commentService.postComment(newComment).then(comment => {
            let { data } = this.state;
            data.comments.push(comment);
            this.setState({
                data,
                newCommentModal: false,
                editCommentModal: false,
                newComment: {
                    Text: "",
                    Article: {
                        Id: this.state.articleId
                    },
                    User: {
                        UserId: ""
                    }
                },
                editComment: {}
            });
        });
    };

    updateComment = () => {
        const { editComment } = this.state;
        commentService.putComment(editComment).then(response => {
            this._refreshArticle();
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
            this._refreshArticle();
        });
    }

    componentDidMount() {
        this._refreshArticle();
    }
    _refreshArticle = () => {
        articleService
            .getArticle(this.state.articleId)
            .then(data => this.setState({ data: data, isLoaded: true }));
    };

    render() {
        const { data, isLoaded, user } = this.state;
        return (
            <div className="App container">
                <h1>Article "{data.title}" page</h1>
                <div>
                    <Label htmlFor="text">Article text</Label>
                    <Input
                        name="text"
                        type="textarea"
                        className="form-control"
                        value={data.text}
                        readOnly={true}
                    />
                </div>
                <div>
                    <Button
                        className="my-3"
                        color="primary"
                        onClick={this.toggleNewCommentModal}
                    >
                        Add comment
                    </Button>

                    <Modal
                        isOpen={this.state.newCommentModal}
                        toggle={this.toggleNewCommentModal}
                    >
                        <ModalHeader toggle={this.toggleNewCommentModal}>
                            Add a new comment
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="rating">Text</Label>
                                <Input
                                    id="text"
                                    name="Text"
                                    type="textarea"
                                    value={this.state.newComment.Text}
                                    onChange={this.handleNewCommentChange}
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.addComment}>
                                Add comment
                            </Button>{" "}
                            <Button
                                color="secondary"
                                onClick={this.toggleNewCommentModal}
                            >
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>

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
                            <Button
                                color="primary"
                                onClick={this.updateComment}
                            >
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

                    <Table>
                        <thead>
                            <tr>
                                <th>Text</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoaded ? (
                                data.comments.map(comment => (
                                    <tr key={comment.id}>
                                        <td>{comment.text}</td>
                                        <td>
                                            {user.id == comment.userId ? (
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
                                            ) : (
                                                ""
                                            )}
                                            {user.role === "Admin" ||
                                            user.id == data.userId ? (
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
            </div>
        );
    }
}

export default Article;
