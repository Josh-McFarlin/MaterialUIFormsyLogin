import React from "react";
import PropTypes from "prop-types";
import Formsy from "formsy-react";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Collapse from "@material-ui/core/Collapse";

import FormsyTextField from "./FormsyTextField";
import FormsyPasswordField from "./FormsyPasswordField";

import { sleep, simulateRegister, simulateLogin } from "../utils";

const styles = theme => ({
  errorPaper: {
    background: "red"
  },
  errorText: {
    padding: 2 * theme.spacing.unit,
    color: "white"
  },
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  toggleType: {
    cursor: "pointer",
    margin: 2 * theme.spacing.unit
  }
});

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      registerForm: false,
      canSubmit: false,
      showLoader: false,
      message: undefined,
      messageColor: "red"
    };

    this.formRef = React.createRef();

    this.resetErrors = this.resetErrors.bind(this);
    this.toggleFormType = this.toggleFormType.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.submit = this.submit.bind(this);
  }

  resetErrors() {
    this.setState({
      message: undefined
    });
  }

  toggleFormType() {
    this.setState({ registerForm: !this.state.registerForm });
    this.formRef.current.reset();
  }

  resetForm() {
    this.formRef.current.reset();

    this.setState({
      registerForm: false
    });
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  async submit(model) {
    let { credentials, setUser } = this.props;
    let { registerForm } = this.state;

    this.setState({
      showLoader: true,
      canSubmit: false
    });

    await sleep(1500);

    if (registerForm) {
      await simulateRegister(credentials, model).then(
        async result => {
          let { passwordConf, ...rest } = model;
          credentials.push(rest);

          this.setState({
            message: result,
            messageColor: "green"
          });

          await sleep(2000);
          this.resetForm();
        },
        error => {
          this.setState({
            message: error,
            messageColor: "red"
          });
        }
      );
    } else {
      await simulateLogin(credentials, model).then(
        result => {
          setUser(result);
        },
        error => {
          this.setState({
            message: error,
            messageColor: "red"
          });
        }
      );
    }

    this.setState({
      canSubmit: true,
      showLoader: false
    });
  }

  render() {
    let { classes } = this.props;
    let {
      registerForm,
      canSubmit,
      showLoader,
      message,
      messageColor
    } = this.state;

    return (
      <React.Fragment>
        <Collapse in={message !== undefined}>
          <Paper className={classes.errorPaper}>
            <Typography
              className={classes.errorText}
              variant="h5"
              align="center"
              gutterBottom
              style={{
                backgroundColor: messageColor
              }}
            >
              {message}
            </Typography>
          </Paper>
        </Collapse>

        <Formsy
          ref={this.formRef}
          onValidSubmit={this.submit}
          onValid={this.enableButton}
          onInvalid={this.disableButton}
          onChange={this.resetErrors}
          className={classes.container}
        >
          {registerForm && (
            <FormsyTextField
              name="name"
              label="Company/Name"
              validations="minLength:1"
              validationError="This is not a name!"
              required
            />
          )}

          <FormsyTextField
            type="email"
            name="email"
            validations="isEmail"
            validationError="This is not a valid email!"
            required
          />

          <FormsyPasswordField
            type="password"
            name="password"
            validations={registerForm ? "isValidPassword" : undefined}
            validationError="This is not a valid password!"
            showRules={registerForm}
            required
          />

          {registerForm && (
            <FormsyTextField
              type="password"
              name="passwordConf"
              label="Confirm Password"
              validations="equalsField:password"
              validationError="This does not match your entered password!"
              required
            />
          )}

          <Grow in={showLoader} timeout={1000}>
            <div className="loader" />
          </Grow>

          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            disabled={!canSubmit}
            type="submit"
          >
            {registerForm === true ? "Register" : "Login"}
          </Button>

          <Typography
            className={classes.toggleType}
            variant="button"
            align="center"
            gutterBottom
            onClick={this.toggleFormType}
          >
            {registerForm === true
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Typography>
        </Formsy>
      </React.Fragment>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  credentials: PropTypes.array.isRequired,
  setUser: PropTypes.func.isRequired
};

export default withStyles(styles)(LoginForm);