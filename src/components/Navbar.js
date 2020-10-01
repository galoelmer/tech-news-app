import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/* Redux */
import { connect } from 'react-redux';
import { logoutUser } from '../actions/userActions';

/* Material UI Components */
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    color: '#ae4e59',
  },
  title: {
    flexGrow: 1,
    '& a': {
      textDecoration: 'none',
      color: '#fff',
    },
  },
}));

const Navbar = ({ authenticated, userName, logoutUser }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/">Tech News</Link>
          </Typography>
          {authenticated ? (
            <Box display="flex" alignItems="center">
              <Typography variant="body1">Hello, {userName}</Typography>
              <IconButton
                className={classes.menuButton}
                edge="end"
                aria-label="logout"
                onClick={() => logoutUser()}
              >
                <ExitToAppIcon />
              </IconButton>
            </Box>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  logoutUser: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  userName: state.user.name,
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
