import React, { Component } from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { api } from '../config'
import './BannerItem.css'

class BannerItem extends Component {

  constructor(props) {
    super(props)
    this.state = {
      imgSrc: api.static_uploads + '/' + this.props.banner.name,
      isDragOver: false,
      isUpload: false,
      size: '640x180'
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleDragOver = this.handleDragOver.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.selectSize = this.selectSize.bind(this)
  }

  componentDidMount() {
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
      api.upload_url,
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
    this.setState({ size })
    console.log(size);
  }

  render() {
    const {
      position,
      name,
      deal,
      deal_link,
      position_name,
      images,
      is_active,
    } = this.props.banner

    const listSizeSelect = images && Object.keys(images).map((v, i) => <MenuItem key={i} eventKey={v}>{v}</MenuItem>)

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
              <DropdownButton bsStyle='info' title={this.state.size} id="size" onSelect={this.selectSize}>
                {listSizeSelect}
              </DropdownButton>

              <label htmlFor={'inputFile'+this.props.index}>
                <buttom className="btn btn-sm btn-primary">Browser</buttom>
              </label>

              <buttom
                onClick={this.handleUpload}
                className={`btn btn-sm btn-success ${this.state.imgSrc === ''? 'disabled':''}`}>
                {this.state.isUpload? 'Uploading...':'Upload'}
              </buttom>

              <input
                id={'inputFile'+this.props.index}
                className="hidden"
                onChange={this.handleInputChange}
                ref="inputFile"
                type="file" />
            </div>

            <div className="row">

              <table className="table table-hover">
                <tbody>
                  <tr>
                    <td className="col-sm-4">position:</td>
                    <td className="col-sm-8">{position}</td>
                  </tr>

                  <tr>
                    <td className="col-sm-4">name:</td>
                    <td className="col-sm-8">{name}</td>
                  </tr>

                  <tr>
                    <td className="col-sm-4">deal: </td>
                    <td className="col-sm-8">{deal}</td>
                  </tr>

                  <tr>
                    <td className="col-sm-4">deal_link:</td>
                    <td className="col-sm-8">{deal_link}</td>
                  </tr>

                  <tr>
                    <td className="col-sm-4">position_name:</td>
                    <td className="col-sm-8">{position_name}</td>
                  </tr>

                  <tr>
                    <td className="col-sm-4">is_active:</td>
                    <td className="col-sm-8">{is_active}</td>
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

export default BannerItem;
