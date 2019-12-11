import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authenticationService } from "../services/authentication";
import jwt from "jwt-decode";

class Navbar extends Component {
    render() {
        let isAdmin = false;
        const currentUser = authenticationService.currentUserValue;
        if (currentUser) {
            isAdmin = jwt(currentUser.token).role == "Admin";
        }
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container">
                        <ul className="navbar-nav mr-aut">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Home
                                </Link>
                            </li>
                            {!currentUser ? (
                                <ul className="navbar-nav mr-aut">
                                    <li>
                                        <Link className="nav-link" to="/login">
                                            Login
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            className="nav-link"
                                            to="/register"
                                        >
                                            Register
                                        </Link>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="navbar-nav mr-aut">
                                    <li>
                                        <Link
                                            className="nav-link"
                                            to="/"
                                            onClick={
                                                authenticationService.logout
                                            }
                                        >
                                            Logout
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="nav-link"
                                            to="/articles"
                                        >
                                            Articles
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="nav-link"
                                            to="/users/:id/articles"
                                        >
                                            My Articles
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="nav-link"
                                            to="/users/:id/comments"
                                        >
                                            My Comments
                                        </Link>
                                    </li>
                                </ul>
                            )}

                            {isAdmin ? (
                                <li>
                                    <Link className="nav-link" to="/users">
                                        Users
                                    </Link>
                                </li>
                            ) : (
                                ""
                            )}
                        </ul>
                    </div>
                </nav>
                <div>{this.props.children}</div>
            </div>
        );
    }
}

export default Navbar;
