import React, { Component } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'
import Toggle from 'react-toggle'
import { api } from '../config'

class Deal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      deal: this.props.deal
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ deal: nextProps.deal })
  }

  handleOnChange(name) {
    return event => {
      const object = {}
      object[name + ''] = event.target.value
      if (name === 'is_active') object[name + ''] = !this.state.deal.is_active
      this.setState({
        deal: {
          ...this.state.deal,
          ...object
        }
      })
    }
  }

  handleUpload() {
    const body = {
      pid: this.props.pid,
      deal: this.state.deal,
      deal_index: this.props.index,
    }
    console.log('uploading...');
    console.log(body);

    fetch(
      api.position,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    ).then(
      response => response.json()
    ).then(json => {
      console.log(json)
      window.alert('Upload success')
      this.setState({ isUpload: false })
    }).catch(err => {
      console.log(err)
      this.setState({ isUpload: false })
    })
  }

  handleInputChange(e, size) {
    const input = this.refs[`inputFile-${size}`]
    if (input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = e => {
        const objectSize = {}
        objectSize[size] = e.target.result
        this.setState({
          deal: {
            ...this.state.deal,
            images: {
              ...this.state.deal.images,
              ...objectSize
            }
          }
        })
      }
      reader.readAsDataURL(input.files[0])
    }
  }

  render() {
    const listImagePreview = this.state.deal.images && Object.keys(this.state.deal.images).map((v, i) => {
      //
      return (
        <div key={i} className="preview-box">

          <InputGroup bsSize="small">
            <InputGroup.Addon>Size: {v}</InputGroup.Addon>
            <a onClick={() => {this.refs[`inputFile-${v}`].click()}} className="btn btn-sm btn-default">
              Choose
            </a>
          </InputGroup>

          <img src={this.state.deal.images[v]} className="banner-preview" alt="" />

          <input
            className="hidden"
            onChange={e => {
              this.handleInputChange(e, v)
            }}
            ref={`inputFile-${v}`}
            type="file" />

        </div>
      )
    })


    return (
      <div className="deal col-sm-12">
        <div className="col-sm-7 box-preview">
          {listImagePreview}
        </div>

        <div className="col-sm-5 box-info">
          <div className="container-fluid">

            <div className="row info">

              <InputGroup bsSize="small">
                <InputGroup.Addon>Chương trình</InputGroup.Addon>
                  <FormControl type="text" value={this.state.deal.name} onChange={this.handleOnChange('name')} />
              </InputGroup>

              <InputGroup  bsSize="small">
                <InputGroup.Addon>Deal link</InputGroup.Addon>
                <FormControl type="text" value={this.state.deal.deal_link} onChange={this.handleOnChange('deal_link')} />
              </InputGroup>

              <label>
                <Toggle icons={false} checked={this.state.deal.is_active} onChange={this.handleOnChange('is_active')} />
                <span>Active</span>
              </label>

              <div>
                <a className="btn btn-primary btn-upload" onClick={this.handleUpload}>Upload</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

}

export default Deal;
