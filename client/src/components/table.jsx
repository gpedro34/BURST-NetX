import React, { Component } from "react";

class Table extends Component {

    shouldComponentUpdate(){
        if (this.props.apiCallType !== "allPeers"){
            return false
        }
        return true
    }
  render() {
    return (
      <div className="Table">
        {/* <Item address={apiAnswer[0].address} id={apiAnswer[0].id} key={apiAnswer[0].id} /> */}
        {/* will use condition rendering this.props.testState === 'a' && ... */}
        {this.props.apiAnswer.map(a => (
          <Item
            address={a.address}
            id={a.id}
            key={a.id}
            uptime={a.measurements.uptime}
            version={a.measurements.version}
            platform={a.measurements.platform}
          />
        ))}
      </div>
    );
  }
}

function Item(props) {
  return (
    <div className="Item">
      <span id={props.id}>Address: {props.address} </span>
      <span>Uptime: {props.uptime} </span>
      <span>Version: {props.version} </span>
      <span>Platform: {props.platform} </span>
      <hr />
    </div>
  );
}

export default Table;
