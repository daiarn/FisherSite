import React, { Component } from "react";
import Navbar from "./navbar";

class MyArticles extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <Navbar />
            </div>
        );
    }
}

export default MyArticles;