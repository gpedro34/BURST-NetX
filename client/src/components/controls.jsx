import React, { Component } from "react";
//apiCallType allPeers, idPeer, addressPeer, uptimePeer(removed), platformIdPeers, platformPeers, versionIdPeers, versionPeers, heightPeers.
class Controls extends Component {
  allPeers = e => {
    e.preventDefault();
    this.props.hendleAllPeers(
      "allPeers",
      Number(this.refs.id.value),
      Number(this.refs.amaunt.value)
    );
  };
  peerById = e => {
    e.preventDefault();
    this.props.hendlePeerById("idPeer", Number(this.refs.number.value));
    console.log(this.refs.number.value);
  };
  peerByAddress = e => {
    e.preventDefault();
    this.props.hendlePeerByAddress("addressPeer", this.refs.address.value);
    console.log(this.refs.address.value);
  };
  peerByPlatform = e => {
    e.preventDefault();
    this.props.hendlePeerByAddress("platformPeers", this.refs.platform.value);
    console.log(this.refs.platform.value);
  };
  peerByPlatformId = e => {
    e.preventDefault();
    this.props.hendlePeerById("platformIdPeers", this.refs.platformId.value);
    console.log(this.refs.platformId.value);
  };
  peerByVersionId = e => {
    e.preventDefault();
    this.props.hendlePeerById("versionIdPeers", this.refs.platformVersionId.value);
    console.log(this.refs.platformVersionId.value);
  };
  peerByVersion = e => {
    e.preventDefault();
    this.props.hendlePeerByVersion("versionPeers", this.refs.platformVersion.value);
    console.log(this.refs.platformVersion.value);
  };
  peerByHeight = e => {
    e.preventDefault();
    this.props.hendlePeerByHeight("heightPeers", this.refs.height.value);
    console.log(this.refs.height.value);
  };
  peerFilter = e => {
    e.preventDefault();
    this.props.hendleUptime("uptimePeer", Number(this.refs.uptime.value));
    console.log(this.refs.uptime.value);
  };

  render() {
    return (
      <div id="controls">
        <form className="Forms" onSubmit={this.allPeers}>
          <input className="Buttons" type="submit" value="All peers" />
          <br />
          <input
            className="Input"
            placeholder="start from id"
            name="id"
            ref="id"
            type="number"
            defaultValue={1}
          />
          <br />
          <input
            className="Input"
            placeholder="amaunt to display"
            name="amaunt"
            ref="amaunt"
            type="number"
            defaultValue={-1}
          />
          <br />
        </form>
        <form className="Forms" onSubmit={this.peerById}>
          <input className="Buttons" type="submit" value="Peer by ID" />
          <br />
          <input
            className="Input"
            placeholder="id"
            type="number"
            ref="number"
          />
        </form>
        <form className="Forms" onSubmit={this.peerByAddress}>
          <input className="Buttons" type="submit" value="Peer by Address" />
          <br />
          <input
            className="Input"
            placeholder="peer address"
            ref="address"
            type="number/text"
          />
        </form>
        <form className="Forms" onSubmit={this.peerByPlatform}>
          <input className="Buttons" type="submit" value="Peer by Platform" />
          <br />
          <input
            className="Input"
            placeholder="peer platforms name"
            ref="platform"
            type="number/text"
          />
        </form>
        <form className="Forms" onSubmit={this.peerByPlatformId}>
          <input className="Buttons" type="submit" value="Peer by Platform Id" />
          <br />
          <input
            className="Input"
            placeholder="peer platforms Id"
            ref="platformId"
            type="number"
          />
          </form>
          <form className="Forms" onSubmit={this.peerByVersionId}>
          <input className="Buttons" type="submit" value="Peer by Version Id" />
          <br />
          <input
            className="Input"
            placeholder="peer version Id"
            ref="platformVersionId"
            type="number"
          />
          </form>
          <form className="Forms" onSubmit={this.peerByVersion}>
          <input className="Buttons" type="submit" value="Peer by Version" />
          <br />
          <input
            className="Input"
            placeholder="peer version"
            ref="platformVersion"
            type="number"
          />
          </form>
          <form className="Forms" onSubmit={this.peerByHeight}>
          <input className="Buttons" type="submit" value="Peer by Height" />
          <br />
          <input
            className="Input"
            placeholder="peers from height"
            ref="height"
            type="number"
          />
          </form>
        <form className="Forms" onSubmit={this.peerFilter}>
          <input className="Buttons" type="submit" value="Filter by Uptime" />
          <br />
          <input
            className="Input"
            placeholder="from this uptime"
            ref="uptime"
            type="number"
          />
        </form>
      </div>
    );
  }
}


export default Controls;
