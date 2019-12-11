import React from "react";
//import { Formik, Field, Form, ErrorMessage } from "formik";
//import * as Yup from "yup";
import { history } from "../helpers/history";

import { authenticationService } from "../services/authentication";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            history.goBack();
            //history.replace("/");
        }

        this.state = {
            username: "",
            password: "",
            isSubmitting: false
        };
    }

    hangleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        const { username, password, isSubmitting } = this.state;
        if (username.length <= 0 || password.length <= 0) return;
        this.setState({ isSubmitting: !isSubmitting });
        authenticationService
            .login(username, password)
            .then(history.replace("/"));
    };

    render() {
        const { username, password, isSubmitting } = this.state;
        return (
            <div>
                <h2>Login</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            name="username"
                            type="text"
                            className="form-control"
                            onChange={this.hangleChange}
                            value={username}
                            placeholder="enter your username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            onChange={this.hangleChange}
                            value={password}
                            placeholder="enter ypur password"
                        />
                    </div>
                    <div className="form-group">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export { LoginPage };
