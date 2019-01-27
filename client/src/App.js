import React, { Component } from 'react';
import request from 'request';
import './App.css';

var options = { method: 'POST',
  url: 'http://localhost:5000/api/peer',
  headers: 
   { 'Content-Type': 'application/json'}, 
  body: { id: 1 },
  
  json: true };




class App extends Component {
  constructor(props){
  super(props);
  this.state = {
    error: null,
    isLoaded: false,
    apiAnswer: ""
   } 
   
  }
  componentDidMount() {
    var response = request(options);
    this.setState({
      apiAnswer: response
    })
   
    } 
 
    
    
    
  render() {
   
  
      return (

      <div className="App"> 
        <p>{console.log(this.apiAnswer)}</p>
        <Table />  
      </div>
    );
    }
  }


export default App;

class Table extends Component {
  
  render() {
         return( <div id="Table">

         </div> );
  }
}