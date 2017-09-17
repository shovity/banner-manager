import React, { Component } from 'react'
import PositionItem from './PositionItem'

class MapPosition extends Component {

  render() {

    if (!this.props.position) return (
      <div className="container">
        <div className="alert alert-info">Loading banner list...</div>
      </div>
    )

    const positions = this.props.position.positions.map((v, i) => {

      return <PositionItem key={i} position={v} />
    })

    return (
      <div>
        { positions }
      </div>
    )
  }
}

export default MapPosition;
