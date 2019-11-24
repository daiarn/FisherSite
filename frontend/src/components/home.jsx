import React, { Component } from "react";
import NavBar from "./navBar";

class Home extends Component {
    render() {
        return (
            <div>
                <NavBar />
                <h4>I am at home</h4>
            </div>
        );
    }
}

export default Home;
