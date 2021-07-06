import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    marginTop: theme.spacing(6),
  },
  text: {
    letterSpacing: theme.spacing(0.2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    color: "#0d0d0d",

    "& span": {
      textDecoration: "underline",
    },
  },
}));

export default function StickyFooter() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <footer className={classes.footer}>
        <Typography className={classes.text} variant="body2">
          Created by{" "}
          <Link
            color="inherit"
            href="https://galoelmer.github.io/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>Elmer C. Galo</span>
          </Link>
        </Typography>
      </footer>
    </div>
  );
}
