import React, { Component } from "react";

class UptimePeerAnswer extends Component {
  render() {
    return (
      <div className="ApiPeersAnswer">
        {/* <Item address={apiAnswer[0].address} id={apiAnswer[0].id} key={apiAnswer[0].id} /> */}
        {/* will use condition rendering this.props.testState === 'a' && ... */}
        {this.props.apiAnswer
          .filter(a => a.measurements.uptime >= this.props.uptime)
          .map(a => (
            <Item
              address={a.address}
              id={a.id}
              key={a.id}
              uptime={a.measurements.uptime}
              version={a.measurements.version}
              platform={a.measurements.platform}
            />
          ))}
        {console.log(this.props.apiAnswer)}
      </div>
    );
  }
}

function Item(props) {
  return (
    <div className="Item">
      <span id={props.id}>Address: {props.address} </span>
      <span>Id: {props.id} </span>
      <span>Uptime: {props.uptime} </span>
      <span>Version: {props.version} </span>
      <span>Platform: {props.platform} </span>

      <hr />
    </div>
  );
}

export default UptimePeerAnswer;
