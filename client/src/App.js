import React, { Component } from "react";
import "./App.css";
import Table from "./components/table.jsx";
import Controls from "./components/controls.jsx";
import axios from "axios";

/*apiCallType allPeers, idPeer, addressPeer, uptimePeer.
  default state this.state = {
      apiCallType: "allPeers",    
      startFromId: 1,
      amaunt: -1,
      address: "",
      uptime: 80
    }; */

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      apiAnswer: [],
      apiCallType: "allPeers",    
      startFromId: 1,
      amaunt: -1,
      id: "",
      address: "",
      uptime: 80
    };
    
  }
  componentDidMount() {
    this.apicallAll();
    }

  resetLoad = () => {
    this.setState({
      isLoaded: false
    })
  }

  apicallAll = () => {
    axios.post("http://localhost:5000/api/peers", {
      requestType: "peers",
       start: this.state.startFromId, 
       amount: this.state.amaunt
    })
      .then(
      result => {
        this.setState({
          isLoaded: true,
          apiAnswer: result.data.peers
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
  apicallId = () => {
    axios.post("http://localhost:5000/api/peer", {
     id: this.state.id
    })
      .then(
      result => {
        this.setState({
          isLoaded: true,
          apiAnswer: result.data.peers
        });
       }
      );
    }
  hendleAllPeers = (type, id, ama) => {
    this.setState({
      apiCallType: type,
      startFromId: id,
      amaunt: ama
      });
      setTimeout(this.apicallAll, 200)
    }
  hendlePeerById = (type, idPeer) => {
    this.setState({
      apiCallType: type,
      id: idPeer     
      });
      setTimeout(this.apicallId, 200)
  }
  hendlePeerByAddress = (type, address) => {
    this.setState({
      apiCallType: type,
      address: address      
    });
  }
  hendleUptime = (type, uptime) => {
    this.setState({
      apiCallType: type,
      uptime: uptime      
    });
  }
  render() {
    
    const { startFromId, amaunt, apiAnswer, error, isLoaded, id, apiCallType  } = this.state;
  
   
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div id="loading">Loading...</div>;
      } else  { 
    
    return (
       <div className="App">
        
        <Controls hendleAllPeers={this.hendleAllPeers} hendlePeerById={this.hendlePeerById} hendlePeerByAddress={this.hendlePeerByAddress} hendleUptime={this.hendleUptime}/>
        <Table
           apiAnswer={apiAnswer}
           apiCallType={apiCallType}
        />
        {/*<PeerById />
        <PeerByAddress />
        <PeerByUptime />*/}
        {console.log(startFromId, id, apiCallType)}
       
        {/*<ApicallAll startFromId={startFromId} amaunt={amaunt} />*/}
      </div>
    );
  }
}
}
export default App;
/*
function ApicallAll(props){
  
  axios.post("http://localhost:5000/api/peers", {
    requestType: "peers",
     start: props.startFromId, 
     amount: props.amaunt
  })
    .then(
    result => 
         
      console.log(result.data.peers)
      );
    }
      */
 
