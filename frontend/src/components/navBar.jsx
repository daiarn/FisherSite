import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
    render() {
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
                            <li>
                                <Link className="nav-link" to="/users">
                                    Users
                                </Link>
                            </li>
                            <li>
                                <Link className="nav-link" to="/articles">
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
                    </div>
                </nav>
                <div>{this.props.children}</div>
            </div>
        );
    }
}

export default Navbar;
