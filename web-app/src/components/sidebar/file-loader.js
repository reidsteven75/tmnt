import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import PublishIcon from '@material-ui/icons/Publish'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

class FileLoader extends Component {

  style = {
    button: {
      width: '100%'
    }
  }

  // lifecycle
  // ---------
  constructor(props) {
    super(props)		
  }

  // render
  // ------
  render() {
    const { fileNameLoaded,
            isLoadingFile,
            handleLoadClicked } = this.props

    return (
      <div>
        <Button
          variant='outlined'
          color='primary'
          style={this.style.button}
          startIcon={isLoadingFile ? null : <PublishIcon />}
          onClick={handleLoadClicked}
          disabled={isLoadingFile}
        >
          { isLoadingFile ? <CircularProgress size={24}/> : 'Load' }
        </Button>
        <br/><br/>
        <Typography color='textSecondary' noWrap={true}>
          { fileNameLoaded ? fileNameLoaded : 'no file loaded' }
        </Typography>
      </div>
    )
  } 
}

export default FileLoader
