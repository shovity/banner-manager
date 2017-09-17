import React, { Component } from 'react'
import { Panel } from 'react-bootstrap'
import Deal from './Deal'
import { api } from '../config'
import "react-toggle/style.css"
import './PositionItem.css'

class PositionItem extends Component {

  constructor(props) {
    super(props)

    this.handleAddDeal = this.handleAddDeal.bind(this)
  }

  handleAddDeal() {
    const body = {
      pid: this.props.position.id
    }

    fetch(
      api.deal,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    ).then(
      response => response.json()
    ).then(json => {
      console.log(json)
      window.location.reload()
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    const listDeal = this.props.position.deals.map((v, i) => {
      //
      return (
        <div key={i}>
          <Deal deal={v} index={i} pid={this.props.position.id} />
        </div>
      )
    })

    return (
      <div className="deal-box">
        <div className="btn-add-deal text-success" onClick={this.handleAddDeal}>
          <span className="glyphicon glyphicon-plus"></span>
        </div>
        <Panel className="deals" header={`Vị trí: ${this.props.position.position} (${this.props.position.id}) | ${this.props.position.page} `}>
          {listDeal}
        </Panel>
      </div>
    );
  }
}

export default PositionItem;
