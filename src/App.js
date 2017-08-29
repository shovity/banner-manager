import React, { Component } from 'react'
import MapItem from './components/MapItem'
import NavigationBar from './components/NavigationBar'
import Menu from './components/Menu'
import { api } from './config'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      banner: null,
      bannerFilted: null,
      isNavbarDown: true,
      isMenuOpen: false,
    }

    this.handleSearch = this.handleSearch.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  componentDidMount() {
    fetch(api.banner).then(res => res.json()).then(banner => {
      this.setState({ banner, bannerFilted: banner })
    })
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    if (document.body.scrollTop > 1) {
      this.setState({ isNavbarDown: true })
    } else {
      this.setState({ isNavbarDown: false })
    }
  }

  handleSearch(key) {
    const searchStack = key.split('-')
    if(key === '') return this.setState({ bannerFilted: this.state.banner })

    const positons = []
    searchStack.forEach(v => {
      if ( Number.isInteger(+v)) {
        positons.push(...this.state.banner.positons.filter(b => v === b.id+''))
      } else {
        // Smart searching...
        //
      }
    })

    this.setState({
      bannerFilted: {
        ...this.state.banner,
        positons
      }
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
          <div id="banner" className={`${this.state.isMenuOpen? 'small' : ''}`}>
            <div className="map-banner">
              <MapItem banner={this.state.bannerFilted} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
