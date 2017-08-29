import React, { Component } from 'react'
import './Menu.css'

class Menu extends Component {

  render() {
    const menuClass = `${this.props.isOpen? 'open' : ''} ${this.props.isDown? 'down' : ''}`
    return (
      <div>
        <div id="menu" className={menuClass} ref="menu">
          <div id="menu-content">hg</div>
          <div id="float" onClick={this.props.toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    )
  }
}

export default Menu
