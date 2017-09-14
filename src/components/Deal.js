import React, { Component } from 'react';

class Deal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      deal: this.props.deal
    }
  }

  render() {
    return (
      <div>deal</div>
    );
  }

}

export default Deal;
