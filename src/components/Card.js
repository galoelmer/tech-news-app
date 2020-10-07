import React from 'react';

/* Redux */
import { connect } from 'react-redux';
import { markFavoriteNews } from '../actions/newsActions';

/* Material UI components */
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
import Link from '@material-ui/core/Link';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShareIcon from '@material-ui/icons/Share';
// import MoreVertIcon from '@material-ui/icons/MoreVert';

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

const NewsCard = ({
  userId,
  id,
  title,
  description,
  newsUrl,
  imageUrl,
  datePublished,
  markFavorite,
  markFavoriteNews,
}) => {
  const classes = useStyles();
  const [isFavorite, setIsFavorite] = React.useState(false);
  /**
      TODO:
      - Re-work on how to handle favorites news
  */
  React.useEffect(() => {
    setIsFavorite(markFavorite);
  }, [markFavorite]);

  // Handle click to add/remove from favorite button
  const handleFavorite = () => {
    setIsFavorite((prevState) => !prevState);
    markFavoriteNews(id);

    const article = {
      description,
      publishedAt: datePublished,
      title,
      url: newsUrl,
      urlToImage: imageUrl,
    };

    const data = {
      articleId: id,
      userId,
      ...(!isFavorite && { article }),
    };

    const requestType = isFavorite
      ? 'remove-from-favorites'
      : 'add-to-favorites';

    fetch(`/.netlify/functions/${requestType}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Card className={classes.root} data-article-id={id}>
      <Link
        underline="none"
        href={newsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
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
        {markFavorite === 'remove-icon' ? null : (
          <IconButton aria-label="add to favorites" onClick={handleFavorite}>
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        )}
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  userId: state.user.id,
});

export default connect(mapStateToProps, { markFavoriteNews })(NewsCard);
