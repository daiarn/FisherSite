import React, { Component } from "react";
import { Link } from "react-router-dom";
import { articleService } from "../services/articleService";
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

class Articles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isLoaded: false,
            newArticle: {
                Title: "",
                Text: "",
                User: {
                    UserId: 0
                }
            },
            editArticle: {
                id: "",
                Title: "",
                Text: "",
                User: {
                    UserId: 0
                }
            },
            newArticleModal: false,
            editModalModal: false,
            user: jwt(authenticationService.currentUserValue.token)
        };
    }

    handleNewArticleChange = event => {
        event.preventDefault();
        const name = event.target.name;
        const { newArticle } = this.state;
        newArticle[name] = event.target.value;
        this.setState({ newArticle });
    };

    handleEditArticleChange = event => {
        event.preventDefault();
        const name = event.target.name;
        const { editArticle } = this.state;
        editArticle[name] = event.target.value;
        this.setState({ editArticle });
    };

    toggleNewArticleModal = () => {
        this.setState({
            newArticleModal: !this.state.newArticleModal
        });
    };
    toggleEditArticleModal = () => {
        this.setState({
            editModalModal: !this.state.editModalModal
        });
    };
    addArticle = () => {
        let { newArticle } = this.state;
        const user = jwt(authenticationService.currentUserValue.token);
        newArticle.User.UserId = user.id;
        articleService.postArticle(newArticle).then(article => {
            let { data } = this.state;
            data.push(article);
            this.setState({
                data,
                newArticleModal: false,
                newArticle: {
                    Title: "",
                    Text: "",
                    User: {
                        UserId: 0
                    }
                }
            });
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
        const user = jwt(authenticationService.currentUserValue.token);
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
        articleService
            .getAllArticles()
            .then(data => this.setState({ data: data, isLoaded: true }));
    };

    render() {
        const { data, isLoaded, user } = this.state;
        return (
            <div>
                <div className="App container">
                    <h1>Articles page</h1>

                    <Button
                        className="my-3"
                        color="primary"
                        onClick={this.toggleNewArticleModal}
                    >
                        Add article
                    </Button>

                    <Modal
                        isOpen={this.state.newArticleModal}
                        toggle={this.toggleNewArticleModal}
                    >
                        <ModalHeader toggle={this.toggleNewArticleModal}>
                            Add a new article
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input
                                    id="title"
                                    name="Title"
                                    value={this.state.newArticle.Title}
                                    onChange={this.handleNewArticleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="rating">Text</Label>
                                <Input
                                    id="text"
                                    name="Text"
                                    type="textarea"
                                    value={this.state.newArticle.Text}
                                    onChange={this.handleNewArticleChange}
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.addArticle}>
                                Add Article
                            </Button>{" "}
                            <Button
                                color="secondary"
                                onClick={this.toggleNewArticleModal}
                            >
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>

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
                            <Button
                                color="primary"
                                onClick={this.updateArticle}
                            >
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

                    <Table>
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
                                        <td>
                                            <Link
                                                className="nav-link"
                                                to={"/articles/" + article.id}
                                            >
                                                {article.title}
                                            </Link>
                                        </td>
                                        <td>{article.text}</td>
                                        <td>{article.comments.length}</td>
                                        <td>
                                            {user.id == article.userId ? (
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
                                            ) : (
                                                ""
                                            )}
                                            {user.role === "Admin" ||
                                            user.id == article.userId ? (
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

export default Articles;
