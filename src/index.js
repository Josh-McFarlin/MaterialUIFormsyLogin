import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";

import LoginForm from "./components/LoginForm";
import { capitalizeFirstLetter } from "./utils";
import "./styles.css";

const styles = theme => ({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  infoPaper: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    padding: theme.spacing.unit,
    width: 500,
    maxWidth: "80%"
  },
  button: {
    margin: theme.spacing.unit
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: undefined
    };

    this.formRef = React.createRef();

    this.credentials = [
      {
        name: "The Foo Company",
        email: "foo@foo.com",
        password: "barBAR123"
      }
    ];

    this.setUser = this.setUser.bind(this);
    this.logout = this.logout.bind(this);
  }

  setUser(model) {
    this.setState({
      user: model
    });
  }

  logout() {
    this.setState({
      user: undefined
    });
  }

  render() {
    let { classes } = this.props;
    let { user } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.container}>
          <Paper className={classes.infoPaper}>
            {user === undefined ? (
              <LoginForm
                credentials={this.credentials}
                setUser={this.setUser}
              />
            ) : (
              <React.Fragment>
                <List>
                  {Object.keys(user).map((title, index) => {
                    return (
                      <ListItem>
                        <ListItemText
                          primary={capitalizeFirstLetter(title)}
                          secondary={user[title]}
                          key={index}
                        />
                      </ListItem>
                    );
                  })}
                </List>

                <Button
                  className={classes.button}
                  variant="outlined"
                  color="primary"
                  onClick={this.logout}
                >
                  Logout
                </Button>
              </React.Fragment>
            )}
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

let StyledApp = withStyles(styles)(App);
const rootElement = document.getElementById("root");
ReactDOM.render(<StyledApp />, rootElement);
