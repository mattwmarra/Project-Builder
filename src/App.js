import React, {useEffect} from 'react';
import { Popover } from 'react-bootstrap';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom'
import NavBar from './NavBar'
import Dashboard from './Dashboard'
import Budget from './Budget'
import Login from './Login'
import { Board } from './Board';
import {useSelector} from 'react-redux'
import { InfoImg } from "./img/info-24.png";
import {faInfoSquare} from 'react-icons'
import './styles.scss'
import Registration from './Registration';

function App() {
  const isLogged = useSelector(state => state.isLogged)
  if(!isLogged){
    return(
      <div>
        <Switch>
          <Route path="/login" component={() => <Login></Login>}></Route>
          <Route path="/registration" component={Registration}></Route>
        </Switch>
        <Redirect to="/login"></Redirect>
      </div>
    )
  }
  return (
    <div className="App">
          <NavBar projectName={"This Project"}></NavBar>
          <Switch>
            <Route exact path="/board" component={() => <Board></Board>}></Route>
            <Route exact path="/budget" component={() => <Budget></Budget>}></Route>
            <Route exact path="/dashboard" component={() => <Dashboard></Dashboard>}></Route>
          </Switch>
    </div>
  );
}

export default withRouter(App);
