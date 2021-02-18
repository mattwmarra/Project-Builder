import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { Board } from './Board';
import Login from './Login';
import NavBar from './NavBar';
import ProjectsPage from './Projects';
import Registration from './Registration';
import './styles.scss';

function App() {
  const isLogged = useSelector(state => state.isLogged)
  const activeProject = useSelector(state => state.projects.activeProject);

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
          <NavBar></NavBar>
          <Switch>
            <Route exact path="/projects" component={() => <ProjectsPage></ProjectsPage>}></Route>
            <Route exact path="/board" project={activeProject} component={() => <Board></Board>}></Route>
          </Switch>
    </div>
  );
}

export default withRouter(App);
