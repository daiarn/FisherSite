import React from "react";
import { authenticationService } from "../services/authentication";

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newUser: {
                Name: "",
                Surname: "",
                Username: "",
                Password: ""
            },
            isSubmitting: false
        };

        if (authenticationService.currentUserValue) {
            this.props.history.push("/");
        }
    }

    hangleChange = event => {
        event.preventDefault();
        const name = event.target.name;
        const { newUser } = this.state;
        newUser[name] = event.target.value;
        this.setState({ newUser });
    };

    handleSubmit = event => {
        event.preventDefault();
        const { newUser, isSubmitting } = this.state;
        if (
            newUser.Name.length <= 0 ||
            newUser.Surname.length <= 0 ||
            newUser.Username.length <= 0 ||
            newUser.Password.length <= 0
        )
            return;
        this.setState({ isSubmitting: !isSubmitting });
        authenticationService.register(newUser).then(window.location.reload());
    };

    render() {
        const { newUser, isSubmitting } = this.state;
        return (
            <div className="App container">
                <h2>Register</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            name="Name"
                            type="text"
                            className="form-control"
                            onChange={this.hangleChange}
                            value={newUser.Name}
                            placeholder="enter your name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="surname">Surname</label>
                        <input
                            name="Surname"
                            type="text"
                            className="form-control"
                            onChange={this.hangleChange}
                            value={newUser.Surname}
                            placeholder="enter your surname"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            name="Username"
                            type="text"
                            className="form-control"
                            onChange={this.hangleChange}
                            value={newUser.Username}
                            placeholder="enter your username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            name="Password"
                            type="password"
                            className="form-control"
                            onChange={this.hangleChange}
                            value={newUser.Password}
                            placeholder="enter ypur password"
                        />
                    </div>
                    <div className="form-group">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Register;
