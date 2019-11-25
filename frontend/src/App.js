import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UsersTable from "./components/usersTable";
import Home from "./components/home";
import Articles from "./components/articles";
import MyArticles from "./components/myArticles";
import MyComments from "./components/myComments";

function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <Route exact path="/users">
                        <UsersTable />;
                    </Route>
                    <Route path="/articles">
                        <Articles />
                    </Route>
                    <Route path="/users/:id/articles">
                        <MyArticles />
                    </Route>
                    <Route path="/users/:id/comments">
                        <MyComments />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
