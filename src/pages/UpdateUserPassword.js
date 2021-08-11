import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useLocation } from "react-router";
import { Formik, Form } from "formik";
import * as yup from "yup";
import queryString from "query-string";

/* Redux */
import { updateUserPassword } from "../actions/userActions";

/* Material UI components */
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import Alert from "@material-ui/lab/Alert";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formHelperText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonWrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  backdrop: {
    marginTop: theme.spacing(8),
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  alert: {
    marginTop: theme.spacing(8),
    textAlign: "center",
  },
}));

const PasswordSchema = yup.object().shape({
  password: yup.string().min(6).required("This field is required."),
  confirmPassword: yup
    .string()
    .required("This field is required.")
    .oneOf([yup.ref("password"), null], "Password must match"),
});

const UpdateUserPassword = () => {
  const classes = useStyles();
  const [alert, setAlert] = useState("error");
  const [loading, setLoading] = useState(true);
  const [isActionCodeValid, setIsActionCodeValid] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { search } = useLocation();

  const queries = React.useMemo(() => queryString.parse(search), [search]);

  useEffect(() => {
    if (alert === "error") {
      updateUserPassword(
        { ...queries },
        setLoading,
        setIsActionCodeValid,
        setError
      );
    }
  }, [alert, queries]);

  const handleClickShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  if (alert === "success")
    return (
      <Redirect
        to={{
          pathname: "/login",
          search: "?resetPassword=true",
        }}
      />
    );

  return (
    <Container component="main" maxWidth="xs">
      {loading ? (
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : isActionCodeValid ? (
        <>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <VpnKeyIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Update New Password
            </Typography>
            <Formik
              initialValues={{ password: "", confirmPassword: "" }}
              validationSchema={PasswordSchema}
              onSubmit={(values, { setSubmitting, setFieldError }) => {
                const data = {
                  password: values.password,
                  ...queries,
                };

                updateUserPassword(
                  data,
                  setLoading,
                  setIsActionCodeValid,
                  setError,
                  setFieldError,
                  setSubmitting,
                  setAlert
                );
              }}
            >
              {({ errors, handleChange, touched, isSubmitting }) => (
                <Form className={classes.form} noValidate>
                  <TextField
                    error={errors.password && touched.password}
                    helperText={errors.password}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === " " && e.preventDefault()}
                  />

                  <TextField
                    error={errors.confirmPassword && touched.confirmPassword}
                    helperText={errors.confirmPassword}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === " " && e.preventDefault()}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      />
                    }
                    label="Show Password"
                  />
                  <FormHelperText className={classes.formHelperText} error>
                    {errors.general}
                  </FormHelperText>
                  <div className={classes.buttonWrapper}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      className={classes.submit}
                    >
                      Update New Password
                    </Button>
                    {isSubmitting && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </>
      ) : (
        <Alert className={classes.alert} variant="filled" severity={alert}>
          {error || "Password Successfully Updated"}
        </Alert>
      )}
    </Container>
  );
};

export default UpdateUserPassword;
