import React, { Component } from 'react'
import logo from '../static/logo.png'
import './NavigationBar.css'

class NavigationBar extends Component {

  render() {
    return (
      <header>
        <div ref="headerFixed" className={`header ${this.props.isDown? 'fixed' : ''}`}>
          <img className="logo" src={logo} alt=""/>
          <div className="header-body">
            <span><strong>JAM</strong>JA.VN</span>
          </div>
          <div className="filter">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search..."
                onKeyUp={(event) => {
                  this.props.search(event.target.value)
                }} />
              <span className="input-group-addon"><span className="glyphicon glyphicon-search"></span></span>
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export default NavigationBar
