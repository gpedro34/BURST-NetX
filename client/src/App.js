import React, { Component } from "react";
import "./App.css";
import Controls from "./components/controls.jsx";
import ApiCalls from "./components/ApiCalls.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiCallType: "allPeers",
      startFromId: 1,
      amaunt: -1,
      id: 1,
      address: "",
      uptime: 80,
      version: "2.2.7",
      height: 500000
    };
  }

  hendleAllPeers = (type, id, ama) => {
    this.setState({
      apiCallType: type,
      startFromId: id,
      amaunt: ama
    });
  };
  hendlePeerById = (type, idPeer) => {
    this.setState({
      apiCallType: type,
      id: idPeer
    });
  };
  hendlePeerByAddress = (type, address) => {
    this.setState({
      apiCallType: type,
      address: address
    });
  };
  hendlePeerByVersion = (type, version) => {
    this.setState({
      apiCallType: type,
      version: version
    });
  };
  hendlePeerByHeight = (type, height) => {
    this.setState({
      apiCallType: type,
      height: height
    });
  };

  hendleUptime = (type, uptime) => {
    this.setState({
      apiCallType: type,
      uptime: uptime
    });
  };
  render() {
    const {
      startFromId,
      amaunt,
      uptime,
      address,
      id,
      apiCallType,
      version,
      height
    } = this.state;

    return (
      <div className="App">
        <Controls
          hendleAllPeers={this.hendleAllPeers}
          hendlePeerById={this.hendlePeerById}
          hendlePeerByAddress={this.hendlePeerByAddress}
          hendlePeerByVersion={this.hendlePeerByVersion}
          hendlePeerByHeight={this.hendlePeerByHeight}
          hendleUptime={this.hendleUptime}
        />
        {console.log(this.state.apiCallType)}
        <ApiCalls
          apiCallType={apiCallType}
          startFromId={startFromId}
          amaunt={amaunt}
          id={id}
          address={address}
          uptime={uptime}
          version={version}
          height={height}
        />
      </div>
    );
  }
}

export default App;
