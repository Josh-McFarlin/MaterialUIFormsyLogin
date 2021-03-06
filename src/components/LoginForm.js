import React from "react";
import PropTypes from "prop-types";
import Formsy from "formsy-react";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

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
      validationErrors: {}
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
      validationErrors: {}
    });
  }

  toggleFormType() {
    this.setState({ registerForm: !this.state.registerForm });
    this.formRef.current.reset();
  }

  resetForm() {
    this.formRef.current.reset();

    this.setState({
      registerForm: false,
      validationErrors: {}
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

    if (registerForm) {
      await simulateRegister(credentials, model).then(
        async result => {
          let { passwordConf, ...rest } = model;
          credentials.push(rest);

          await sleep(2000);
          this.resetForm();
        },
        error => {
          this.setState({
            validationErrors: error
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
            validationErrors: error
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
      validationErrors
    } = this.state;

    return (
        <Formsy
          ref={this.formRef}
          onValidSubmit={this.submit}
          onValid={this.enableButton}
          onInvalid={this.disableButton}
          onChange={this.resetErrors}
          validationErrors={validationErrors}
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

          {showLoader &&
            <div className="loader-holder">
              <div className="loader" />
            </div>
          }

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
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  credentials: PropTypes.array.isRequired,
  setUser: PropTypes.func.isRequired
};

export default withStyles(styles)(LoginForm);
