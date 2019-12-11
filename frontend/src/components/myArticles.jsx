import React, { Component } from "react";
import { authenticationService } from "../services/authentication";
import { articleService } from "../services/articleService";
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

class MyArticles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isLoaded: false,
            editArticle: {
                id: "",
                Title: "",
                Text: "",
                User: {
                    UserId: 0
                }
            },
            editModalModal: false,
            user: jwt(authenticationService.currentUserValue.token)
        };
    }
    handleEditArticleChange = event => {
        event.preventDefault();
        const name = event.target.name;
        const { editArticle } = this.state;
        editArticle[name] = event.target.value;
        this.setState({ editArticle });
    };
    toggleEditArticleModal = () => {
        this.setState({
            editModalModal: !this.state.editModalModal
        });
    };
    updateArticle = () => {
        const { editArticle } = this.state;
        articleService.putArticle(editArticle).then(response => {
            this._refreshArticles();
            this.setState({
                editModalModal: !this.state.editModalModal
            });
        });
    };
    editArticle(article) {
        const { user } = this.state;
        this.setState({
            editModalModal: !this.state.editModalModal,
            editArticle: {
                id: article.id,
                Title: article.title,
                Text: article.text,
                User: {
                    UserId: user.id
                }
            }
        });
    }
    deleteArticle(id) {
        articleService.deleteArticle(id).then(response => {
            this._refreshArticles();
        });
    }
    componentDidMount() {
        this._refreshArticles();
    }
    _refreshArticles = () => {
        userService
            .getCurrentUserArticles()
            .then(data => this.setState({ data: data, isLoaded: true }));
    };
    render() {
        const { isLoaded, data } = this.state;
        return (
            <div className="App container">
                <h1>My articles page</h1>
                <Modal
                    isOpen={this.state.editModalModal}
                    toggle={this.toggleEditArticleModal}
                >
                    <ModalHeader toggle={this.toggleEditArticleModal}>
                        Edit article
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input
                                id="title"
                                name="Title"
                                value={this.state.editArticle.Title}
                                onChange={this.handleEditArticleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="text">Text</Label>
                            <Input
                                id="text"
                                name="Text"
                                value={this.state.editArticle.Text}
                                onChange={this.handleEditArticleChange}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateArticle}>
                            Update Article
                        </Button>{" "}
                        <Button
                            color="secondary"
                            onClick={this.toggleEditArticleModal}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Text</th>
                            <th>Comments Count</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoaded ? (
                            data.map(article => (
                                <tr key={article.id}>
                                    <td>{article.title}</td>
                                    <td>{article.text}</td>
                                    <td>{article.comments.length}</td>
                                    <td>
                                        <Button
                                            color="success"
                                            size="sm"
                                            className="mr-2"
                                            onClick={this.editArticle.bind(
                                                this,
                                                article
                                            )}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color="danger"
                                            size="sm"
                                            onClick={this.deleteArticle.bind(
                                                this,
                                                article.id
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
                </table>
            </div>
        );
    }
}

export default MyArticles;
