import React, { Component } from 'react'
import MapPosition from './components/MapPosition'
import NavigationBar from './components/NavigationBar'
import Menu from './components/Menu'
import { api } from './config'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      position: null,
      positionFilted: null,
      isNavbarDown: true,
      isMenuOpen: false,
    }

    this.handleSearch = this.handleSearch.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  componentDidMount() {
    fetch(api.position).then(res => res.json()).then(position => {
      this.setState({ position, positionFilted: position })
    })
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    if (document.body.scrollTop > 1) {
      if (!this.state.isNavbarDown) this.setState({ isNavbarDown: true })
    } else {
      if (this.state.isNavbarDown) this.setState({ isNavbarDown: false })
    }
  }

  handleSearch(key) {
    const searchStack = key.split('-')
    if(key === '') return this.setState({ positionFilted: this.state.position })
    console.log(key);

    const positions = []
    searchStack.forEach(v => {
      if (Number.isInteger(+v)) {
        positions.push(...this.state.position.positions.filter(p => v === p.id+''))
      } else {
        // Smart searching...
        //
      }
    })

    this.setState({
      positionFilted: {
        ...this.state.position,
        positions
      }
    },() => {
      console.log(this.state.positionFilted);
    })
  }

  toggleMenu() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    })
  }

  render() {
    return (
      <div>
        <NavigationBar search={this.handleSearch} isDown={this.state.isNavbarDown}/>
        <div className="content">
          <Menu isDown={!this.state.isNavbarDown} isOpen={this.state.isMenuOpen} toggleMenu={this.toggleMenu}/>
          <div id="positions" className={`${this.state.isMenuOpen? 'small' : ''}`}>
            <div className="map-position">
              <MapPosition position={this.state.positionFilted} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
