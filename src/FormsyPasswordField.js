import React from "react";
import TextField from "@material-ui/core/TextField";
import { withFormsy, addValidationRule } from "formsy-react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";

import CheckIcon from "@material-ui/icons/CheckCircleOutline";
import RemoveIcon from "@material-ui/icons/RemoveCircle";

import { capitalizeFirstLetter } from "./utils";

addValidationRule("isValidPassword", function (values, value) {
  return (
    value != null &&
    value.length >= 5 &&
    value.replace(/[^a-z]/g, "").length > 0 &&
    value.replace(/[^A-Z]/g, "").length > 0 &&
    value.replace(/[^0-9]/g, "").length > 0
  );
});

const styles = theme => ({
  textField: {
    margin: theme.spacing.unit
  },
  fullWidth: {
    width: "100%"
  }
});

class FormsyPasswordField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showHint: false,
      length: false,
      lowercase: false,
      uppercase: false,
      numbers: false
    };

    this.changeValue = this.changeValue.bind(this);
    this.showHint = this.showHint.bind(this);
    this.hideHint = this.hideHint.bind(this);
  }

  changeValue(event) {
    let password = event.target.value;
    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    // Important: Don't skip this step. This pattern is required
    // for Formsy to work.
    this.props.setValue(password);

    let length = false;
    if (password.length > 5) {
      length = true;
    }

    let lowercase = false;
    if (password.replace(/[^a-z]/g, "").length > 0) {
      lowercase = true;
    }

    let uppercase = false;
    if (password.replace(/[^A-Z]/g, "").length > 0) {
      uppercase = true;
    }

    let numbers = false;
    if (password.replace(/[^0-9]/g, "").length > 0) {
      numbers = true;
    }

    this.setState({
      length,
      lowercase,
      uppercase,
      numbers
    });
  }

  showHint() {
    this.setState({
      showHint: true
    });
  }

  hideHint() {
    this.setState({
      showHint: false
    });
  }

  makeValidator(stateVar, text) {
    return (
      <ListItem>
        <ListItemIcon>
          {stateVar === true ? <CheckIcon /> : <RemoveIcon />}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    );
  }

  render() {
    let { showHint, length, lowercase, uppercase, numbers } = this.state;
    let { classes, name, getErrorMessage, getValue, type, showRules } = this.props;
    let label = capitalizeFirstLetter(name);

    // An error message is returned only if the component is invalid
    const errorMessage = getErrorMessage();

    return (
      <React.Fragment>
        {showRules && (
          <Collapse in={showHint} className={classes.fullWidth}>
            <List>
              {this.makeValidator(
                length,
                "Password length is at least five characters"
              )}

              {this.makeValidator(
                lowercase,
                "Password contains lowercase letters"
              )}

              {this.makeValidator(
                uppercase,
                "Password contains uppercase letters"
              )}

              {this.makeValidator(numbers, "Password contains numbers")}
            </List>
          </Collapse>
        )}

        <TextField
          className={classes.textField}
          label={label}
          value={getValue() || ""}
          onChange={this.changeValue}
          error={errorMessage != null}
          helperText={errorMessage}
          margin="normal"
          type={type}
          fullWidth
          onFocus={this.showHint}
          onBlur={this.hideHint}
        />
      </React.Fragment>
    );
  }
}

FormsyPasswordField = withStyles(styles)(FormsyPasswordField);

FormsyPasswordField.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  getErrorMessage: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
  type: PropTypes.string,
  showRules: PropTypes.bool
};

FormsyPasswordField.defaultProps = {
  showRules: false
};

export default withFormsy(FormsyPasswordField);
