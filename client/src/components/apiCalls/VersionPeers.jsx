import React, { Component } from "react";
import axios from "axios";
import IdPeersAnswer from "./../apiAnswers/IdPeersAnswer.jsx";
import apiAddress from "./../../defaults";

class VersionPeers extends Component {
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
    console.log("primas")
   
    
  }

  componentWillReceiveProps() {
    setTimeout(this.apicallAll, 200);
    this.setState({
        isLoaded: false
    })
    console.log("antras")
  }
  

  apicallAll = () => {
    axios
    .post(apiAddress + "api/peers", {
        requestType: "peersbyVersion",
        version: this.props.version
      })
      .then(
        result => {
            this.setState({
                isLoaded: true,
                apiAnswer: result.data
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
      return <div id="error">Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div id="loading">Loading...</div>;
    } else {
      return (
        <div>
            
          <IdPeersAnswer apiAnswer={apiAnswer} />
        </div>
      );
    }
  }
}

export default VersionPeers;
