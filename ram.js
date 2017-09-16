import React, { Component } from 'react'
import { DropdownButton, MenuItem, FormControl, InputGroup, ButtonGroup, Panel } from 'react-bootstrap'
import Toggle from 'react-toggle'
import { api } from '../config'
import "react-toggle/style.css"
import './PositionItem.css'

class PositionItem extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isDragOver: false,
      isUpload: false,
      deal: this.props.position.deals[0],
      currentSize: '',
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    // this.handleDragOver = this.handleDragOver.bind(this)
    // this.handleDrop = this.handleDrop.bind(this)
    // this.handleDragLeave = this.handleDragLeave.bind(this)
    // this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.selectSize = this.selectSize.bind(this)
    this.selectDeal = this.selectDeal.bind(this)
    this.onChangeToggleActive = this.onChangeToggleActive.bind(this)
  }

  componentDidMount() {
    this.selectDeal(0)
    // const dropZone = this.refs.dropZone
    // dropZone.addEventListener('drop', this.handleDrop)
    // dropZone.addEventListener('dragover', this.handleDragOver)
    // dropZone.addEventListener('dragleave', this.handleDragLeave)
    // dropZone.addEventListener('dragend', this.handleDragLeave)
  }

  componentWillUnmout() {
    // const dropZone = this.refs.dropZone
    // dropZone.removeEventListener('dragover', this.handleDragOver)
    // dropZone.removeEventListener('drop', this.handleDrop)
    // dropZone.removeEventListener('dragleave', this.handleDragLeave)
    // dropZone.removeEventListener('dragend', this.handleDragEnd)
  }

  handleDragOver(ev) {
    ev.preventDefault()
    this.setState({ isDragOver: true })
    console.log('drag over');
  }

  handleDrop(ev) {
    ev.preventDefault()
    this.refs.inputFile.files = ev.dataTransfer.files
    this.setState({ isDragOver: false })
  }

  handleDragLeave(ev) {
    ev.preventDefault()
    this.setState({ isDragOver: false })
  }

  handleDragEnd() {
    this.setState({ isDragOver: false })
  }

  handleInputChange(e, size) {
    console.log(size);
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

  handleUpload() {

    const body = {
      id: this.props.position.id,
      ...this.state.deal,
      newName: this.textCT.value,
      deal_link: this.textDL.value
    }
    console.log('uploading...');

    fetch(
      api.upload,
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
    }).catch(err => {
      console.log(err)
      this.setState({ isUpload: false })
    })
  }

  selectSize(size) {
    this.setState({ currentSize: size })
  }

  selectDeal(i) {
    const deal = this.props.position.deals[i]
    if (!deal) return console.log('Deal not found')

    const {
      name,
      deal_link,
    } = deal

    this.textCT.value = name
    this.textDL.value = deal_link

    this.setState({
      deal
    }, () => {
      // Select image size
      this.selectSize(Object.keys(deal.images)[0])
    })
  }

  onChangeToggleActive() {
    this.setState({
      deal: { ...this.state.deal, is_active: !this.state.deal.is_active}
    })
  }

  render() {
    if (!this.state.deal) return <div></div>
    const {
      images,
    } = this.state.deal

    const listSizeSelect = images && Object.keys(images).map((v, i) => {
      return <MenuItem key={i} eventKey={v}>{v}</MenuItem>
    })

    const listDealSelect = this.props.position.deals && this.props.position.deals.map((deal, i) => {
      return <MenuItem key={i} eventKey={i}>{deal.name}</MenuItem>
    })


    const listImagePreview = this.state.deal.images && Object.keys(this.state.deal.images).map((v, i) => {
      //
      return (
        <div key={i} className="preview-box">

          <InputGroup bsSize="small">
            <InputGroup.Addon>Size: {v}</InputGroup.Addon>
            <a onClick={() => {this.refs[`inputFile-${v}`].click()}}className="btn btn-sm btn-default">
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
      <Panel className="deals" header={`Vị trí: ${this.props.position.position} (${this.props.position.id}) `}>
        <div className="deal col-sm-12">
          <div className="col-sm-7 box-preview">
            {listImagePreview}
          </div>

          <div className="col-sm-5 box-info">
            <div className="container-fluid">

              <div className="row info">

                <InputGroup bsSize="small">
                  <InputGroup.Addon>Chương trình</InputGroup.Addon>
                    <FormControl type="text" inputRef={ref=>{this.textCT=ref}} />
                </InputGroup>

                <InputGroup  bsSize="small">
                  <InputGroup.Addon>Deal link</InputGroup.Addon>
                  <FormControl type="text" inputRef={ref=>{this.textDL=ref}} />
                </InputGroup>

                <label>
                  <Toggle icons={false} checked={this.state.deal.is_active} onChange={this.onChangeToggleActive}/>
                  <span>Active</span>
                </label>

                <div>
                  <a className="btn btn-primary btn-upload" href="">Upload</a>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="deal col-sm-12">
          <div className="col-sm-7 box-preview">
            {listImagePreview}
          </div>

          <div className="col-sm-5 box-info">
            <div className="container-fluid">

              <div className="row info">

                <InputGroup bsSize="small">
                  <InputGroup.Addon>Chương trình</InputGroup.Addon>
                    <FormControl type="text" inputRef={ref=>{this.textCT=ref}} />
                </InputGroup>

                <InputGroup  bsSize="small">
                  <InputGroup.Addon>Deal link</InputGroup.Addon>
                  <FormControl type="text" inputRef={ref=>{this.textDL=ref}} />
                </InputGroup>

                <label>
                  <Toggle icons={false} checked={this.state.deal.is_active} onChange={this.onChangeToggleActive}/>
                  <span>Active</span>
                </label>

              </div>

            </div>
          </div>
        </div>

      </Panel>
    );
  }

}

export default PositionItem;
