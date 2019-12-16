import React from "react";

import { authenticationService } from "../services/authentication";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            isSubmitting: false
        };

        if (authenticationService.currentUserValue) {
            this.props.history.push("/");
        }
    }

    hangleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        const { username, password, isSubmitting } = this.state;
        if (username.length <= 0 || password.length <= 0) return;
        this.setState({ isSubmitting: !isSubmitting });
        authenticationService.login(username, password).then(() => {
            window.location.reload();
        });
    };

    render() {
        const { username, password, isSubmitting } = this.state;
        return (
            <div className="App container">
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
