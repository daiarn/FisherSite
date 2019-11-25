import React, { Component } from "react";
import Navbar from "./navbar";
import axios from "axios";

class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isLoaded: false
        };
    }

    componentDidMount() {
        axios.get("https://localhost:5001/api/users").then(res => {
            const data = res.data;
            this.setState({ data: data, isLoaded: true });
        });
    }

    render() {
        const { isLoaded, data } = this.state;
        return (
            <div>
                <Navbar />
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
