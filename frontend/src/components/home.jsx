import React, { Component } from "react";
import Navbar from "./navbar";

class Home extends Component {
    render() {
        return (
            <div>
                <Navbar />
                <h4>I am at home</h4>
            </div>
        );
    }
}

export default Home;
