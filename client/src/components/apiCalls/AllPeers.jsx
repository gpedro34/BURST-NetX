import React, { Component } from "react";
import axios from "axios";
import ApiPeersAnswer from "./../apiAnswers/AllPeersAnswer.jsx";
import apiAddress from "./../../defaults";

class AllPeers extends Component {
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
      .post(apiAddress + "api/peers", {
        requestType: "peers",
        start: this.props.startFromId,
        howMany: this.props.amaunt
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
          <ApiPeersAnswer apiAnswer={apiAnswer} />
        </div>
      );
    }
  }
}

export default AllPeers;
