import React, { Component } from 'react';
import request from 'request';
import './App.css';

var options = { method: 'POST',
  url: 'http://localhost:5000/api/peer',
  headers: 
   { 'Postman-Token': 'd47c2715-ec6a-450e-9ffd-d9bedd596f22',
   'cache-control': 'no-cache',
   'Content-Type': 'application/json'}, 
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
    var data = JSON.stringify({
      "id": 1
    });
    
    var xhr = new XMLHttpRequest();
    
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });
    
    xhr.open("POST", "http://127.0.0.1:5000/api/peer");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("Postman-Token", "77e454e8-a7eb-456b-978a-54614a6fc0ae");
    
    xhr.send(data);
       } 
 
 
    
  render() {
   
  
      return (

      <div className="App"> 
        <p>{console.log()}</p>
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