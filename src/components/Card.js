import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    maxHeight: 500,
    minHeight: 500,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: '#ed6663',
    fontSize: '1em',
  },
  description: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export default function NewsCard({
  id,
  title,
  description,
  newsUrl,
  imageUrl,
  datePublished,
}) {
  const classes = useStyles();

  return (
    <Card className={classes.root} data-article-id={id}>
      <Link underline="none" href={newsUrl} target="_blank" rel="noopener noreferrer">
        <CardActionArea>
          <CardHeader
            avatar={
              <Avatar
                variant="rounded"
                aria-label="recipe"
                className={classes.avatar}
              >
                News
              </Avatar>
            }
            // action={
            //   <IconButton aria-label="settings">
            //     <MoreVertIcon />
            //   </IconButton>
            // }
            title={title.slice(0, 100) + '...' || ''}
            subheader={datePublished || ''}
          />
          <CardMedia
            className={classes.media}
            image={imageUrl || ''}
            title={title || ''}
          />
          <CardContent>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.description}
            >
              {(description && description.slice(0, 170)) + '...' ||
                'No description available'}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
