import React from "react";
import jwt from "jwt-decode";
import { userService } from "../services/userService";
import { authenticationService } from "../services/authentication";

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            users: null
        };
    }

    componentDidMount() {
        userService.getAllUsers().then(users => this.setState({ users }));
    }

    render() {
        const { currentUser, users } = this.state;
        //console.log(currentUser);
        //console.log(users);
        console.log(jwt(currentUser.token));
        return (
            <div>
                <h1>Hi !</h1>
                <p>You're logged in with React & JWT!!</p>
                <h3>Users from secure api end point:</h3>
                {users && (
                    <ul>
                        {users.map(user => (
                            <li key={user.id}>
                                {user.name} {user.surname}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

export { HomePage };
