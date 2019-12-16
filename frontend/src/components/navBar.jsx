import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authenticationService } from "../services/authentication";
import jwt from "jwt-decode";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem
} from "reactstrap";
import book from "../book.svg";

class Navbarr extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            showNavbar: false
        };

        if (!authenticationService.currentUserValue) {
            this.props.history.push("/");
        }
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        //let isAdmin = false;
        let id = "";
        const currentUser = authenticationService.currentUserValue;
        if (currentUser) {
            const user = jwt(currentUser.token);
            //isAdmin = user.role === "Admin";
            id = user.id;
        }
        if (!authenticationService.currentUserValue) {
            this.props.history.push("/");
        }

        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">
                        <img src={book} width="100" height="50" alt="book" />
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="mr-aut" navbar>
                            <NavItem>
                                <Link className="nav-link" to="/">
                                    Home
                                </Link>
                            </NavItem>
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
                                            to={`/users/${id}/articles`}
                                        >
                                            My Articles
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="nav-link"
                                            to={`/users/${id}/comments`}
                                        >
                                            My Comments
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="nav-link" to="/users">
                                            Users
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default Navbarr;
