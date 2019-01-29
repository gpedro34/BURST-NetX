import React, { Component } from "react";

class IdPeersAnswer extends Component {
  render() {
    return (
      <div className="ApiPeersAnswer">
        <p>{JSON.stringify(this.props.apiAnswer)}</p>
        {console.log(this.props.apiAnswer)}
      </div>
    );
  }
}

export default IdPeersAnswer;
