import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";

/* Redux */
import { resetUserPassword } from "../actions/userActions";

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
import CircularProgress from "@material-ui/core/CircularProgress";
import { Alert, AlertTitle } from "@material-ui/lab";

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
  alert: {
    marginTop: theme.spacing(8),
    fontSize: "1.1rem",

    "& > * > *": {
      fontSize: "1.2rem",
      textAlign: "center",
      fontWeight: "bold",
    },
  },
}));

let ResetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("This field must be a valid email")
    .required("This field is required."),
});

const ResetPassword = () => {
  const classes = useStyles();
  const [success, setSuccess] = useState(false);

  return (
    <Container component="main" maxWidth="xs">
      {success ? (
        <>
          <Alert className={classes.alert} severity="success" variant="filled">
            <AlertTitle>Your email address has been verified</AlertTitle>
            Please click on the link that has just been sent to your email
            account to reset your password.
          </Alert>
          <Alert variant="outlined" severity="info">
            Haven't received and email? Please check your spam folder to make
            sure it's not in there.
          </Alert>
        </>
      ) : (
        <>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <VpnKeyIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Forgot Password
            </Typography>
            <Formik
              initialValues={{ email: "" }}
              validationSchema={ResetPasswordSchema}
              onSubmit={(values, { setSubmitting, setFieldError }) => {
                resetUserPassword(
                  values,
                  setFieldError,
                  setSubmitting,
                  setSuccess
                );
              }}
            >
              {({ errors, handleChange, touched, isSubmitting }) => (
                <Form className={classes.form} noValidate>
                  <TextField
                    error={errors.email && touched.email}
                    helperText={errors.email}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={handleChange}
                    focused={true}
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
                      Submit
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
      )}
    </Container>
  );
};

export default ResetPassword;
