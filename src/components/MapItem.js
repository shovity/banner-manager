import React, { Component } from 'react'
import BannerItem from './BannerItem'

class MapItem extends Component {

  render() {
    const { banner } = this.props
    if (!banner) return (
      <div className="container">
        <div className=" alert alert-info">Loading banner list...</div>
      </div>
    )

    const banners = banner.positions.map((v, i) => <BannerItem key={i} index={i} banner={v} />)

    return (
      <div>
        { banners }
      </div>
    );
  }

}

export default MapItem;
