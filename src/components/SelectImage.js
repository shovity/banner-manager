import React, { Component } from 'react'
import './SelectImage.css'

class SelectImage extends Component {

  render() {
    return (
      <div id="selectImage">
        <div className="row">
          <div className="col-sm-2">Kích thước: <b>750x93</b></div>

          <div className="col-sm-5">
            <input type="file" className="form-control"/>
          </div>

          <div className="col-sm-5">
            <div className="preview">
              <img src="http://localhost:3001/uploads/i.jpg" alt="preview"/>
            </div>
          </div>

        </div>


        <div className="row">
          <div className="col-sm-2">Kích thước: <b>750x93</b></div>

          <div className="col-sm-5">
            <input type="file" className="form-control"/>
          </div>

          <div className="col-sm-5">
            <div className="preview">
              <img src="http://localhost:3001/uploads/i.jpg" alt="preview"/>
            </div>
          </div>

        </div>

        <div className="row">
          <div className="col-sm-2">Kích thước: <b>750x93</b></div>

          <div className="col-sm-5">
            <input type="file" className="form-control"/>
          </div>

          <div className="col-sm-5">
            <div className="preview">
              <img src="http://localhost:3001/uploads/i.jpg" alt="preview"/>
            </div>
          </div>

        </div>
      </div>
    );
  }

}

export default SelectImage;
