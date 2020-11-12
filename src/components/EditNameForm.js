import React from 'react';
import { useSelector } from 'react-redux';

/* Material UI components */
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function EditNameForm({
  showForm,
  handleShowForm,
  updateUsername,
}) {
  const classes = useStyles();
  const loading = useSelector((state) => state.user.loading);
  const [username, setUsername] = React.useState('');
  const [error, setError] = React.useState(false);
  const handleClose = () => {
    setError(false);
    setUsername('');
    handleShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userName = username.trim();
    if (!userName.length) {
      setError(true);
    } else {
      setError(false);
      updateUsername(userName, handleClose);
    }
  };

  return (
    <Dialog
      open={showForm}
      onClose={handleClose}
      disableBackdropClick={loading}
      disableEscapeKeyDown={loading}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Username</DialogTitle>
      <DialogContent>
        <TextField
          error={error}
          helperText={error && 'Username should not be empty'}
          autoFocus
          margin="dense"
          id="name"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <div className={classes.buttonWrapper}>
          <Button
            type="submit"
            onClick={handleSubmit}
            color="primary"
          >
            Update
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}
