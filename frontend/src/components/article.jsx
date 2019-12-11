import React, { Component } from "react";

class Article extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        console.log(this.props);
        return (
            <div className="App container">
                <h1>Article page</h1>
            </div>
        );
    }
}

export default Article;
