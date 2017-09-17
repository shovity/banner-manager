import React, { Component } from 'react'
import MapPosition from './components/MapPosition'
import NavigationBar from './components/NavigationBar'
import Menu from './components/Menu'
import Float from './components/Float'
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
    this.handleFilter = this.handleFilter.bind(this)
  }

  componentDidMount() {
    fetch(api.position).then(res => res.json()).then(position => {
      this.setState({
        position,
        positionFilted: {
          ...this.state.position,
          positions: position.positions.filter(p => p.id !== '0')
        }
      })

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

    const positions = []
    searchStack.forEach(v => {
      if (Number.isInteger(+v)) {
        positions.push(...this.state.position.positions.filter(p => v === p.id+''))
        this.setState({
          positionFilted: {
            ...this.state.position,
            positions
          }
        })
      } else {
        // Smart searching...
        //
        positions.push(...this.state.position.positions.filter(p => {
          const key = v.replace(/ /g, '').toLowerCase()
          const target = p.position.replace(/ /g, '').toLowerCase()
          return target.indexOf(key) !== -1
        }))

        this.setState({
          positionFilted: {
            ...this.state.position,
            positions
          }
        })
      }
    })

    this.setState({
      positionFilted: {
        ...this.state.position,
        positions
      }
    })
  }

  toggleMenu() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    })
  }

  handleFilter(value) {
    console.log(value);
    if (value.indexOf('applyForAll') !== -1) {
      this.setState({
        positionFilted: {
          ...this.state.position,
          positions: this.state.position.positions.filter(p => p.id === '0')
        }
      })
    } else {
      const positions = []
      positions.push(...this.state.position.positions.filter(p => {
        return (value.indexOf(p.page) !== -1 || value.length === 0) && p.id !== 0
      }))

      this.setState({
        positionFilted: {
          ...this.state.position,
          positions
        }
      })
    }
  }

  componentDidUpdate() {
    //
  }

  render() {
    return (
      <div>
        <NavigationBar search={this.handleSearch} isDown={this.state.isNavbarDown} onChaneFilter={this.handleFilter} />
        <div className="content">
          <Menu isDown={!this.state.isNavbarDown} isOpen={this.state.isMenuOpen} toggleMenu={this.toggleMenu}/>
          <div id="positions" className={`${this.state.isMenuOpen? 'small' : ''}`}>
            <div className="map-position">
              <MapPosition position={this.state.positionFilted} />
            </div>
          </div>
        </div>
        <Float />
      </div>
    );
  }
}

export default App;
