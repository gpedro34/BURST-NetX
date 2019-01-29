import React, { Component } from "react";
import AllPeers from "./apiCalls/AllPeers.jsx";
import IdPeer from "./apiCalls/IdPeer.jsx";
import AddressPeer from "./apiCalls/AddressPeer.jsx";
import UptimePeer from "./apiCalls/UptimePeer.jsx";

//apiCallType allPeers, idPeer, addressPeer, uptimePeer.
class ApiCalls extends Component {
  render() {
    if (this.props.apiCallType === "allPeers") {
      return (
        <div className="Answers">
          <AllPeers
            startFromId={this.props.startFromId}
            amaunt={this.props.amaunt}
          />
        </div>
      );
    } else if (this.props.apiCallType === "idPeer") {
      return (
        <div>
          <IdPeer id={this.props.id} />
        </div>
      );
    } else if (this.props.apiCallType === "addressPeer") {
      return (
        <div>
          <AddressPeer address={this.props.address} />
        </div>
      );
    } else if (this.props.apiCallType === "uptimePeer") {
      return (
        <div>
          <UptimePeer uptime={this.props.uptime} />
        </div>
      );
    }
  }
}

export default ApiCalls;
