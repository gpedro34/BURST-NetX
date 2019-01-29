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
      uptime: 80
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
      apiCallType
    } = this.state;

    return (
      <div className="App">
        <Controls
          hendleAllPeers={this.hendleAllPeers}
          hendlePeerById={this.hendlePeerById}
          hendlePeerByAddress={this.hendlePeerByAddress}
          hendleUptime={this.hendleUptime}
        />

        <ApiCalls
          apiCallType={apiCallType}
          startFromId={startFromId}
          amaunt={amaunt}
          id={id}
          address={address}
          uptime={uptime}
        />
      </div>
    );
  }
}

export default App;
