import React, { Component } from 'react'
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import logo from '../static/logo.png'
import './NavigationBar.css'

class NavigationBar extends Component {

  constructor(props) {
    super(props)

    this.state = {
      filterTag: ['cho', 'dealDetail', 'muaOnline', 'BoSuuTap', 'BranDetail'],
    }

    this.onChaneFilter = this.onChaneFilter.bind(this)
  }

  onChaneFilter(value) {
    this.setState({ filterTag: value }, () => {
      this.props.onChaneFilter(value)
    })
  }

  render() {
    return (
      <header>
        <div ref="headerFixed" className={`header ${this.props.isDown? 'fixed' : ''}`}>
          <img className="logo" src={logo} alt=""/>
          <div className="header-body">
            <span><strong>JAM</strong>JA.VN</span>
          </div>
          <div className="filter">

            <div className="search-box">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Search..."
                  onKeyUp={(event) => {
                    this.props.search(event.target.value)
                  }} />
                <span className="input-group-addon"><span className="glyphicon glyphicon-search"></span></span>
              </div>
            </div>

            <div className="filter-tag">
              <ToggleButtonGroup
                className="apply-for-all"
                type="checkbox"
                value={this.filterTag}
                onChange={this.onChaneFilter}>

                <ToggleButton value='applyForAll'>Apply fo all</ToggleButton>

              </ToggleButtonGroup>

              <ToggleButtonGroup
                className={this.state.filterTag.indexOf('applyForAll') !== -1? 'deep fadex' : 'fadex'}
                type="checkbox"
                value={this.filterTag}
                onChange={this.onChaneFilter}>

                <ToggleButton value='cho'>Chợ</ToggleButton>
                <ToggleButton value='dealDetail'>Deal detail</ToggleButton>
                <ToggleButton value='muaOnline'>Mua online</ToggleButton>
                <ToggleButton value='BoSuuTap'>Bộ sưu tập</ToggleButton>
                <ToggleButton value='BranDetail'>Brand Detail</ToggleButton>

              </ToggleButtonGroup>
            </div>



          </div>
        </div>
      </header>
    )
  }
}

export default NavigationBar
