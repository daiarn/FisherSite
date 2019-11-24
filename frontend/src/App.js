import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UsersTable from "./components/usersTable";
import Home from "./components/home";

function App() {
    const users = [
        { id: 1, name: "name", surname: "surname" },
        { id: 2, name: "name", surname: "surname" },
        { id: 3, name: "name", surname: "surname" }
    ];
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <Route path="/users">
                        <UsersTable users={users} />;
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
