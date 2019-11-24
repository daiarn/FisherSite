import React, { Component } from "react";
import NavBar from "./navBar";

class UsersTable extends Component {
    render() {
        // const users = [
        //     { id: 1, name: "name", surname: "surname" },
        //     { id: 2, name: "name", surname: "surname" },
        //     { id: 3, name: "name", surname: "surname" }
        // ];
        const { users } = this.props;
        return (
            <div>
                <NavBar />
                <table className="table">
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>surname</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.surname}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default UsersTable;
