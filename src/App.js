import React, {Component} from 'react';
import { AppBar,Toolbar, TextField, Typography, Grid, Card } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
})

const Suggestions = (props) => {
  const {autocomplete, onSelect} = props
  if(autocomplete !== undefined){
    const suggestions = autocomplete.map(suggest => 
      <div onClick={()=>onSelect(suggest.name)}>
        {suggest.name}
      </div>
    )
    return(<div>{suggestions}</div>)
  }
  return <div></div>
}

const ThirdCom = (props) => {
  const {data} = props
  if(data === ""){
    return <div></div>
  }
  else{
    const lettersArray =  data.split("")
    const letters = lettersArray.map(letter => 
      <Card style={{margin: "40px", padding: "40px", backgroundColor: "blue"}}>
        {letter}
      </Card>
    )
    return letters
  }
}

class App extends Component {

  state = {
    countries: {},
    searchField: '',
    visibility1: 'hidden',
    visibility2: 'hidden',
  }

  componentDidMount() {
    fetch('https://restcountries.eu/rest/v2/all')
    .then(res => res.json())
    .then(json => this.setState({countries: json}))
  }

  onSearchChange = (e) => {
    if(this.state.searchField !== '')
      this.setState({visibility1: 'visible', visibility2: 'hidden'})
    else if(this.state.searchField === '')
      this.setState({visibility1: 'hidden', visibility2: 'hidden'})
    this.setState({searchField: e.target.value})
  }

  onSelect = (e) => {
    this.setState({searchField: e, visibility1: 'hidden', visibility2: 'visible'})
  }

  render() {
    const { countries, searchField } = this.state
    var autocomplete

    if(Object.entries(countries).length !== 0 && countries.constructor !== Object){
      autocomplete = countries.filter(country => {
        return country.name.toLowerCase().includes(searchField.toLowerCase())
      })
    }
    return(
      <MuiThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant= "h5">
              Navbar
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container alignItems="center" direction="column">
          <Grid item>
            <TextField 
              variant="outlined"
              placeholder = "search..."
              value={this.state.searchField}
              onChange = {this.onSearchChange}
            />
            <div style={{maxHeight: '100px', overflowY: 'auto', visibility: `${this.state.visibility1}`}}>
              <Suggestions autocomplete={autocomplete} onSelect={this.onSelect}/>
            </div>
          </Grid>
          <Grid container direction='row' style={{visibility: `${this.state.visibility2}`, margin: "40px"}}>
            <ThirdCom data={this.state.searchField} />
          </Grid>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

export default App