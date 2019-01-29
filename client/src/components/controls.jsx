import React, { Component } from "react";

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
          />
          <br />
          <input
            className="Input"
            placeholder="amaunt to display"
            name="amaunt"
            ref="amaunt"
            type="number"
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
