import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function EditNameForm({
  showForm,
  handleShowForm,
  updateUsername,
}) {
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
      handleClose();
      updateUsername(userName);
    }
  };

  return (
    <Dialog
      open={showForm}
      onClose={handleClose}
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
        <Button type="submit" onClick={handleSubmit} color="primary">
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
