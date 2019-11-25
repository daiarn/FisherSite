import React, { Component } from "react";
import Navbar from "./navbar";
import axios from "axios";

class Articles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            user: null,
            isLoaded: false
        };
    }

    componentDidMount() {
        axios.get("https://localhost:5001/api/articles").then(res => {
            const data = res.data;
            this.setState({ data: data, isLoaded: true });
        });
    }

    render() {
        const { data, isLoaded } = this.state;
        console.log(data);
        return (
            <div>
                <Navbar />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Text</th>
                            <th>Comments Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoaded ? (
                            data.map(article => (
                                <tr key={article.id}>
                                    <td>{article.title}</td>
                                    <td>{article.text}</td>
                                    <td>{article.comments.length}</td>
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

export default Articles;
