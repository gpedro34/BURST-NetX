import React, { Component } from "react";
import AllPeers from "./apiCalls/AllPeers.jsx";
import IdPeer from "./apiCalls/IdPeer.jsx";
import AddressPeer from "./apiCalls/AddressPeer.jsx";
import UptimePeer from "./apiCalls/UptimePeer.jsx";
import PlatformPeers from "./apiCalls/PlatformPeers";
import PlatformIdPeers from "./apiCalls/PlatformIdPeers";
import VersionPeers from "./apiCalls/VersionPeers";
import VersionIdPeers from "./apiCalls/VersionIdPeers";
import HeightPeers from "./apiCalls/HeightPeer";

//apiCallType allPeers, idPeer, addressPeer, uptimePeer(removed), platformIdPeers, platformPeers, versionIdPeers, versionPeers, heightPeers.
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
    } else if (this.props.apiCallType === "platformPeers") {
      return (
        <div>
          <PlatformPeers address={this.props.address} />
        </div>
      );
    } else if (this.props.apiCallType === "platformIdPeers") {
      return (
        <div>
           <PlatformIdPeers id={this.props.id} />
           {console.log(this.props.apiCallType)}
        </div>
      );
    } else if (this.props.apiCallType === "versionIdPeers") {
      return (
        <div>
          <VersionIdPeers id={this.props.id} />
           {console.log(this.props.apiCallType)}
        </div>
      );
    } else if (this.props.apiCallType === "versionPeers") {
      return (
        <div>
        <VersionPeers version={this.props.version} />
         {console.log(this.props.apiCallType)}
      </div>
      );
    } else if (this.props.apiCallType === "heightPeers") {
      return (
        <div>
        <HeightPeers height={this.props.height} />
         {console.log(this.props.apiCallType)}
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
