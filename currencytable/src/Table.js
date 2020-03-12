import React, { Component } from 'react'
import './TableStyle.css'


class Table extends Component {

   ws = new WebSocket("ws://localhost:8080")
   componentDidMount() {

      this.ws.onopen = () => {
         this.ws.send("");
         console.log('connected')
      }

      this.ws.onmessage = evt => {
         console.log(evt.data)
         const message = evt.data
         var moment = require('moment')
         this.addMessage(message, moment().format("HH:mm:SS YYYY MM"), moment())

      }

      this.ws.onclose = () => {
         alert("Socket Closed by Server");
      }
   }

   addMessage(message, date, mnt) {
      if (!isNaN(+message.substring(0, message.length - 1))) {
         if (this.state.items.length === 30) {
            this.state.items.pop()
         }
        this.setState({ items: [[message, date, mnt], ...this.state.items] })
         this.updatePlus()
         this.setAvg()
      }
   }

   updatePlus() {
      this.setState({sum:0,count:0})
      return this.state.items.map((item, index) => {

         var moment = require('moment')
         var end = moment(this.state.items[0][1].split(' ')[0],"HH:mm:ss")
         var duration = end.diff(moment(item[1].split(' ')[0],"HH:mm:ss"),'seconds')

         if (duration <= 60) {
            this.setState({ sum: this.state.sum + parseInt(item[0].substring(0, item[0].length - 1)) })
            this.setState({ count: this.state.count + 1 })
         }
      })

   }

   async setAvg(){
      await this.setState({ave : this.state.sum/this.state.count})
   }

   constructor(props) {
      super(props)
      this.state = {
         items: [],
         ave:-1,
         sum: 0,
         count: 0,
      }

   }

   renderTableData() {
      return this.state.items.slice(0).map((item, index) => {
         const id = +item[0]
         console.log(typeof (item))
         return (
            <tr key={id}>
               <td>{item[0]}</td>
               <td>{item[1]}</td>
               <td>{index + 1}</td>
            </tr>
         )
      })

   }

   renderTableHeader() {
      let header = ["قیمت", "زمان", "ردیف"]
      return header.map((key, index) => {
         return <th key={index}>{key}</th>
      })
   }

   render() {
      return (
         <div>
            <h1 id='title'>React Dynamic Table</h1>
            { this.state.ave === -1 ?
            <h2 id='avrage'>میانگین : داده‌ای وجود ندارد</h2> :
            <h2 id='avrage'>میانگین {this.state.ave}</h2>}
            <table id='items'>
               <tbody>
                  <tr>{this.renderTableHeader()}</tr>
                  {this.renderTableData()}
               </tbody>
            </table>
         </div>
      )
   }
}


export default Table
