import React, { Component } from 'react'

const style = {

}

class Viewer extends Component {

  constructor(props) {
    super(props)
    this.state = {
			loading: true
		}
	}

	componentDidMount() {
		this.setState({loading:false})
	}	
  
  render() {
		const content = 
				<div style={style.viewer}>

				</div>

    return (
			<div style={style.content}>
				{ content }
			</div>
    )
  }
}

export default Viewer
