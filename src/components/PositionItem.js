import React, { Component } from 'react'
import { DropdownButton, MenuItem, FormControl, InputGroup, ButtonGroup } from 'react-bootstrap'
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
    this.handleDragOver = this.handleDragOver.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.selectSize = this.selectSize.bind(this)
    this.selectDeal = this.selectDeal.bind(this)
    this.onChangeToggleActive = this.onChangeToggleActive.bind(this)
  }

  componentDidMount() {
    this.selectDeal(0)
    const dropZone = this.refs.dropZone
    dropZone.addEventListener('drop', this.handleDrop)
    dropZone.addEventListener('dragover', this.handleDragOver)
    dropZone.addEventListener('dragleave', this.handleDragLeave)
    dropZone.addEventListener('dragend', this.handleDragLeave)
  }

  componentWillUnmout() {
    const dropZone = this.refs.dropZone
    dropZone.removeEventListener('dragover', this.handleDragOver)
    dropZone.removeEventListener('drop', this.handleDrop)
    dropZone.removeEventListener('dragleave', this.handleDragLeave)
    dropZone.removeEventListener('dragend', this.handleDragEnd)
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

  handleInputChange(e) {
    const input = this.refs.inputFile
    if (input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = e => {
        const currentSize = this.state.currentSize
        const objectSize = {}
        objectSize[currentSize] = e.target.result
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
      ...this.state.deal,
      name: this.textCT.value,
      deal_link: this.textDL.value,
      position: this.textTVT.value,
    }
    console.log('uploading...');
    return console.log(body);

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
      position,
    } = deal

    this.textCT.value = name
    this.textDL.value = deal_link
    this.textTVT.value = position

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

    return (
      <div className="row bannerItem">
        <div className="col-sm-7 box-preview">
          <div className={`drop-zone ${this.state.isDragOver? 'dragover' : ''}`}  ref="dropZone">
            <img src={this.state.deal.images[this.state.currentSize]} className="banner-preview" alt="" />
            <div className="ol-dragover"></div>
          </div>
        </div>

        <div className="col-sm-5 box-info">
          <div className="container-fluid">

            <div className="row controls">

              <ButtonGroup justified>
                <DropdownButton bsSize='small' bsStyle='primary' title="Chương trình" id="size" onSelect={this.selectDeal}>
                  {listDealSelect}
                </DropdownButton>

                <DropdownButton bsSize='small' bsStyle='info' title={this.state.currentSize} id="size" onSelect={this.selectSize}>
                  {listSizeSelect}
                </DropdownButton>

                <a onClick={() => {this.refs.inputFile.click()}}className="btn btn-sm btn-success">
                  Browser
                </a>

                <a onClick={this.handleUpload} className="btn btn-sm btn-danger">
                  {this.state.isUpload? 'Saving...' : 'Save'}
                </a>
              </ButtonGroup>

              <input
                className="hidden"
                onChange={this.handleInputChange}
                ref="inputFile"
                type="file" />
            </div>

            <div className="row info">

            <InputGroup bsSize="small">
              <InputGroup.Addon>Mã vị trí</InputGroup.Addon>
                <FormControl type="text" value={this.props.position.id}/>
            </InputGroup>

              <InputGroup bsSize="small">
                <InputGroup.Addon>Chương trình</InputGroup.Addon>
                  <FormControl type="text" inputRef={ref=>{this.textCT=ref}} />
              </InputGroup>

              <InputGroup  bsSize="small">
                <InputGroup.Addon>Deal link</InputGroup.Addon>
                <FormControl type="text" inputRef={ref=>{this.textDL=ref}} />
              </InputGroup>

              <InputGroup  bsSize="small">
                <InputGroup.Addon>Tên vị trí</InputGroup.Addon>
                <FormControl type="text"  inputRef={ref=>{this.textTVT=ref}}/>
              </InputGroup>

              <label>
                <Toggle icons={false} checked={this.state.deal.is_active} onChange={this.onChangeToggleActive}/>
                <span>Active</span>
              </label>

            </div>

          </div>
        </div>
      </div>
    );
  }

}

export default PositionItem;
