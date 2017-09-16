import React, { Component } from 'react'
import { Modal, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { api } from '../config'
import './Float.css'

class Float extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isShowModal: false
    }

    this.toggleModal = this.toggleModal.bind(this)
    this.handleCreatePosition = this.handleCreatePosition.bind(this)
  }

  toggleModal(isShow) {
    this.setState({
      isShowModal: isShow
    })
  }

  handleCreatePosition() {
    const body = {
      pageName: this.pageName.value,
      positionName: this.positionName.value
    }

    fetch(
      api.position,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    ).then(
      response => response.json()
    ).then(json => {
      console.log(json)
      this.setState({ isUpload: false })
      window.location.reload()
    }).catch(err => {
      console.log(err)
      this.setState({ isUpload: false })
    })
  }

  render() {
    return (
      <div id="add-float" onClick={() => {
        this.toggleModal(true)
      }}>
        <Modal show={this.state.isShowModal} onHide={() => {
          this.toggleModal(false)
        }}>
          <Modal.Header>
            <Modal.Title>Thêm vị trí</Modal.Title>
          </Modal.Header>

           <Modal.Body>
             <FormGroup controlId='positionName'>
                <ControlLabel>Position name</ControlLabel>
                <FormControl name="positionName"  inputRef={ref => {this.positionName = ref}}/>
            </FormGroup>

            <FormGroup controlId="pageName">
              <ControlLabel>Page name</ControlLabel>
              <FormControl componentClass="select" inputRef={ref => { this.pageName = ref }}>
                <option value="cho">Chợ</option>
                <option value="dealDetail">Deal detail</option>
                <option value="muaOnline">Mua online</option>
                <option value="BoSuuTap">Bộ sưu tập</option>
                <option value="brandDetail">Brand Detail</option>
              </FormControl>
            </FormGroup>
           </Modal.Body>

           <Modal.Footer>
              <Button onClick={() => {
                this.toggleModal(false)
              }}>Close</Button>
              <Button bsStyle="primary" onClick={this.handleCreatePosition}>Create Position</Button>
            </Modal.Footer>
        </Modal>
        <span className="glyphicon glyphicon-plus"></span>
      </div>
    );
  }

}

export default Float;
