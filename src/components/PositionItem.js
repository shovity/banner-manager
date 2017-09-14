import React, { Component } from 'react'
import { Panel } from 'react-bootstrap'
import Deal from './Deal'
import { api } from '../config'
import "react-toggle/style.css"
import './PositionItem.css'

class PositionItem extends Component {


  // handleUpload() {
  //
  //   const body = {
  //     id: this.props.position.id,
  //     ...this.state.deal,
  //     newName: this.textCT.value,
  //     deal_link: this.textDL.value
  //   }
  //   console.log('uploading...');
  //
  //   fetch(
  //     api.upload,
  //     {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(body),
  //     }
  //   ).then(
  //     response => response.json()
  //   ).then(json => {
  //     console.log(json)
  //     this.setState({ isUpload: false })
  //   }).catch(err => {
  //     console.log(err)
  //     this.setState({ isUpload: false })
  //   })
  // }

  render() {

    // const listImagePreview = this.state.deal.images && Object.keys(this.state.deal.images).map((v, i) => {
    //   //
    //   return (
    //     <div key={i} className="preview-box">
    //
    //       <InputGroup bsSize="small">
    //         <InputGroup.Addon>Size: {v}</InputGroup.Addon>
    //         <a onClick={() => {this.refs[`inputFile-${v}`].click()}}className="btn btn-sm btn-default">
    //           Choose
    //         </a>
    //       </InputGroup>
    //
    //       <img src={this.state.deal.images[v]} className="banner-preview" alt="" />
    //
    //       <input
    //         className="hidden"
    //         onChange={e => {
    //           this.handleInputChange(e, v)
    //         }}
    //         ref={`inputFile-${v}`}
    //         type="file" />
    //
    //     </div>
    //   )
    // })

    const listDeal = this.props.position.deals.map((v, i) => {
      //
      return <Deal deal={v} />
    })

    return (
      <Panel className="deals" header={`Vị trí: ${this.props.position.position} (${this.props.position.id}) `}>
        {listDeal}
      </Panel>
    );
  }

}

export default PositionItem;
