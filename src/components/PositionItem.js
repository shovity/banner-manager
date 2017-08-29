import React, { Component } from 'react'
import { DropdownButton, MenuItem, FormControl } from 'react-bootstrap'
import { api } from '../config'
import './PositionItem.css'

class PositionItem extends Component {

  constructor(props) {
    super(props)

    this.state = {
      currentDeal: 0,
      imgSrc: '',
      isDragOver: false,
      isUpload: false,
      size: ''
    }

    this.deals = this.props.position.deals
    this.id = this.props.position.id

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleDragOver = this.handleDragOver.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.selectSize = this.selectSize.bind(this)
    this.selectDeal = this.selectDeal.bind(this)
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
        this.setState({ imgSrc: e.target.result }, () => {
          console.log(this.refs.imgOrigin.offsetWidth + 'x' + this.refs.imgOrigin.offsetHeight);
        })
      }
      reader.readAsDataURL(input.files[0])
    }
  }

  handleUpload() {
    if (this.state.imgSrc === '' || !this.refs.inputFile.files[0]) return

    this.setState({ isUpload: true })
    const file = this.refs.inputFile.files[0]
    const body = {
      imgBase64: this.state.imgSrc,
      name: file.name,
      id: this.props.banner.id
    }

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
    const imgSrc = api.base + this.deals[this.state.currentDeal].images[size]
    console.log(imgSrc);
    this.setState({ size, imgSrc })
  }

  selectDeal(i) {
    const deal = this.deals[i]
    console.log(deal);
    if (!deal) return console.log('Deal not found')

    this.setState({
      currentDeal: i,
      imgSrc: api.base + deal.images[Object.keys(deal.images)[0]],
      size: Object.keys(deal.images)[0]
    })
  }

  render() {
    const {
      name,
      deal_link,
      position,
      images,
      is_active,
    } = this.props.position.deals[this.state.currentDeal]

    const listSizeSelect = images && Object.keys(images).map((v, i) => {
      return <MenuItem key={i} eventKey={v}>{v}</MenuItem>
    })

    const listDealSelect = this.deals && this.deals.map((deal, i) => {
      return <MenuItem key={i} eventKey={i}>{deal.name}</MenuItem>
    })

    return (
      <div className="row bannerItem">

        <div className="col-sm-7 box-preview">
          <div className={`drop-zone ${this.state.isDragOver? 'dragover' : ''}`}  ref="dropZone">
            <img src={this.state.imgSrc} className="banner-preview" alt="" />
            <div className="ol-dragover"></div>
          </div>
          <img src={this.state.imgSrc} className="invisible" ref="imgOrigin" alt="" />
        </div>

        <div className="col-sm-5 box-info">
          <div className="container-fluid">

            <div className="row controls">

              <DropdownButton bsSize='small' bsStyle='primary' title="Chương trình" id="size" onSelect={this.selectDeal}>
                {listDealSelect}
              </DropdownButton>

              <DropdownButton bsSize='small' bsStyle='primary' title={this.state.size} id="size" onSelect={this.selectSize}>
                {listSizeSelect}
              </DropdownButton>

              <label htmlFor={'inputFile'+this.id}>
                <buttom className="btn btn-sm btn-success">Browser</buttom>
              </label>

              <buttom
                onClick={this.handleUpload}
                className="btn btn-sm btn-danger">
                {this.state.isUpload? 'Saving...' : 'Save'}
              </buttom>

              <input
                id={'inputFile'+this.id}
                className="hidden"
                onChange={this.handleInputChange}
                ref="inputFile"
                type="file" />
            </div>

            <div className="row">

              <table className="table table-hover">
                <tbody>

                <tr>
                  <td className="col-sm-4">Vị trí</td>
                  <td className="col-sm-8">{this.id}</td>
                </tr>

                  <tr>
                    <td className="col-sm-4">Chương trình</td>
                    <td className="col-sm-8">
                      <FormControl ref="chuong-trinh" />
                    </td>
                  </tr>

                  <tr>
                    <td className="col-sm-4">Deal link</td>
                    <td className="col-sm-8">{deal_link}</td>
                  </tr>

                  <tr>
                    <td className="col-sm-4">Tên vị trí</td>
                    <td className="col-sm-8">{position}</td>
                  </tr>

                  <tr>
                    <td className="col-sm-4">Active:</td>
                    <td className="col-sm-8">{is_active? 'true' : 'false'}</td>
                  </tr>
                </tbody>
            </table>
            </div>

          </div>
        </div>
      </div>
    );
  }

}

export default PositionItem;
