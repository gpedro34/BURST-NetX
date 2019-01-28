import React, { Component } from "react";
import "./App.css";
import axios from "axios";

const axiosAll = axios.create({
  method: "post",
  baseURL: "http://localhost:5000/api/peers",
  data: { requestType: "peers", start: 1, amount: -1 }
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <Table />
      </div>
    );
  }
}

export default App;

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      apiAnswer: []
    };
  }

  /* async componentDidMount() {      //this bad because at first it try to renders latter do api call, at first need to get answer, then render
      try {
        await axiosAll()
          .then(res=>{
          console.log(res.data.peers[0].address);
          axiosAllanswer = res.data.peers;      //not works directly if sets, frows undefined 
          this.setState({
            apiAnswer: axiosAllanswer           //setting peer array to state
          });
          
        });
      } catch (err){
        console.error('err', err);
      }
    } */
  componentDidMount() {
    this.apicallTest();
  }

  apicallTest = () => {
    axiosAll().then(
      result => {
        this.setState({
          isLoaded: true,
          apiAnswer: result.data.peers
        });
        console.log(result.data.peers);
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
        <div className="Table">
          {console.log(apiAnswer)}{" "}
          {/* <Item address={apiAnswer[0].address} id={apiAnswer[0].id} key={apiAnswer[0].id} /> */}
          {apiAnswer.map(a => (
            <Item address={a.address} id={a.id} key={a.id} />
          ))}
        </div>
      );
    }
  }
}

function Item(props) {
  return (
    <div className="Item" id={props.id} key={props.id}>
      <p>{props.address}</p>
    </div>
  );
}
