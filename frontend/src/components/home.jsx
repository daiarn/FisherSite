import React, { Component } from "react";
import { UncontrolledCarousel } from "reactstrap";
import p1 from "../p1.jpg";
import p2 from "../p2.jpg";
import p3 from "../p3.jpg";

const items = [
    {
        src: p1,
        altText: "Slide 1",
        caption: "Slide 1"
    },
    {
        src: p2,
        altText: "Slide 2",
        caption: "Slide 2"
    },
    {
        src: p3,
        altText: "Slide 3",
        caption: "Slide 3"
    }
];

class Home extends Component {
    render() {
        return (
            <div className="App container">
                <h1>Home page</h1>
                <UncontrolledCarousel items={items} />
            </div>
        );
    }
}

export default Home;
