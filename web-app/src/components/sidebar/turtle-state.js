import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper'

class TurtleState extends Component {

  style = {
    button: {
      width: '100%'
    },
    avatar: {
      width: '75%',
      maxWidth: '100px'
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
    const { char,
            rows } = this.props

    return (
      <div>
        <Card>
          <CardContent>
            <Typography color='textPrimary' align='left'>Leonardo</Typography>
            <br/>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <img 
                  src={require('../../images/leonardo.png')}
                  style={this.style.avatar}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography color='textSecondary'>Action</Typography>
                <Typography variant='h3' color='textPrimary'>{char}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <br/>
        <TableContainer component={Paper}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>State</TableCell>
                <TableCell align='center'>Position</TableCell>
                <TableCell align='center'>Rotation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.state}>
                  <TableCell component='th' scope='row'>
                    {row.state}
                  </TableCell>
                  <TableCell align='center'>{row.position}</TableCell>
                  <TableCell align='center'>{row.rotation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  } 
}

export default TurtleState
