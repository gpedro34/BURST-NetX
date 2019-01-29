import React, { Component } from "react";
import axios from "axios";
import AddressPeerAnswer from "./../apiAnswers/AddressPeerAnswer.jsx";

class AddressPeer extends Component {
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
    .post("http://localhost:5000/api/peer", {
        address: this.props.address
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
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div id="loading">Loading...</div>;
    } else {
      return (
        <div>
            
          <AddressPeerAnswer apiAnswer={apiAnswer} />
        </div>
      );
    }
  }
}

export default AddressPeer;