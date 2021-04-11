import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";
import "tippy.js/animations/scale-extreme.css";

/* Redux */
import { connect } from "react-redux";
import { logoutUser, updateUsername } from "../actions/userActions";

/* Material UI Components */
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import EditNameForm from "./EditNameForm";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import LockIcon from "@material-ui/icons/Lock";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minWidth: 350,
  },
  menuButton: {
    color: "#ae4e59",
  },
  title: {
    // flexGrow: 1,
    "& a": {
      textDecoration: "none",
      color: "#fff",
    },
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  burgerButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  navLinks: props => ({
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
    display: "flex",
    flex: props.authenticated ? "1" : "0",
    "& a": {
      margin: "0 auto",
    },
  }),
}));

const Navbar = ({
  authenticated,
  userName,
  logoutUser,
  updateUsername,
  randomNameCreated,
}) => {
  const classes = useStyles({ authenticated });
  let history = useHistory();
  const [showForm, setShowForm] = useState(false);
  const [visible, setVisible] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogOut = () => {
    logoutUser();
    history.push("/");
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <div id="back-to-top-anchor" className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            <Link to="/">Tech News</Link>
          </Typography>
          {authenticated ? (
            <div className={classes.navLinks}>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                component={Link}
                to="/favorites"
              >
                Favorites
              </Button>
              <Box display="flex" alignItems="center">
                <Tippy
                  placement="bottom-start"
                  content="Random name generated, click to change"
                  delay={[1000]}
                  animation="scale-extreme"
                  theme="light-border"
                  visible={visible}
                  onCreate={() => {
                    randomNameCreated && setVisible(true);
                  }}
                  onClickOutside={() => setVisible(false)}
                >
                  <Button
                    onClick={() => setShowForm(true)}
                    style={{ textTransform: "capitalize", color: "white" }}
                  >
                    Hello, {userName}
                  </Button>
                </Tippy>

                <Tippy placement="bottom-start" content="Logout">
                  <IconButton
                    className={classes.menuButton}
                    edge="end"
                    aria-label="logout"
                    onClick={handleLogOut}
                  >
                    <ExitToAppIcon />
                  </IconButton>
                </Tippy>
              </Box>
            </div>
          ) : (
            <Box className={classes.navLinks}>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </Box>
          )}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={classes.burgerButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <EditNameForm
        showForm={showForm}
        handleShowForm={setShowForm}
        updateUsername={updateUsername}
      />
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            {authenticated ? (
              <>
                <ListItem button component={Link} to="/favorites">
                  <ListItemIcon>
                    <CollectionsBookmarkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Favorites" />
                </ListItem>
                <ListItem button onClick={handleLogOut}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/login">
                  <ListItemIcon>
                    <LockIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button component={Link} to="/signup">
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText primary="Signup" />
                </ListItem>
              </>
            )}
          </List>
        </div>
      </Drawer>
    </div>
  );
};

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  logoutUser: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  randomNameCreated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  userName: state.user.name,
  randomNameCreated: state.user.randomNameCreated,
});

export default connect(mapStateToProps, { logoutUser, updateUsername })(Navbar);
