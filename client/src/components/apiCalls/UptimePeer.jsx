import React, { Component } from "react";
import axios from "axios";
import UptimePeerAnswer from "./../apiAnswers/UptimePeerAnswer.jsx";

class UptimePeer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      apiAnswer: []
    };
  }
  componentDidMount() {
    this.apicallAll();
  }

  componentWillReceiveProps() {
    setTimeout(this.apicallAll, 200);
    this.setState({
      isLoaded: false
    });
  }

  apicallAll = () => {
    axios
      .post("http://localhost:5000/api/peers", {
        requestType: "peers",
        start: 1,
        amount: -1
      })
      .then(
        result => {
          this.setState({
            isLoaded: true,
            apiAnswer: result.data.peers
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  };

  render() {
    const { error, isLoaded, apiAnswer } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div id="loading">Loading...</div>;
    } else {
      return (
        <div>
          <UptimePeerAnswer apiAnswer={apiAnswer} uptime={this.props.uptime} />
        </div>
      );
    }
  }
}

export default UptimePeer;
