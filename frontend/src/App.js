import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UsersTable from "./components/usersTable";
import Home from "./components/home";
import Articles from "./components/articles";
import Article from "./components/article";
import MyArticles from "./components/myArticles";
import MyComments from "./components/myComments";
import { LoginPage } from "./pages/login";
import Register from "./pages/register";
//import { HomePage } from "./pages/register";
import { history } from "./helpers/history";
import Navbarr from "./components/navbar";
import Footer from "./components/Footer";

function App() {
    return (
        <Router history={history}>
            <div>
                <Navbarr history={history} />
                <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <Route exact path="/users">
                        <UsersTable />;
                    </Route>
                    <Route
                        exact
                        path="/login"
                        render={props => <LoginPage {...props} />}
                    />
                    <Route
                        exact
                        path="/register"
                        render={props => <Register {...props} />}
                    />
                    <Route exact path="/articles">
                        <Articles />
                    </Route>
                    <Route
                        exact
                        path="/articles/:id"
                        render={props => <Article {...props} />}
                    />
                    <Route path="/users/:id/articles">
                        <MyArticles />
                    </Route>
                    {/* <Route path="/users/:id/comments">
                        <MyComments />
                    </Route> */}
                    <Route
                        exact
                        path="/users/:id/comments"
                        render={props => <MyComments {...props} />}
                    />
                </Switch>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
