import React, { Component } from 'react';
import './App.css';

import axios from 'axios';
class App extends Component {
  constructor(props){
  super(props);
    this.state = {
      error: null,
      isLoaded: false,
      apiAnswer: []
     }
   }

   async componentDidMount() {
    try {
      await axios.post('http://localhost:5000/api/peer', { "id": 1 }).then(res=>{
        console.log(res.data);
      });
    } catch (err){
      console.error('err', err);
    }
  }

  render() {


    return (

      <div className="App">
        <p>{}</p>
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
