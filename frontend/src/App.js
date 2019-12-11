import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UsersTable from "./components/usersTable";
import Home from "./components/home";
import Articles from "./components/articles";
import Article from "./components/article";
import MyArticles from "./components/myArticles";
import MyComments from "./components/myComments";
import { LoginPage } from "./pages/login";
import { HomePage } from "./pages/register";
import { history } from "./helpers/history";
import Navbar from "./components/navbar";

function App() {
    return (
        <Router history={history}>
            <div>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <Route exact path="/users">
                        <UsersTable />;
                    </Route>
                    <Route path="/login">
                        <LoginPage />;
                    </Route>
                    <Route path="/home">
                        <HomePage />;
                    </Route>
                    <Route exact path="/articles">
                        <Articles />
                    </Route>
                    <Route
                        exact
                        path="/article"
                        render={props => <Article {...props} />}
                    />
                    {/* <Article />
                    </Route> */}
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
