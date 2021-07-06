import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import { withStyles } from "@material-ui/core/styles";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  TumblrShareButton,
  TumblrIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    "& ul": {
      display: "flex",
      flexWrap: "wrap",
      width: "205px",
    },
  },
})((props) => (
  <Menu
    elevation={2}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "center",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "center",
      horizontal: "left",
    }}
    {...props}
  />
));

export default function SimpleMenu({ url, title, description }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tippy content="Share">
        <IconButton
          aria-label="share"
          aria-controls="share-links-menu"
          aria-haspopup="true"
          onClick={handleClick}
          disabled={!url}
        >
          <ShareIcon />
        </IconButton>
      </Tippy>
      <StyledMenu
        id="share-links-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <EmailShareButton url={url} subject={title} body={description}>
            <EmailIcon size={36} round={true} bgStyle={{ fill: "#00b300" }} />
          </EmailShareButton>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <FacebookShareButton url={url}>
            <FacebookIcon
              size={36}
              round={true}
              bgStyle={{ fill: "#1773EA" }}
            />
          </FacebookShareButton>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <LinkedinShareButton url={url}>
            <LinkedinIcon size={36} round={true} />
          </LinkedinShareButton>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <RedditShareButton url={url} title={title}>
            <RedditIcon size={36} round={true} bgStyle={{ fill: "#FF4500" }} />
          </RedditShareButton>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <TumblrShareButton url={url}>
            <TumblrIcon size={36} round={true} bgStyle={{ fill: "#2F4155" }} />
          </TumblrShareButton>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <TwitterShareButton url={url}>
            <TwitterIcon size={36} round={true} />
          </TwitterShareButton>
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
