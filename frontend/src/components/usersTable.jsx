import React, { Component } from "react";
import { userService } from "../services/userService";

class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isLoaded: false
        };
    }

    componentDidMount() {
        userService
            .getAllUsers()
            .then(data => this.setState({ data: data, isLoaded: true }));
    }

    render() {
        const { isLoaded, data } = this.state;
        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>surname</th>
                            <th>username</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoaded ? (
                            data.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.surname}</td>
                                    <td>{user.username}</td>
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

export default UsersTable;
