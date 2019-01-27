import React, { Component } from 'react';
import request from 'request';
import './App.css';

var options = { method: 'POST',
  url: 'http://127.0.0.1:5000/api/peer',
  headers: 
   {  'Postman-Token': 'ebf4d973-256f-4d20-abfc-2c5217aa8f91',
   'cache-control': 'no-cache', 'Content-Type': 'application/json'}, 
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