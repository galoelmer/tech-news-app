import React, { useState, useEffect } from 'react';
import { formatDistanceStrict } from 'date-fns';
import { useHistory } from 'react-router-dom';
import randomColor from 'randomcolor';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

/* Redux */
import { connect } from 'react-redux';
import { markFavoriteNews } from '../actions/newsActions';
import {
  addToUserFavorites,
  removeFromFavorites,
} from '../actions/userActions';

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
import DeleteIcon from '@material-ui/icons/Delete';
import ShareLinks from './ShareLinks';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxWidth: 400,
    maxHeight: 500,
    minHeight: 500,
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      minWidth: 320
    }
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: () => ({
    backgroundColor: randomColor({ luminosity: 'dark', hue: 'random' }),
    fontSize: '1em',
    width: theme.spacing(7),
    height: theme.spacing(7),
    border: '1px solid #ccc',
    textAlign: 'center',
    wordBreak: 'break-all',
  }),
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
  imageSource,
  sourceName,
  datePublished,
  markFavorite = false,
  markFavoriteNews,
  authenticated,
  addToUserFavorites,
  removeFromFavorites,
}) => {
  const classes = useStyles();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const history = useHistory();
  const [loadingFavoriteButton, setLoadingFavoriteButton] = useState(false);
  /**
      TODO:
      - Re-work on how to handle favorites news
  */
  useEffect(() => {
    setIsFavorite(!!markFavorite);
  }, [markFavorite]);

  const fetchImage = (src) => {
    const loadingImage = new Image();
    loadingImage.src = src;
    loadingImage.onload = () => {
      setCurrentImage(loadingImage.src);
      setLoadingImage(false);
    };
  };

  useEffect(() => {
    fetchImage(imageUrl);
  }, [imageUrl]);

  // Handle click to add/remove from favorite button
  const handleFavorite = () => {
    if (!authenticated) {
      history.push('/login');
    } else {
      const article = {
        articleId: id,
        title,
        description,
        url: newsUrl,
        urlToImage: imageUrl,
        imageSource,
        sourceName,
        publishedAt: datePublished,
      };

      setLoadingFavoriteButton(true);
      
      if (isFavorite || markFavorite === 'remove-icon') {
        removeFromFavorites(id);
      } else {
        addToUserFavorites(article);
        markFavoriteNews(id);
      }

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
        .then(() => {
          setLoadingFavoriteButton(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setIsFavorite((prevState) => !prevState);
  };

  return (
    <Card className={classes.root} data-article-id={id}>
      <Link
        underline="none"
        href={newsUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
      >
        <CardActionArea>
          <CardHeader
            avatar={
              imageSource ? (
                <Avatar
                  variant="rounded"
                  aria-label="Source Logo"
                  className={classes.avatar}
                  alt="news"
                  src={imageSource}
                >
                  {sourceName}
                </Avatar>
              ) : (
                <Skeleton
                  animation="wave"
                  variant="rect"
                  width={40}
                  height={40}
                />
              )
            }
            title={
              title ? (
                title
              ) : (
                <Skeleton height={10} width="90%" style={{ marginBottom: 6 }} />
              )
            }
            subheader={
              datePublished ? (
                `Posted: ${formatDistanceStrict(
                  new Date(datePublished),
                  new Date(),
                  {
                    addSuffix: true,
                  }
                )}`
              ) : (
                <Skeleton height={10} width="40%" />
              )
            }
          />
          {!loadingImage ? (
            <CardMedia
              className={classes.media}
              image={currentImage}
              title={title || ''}
            />
          ) : (
            <Skeleton
              variant="rect"
              animation="wave"
              className={classes.media}
            />
          )}
          <CardContent>
            {description ? (
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                className={classes.description}
              >
                {(description && description.slice(0, 170)) + '...' ||
                  'No description available'}
              </Typography>
            ) : (
              <React.Fragment>
                {Array.from(new Array(5)).map((item, index) => (
                  <Skeleton
                    key={index}
                    height={15}
                    style={{ marginBottom: 6 }}
                  />
                ))}

                <Skeleton height={15} width="80%" />
              </React.Fragment>
            )}
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions disableSpacing>
        <Tippy
          content={
            markFavorite === 'remove-icon'
              ? 'Remove'
              : isFavorite
              ? 'Remove from Favorites'
              : 'Add to Favorites'
          }
        >
          <IconButton
            aria-label="add to favorites"
            onClick={handleFavorite}
            disabled={loadingFavoriteButton}
          >
            {markFavorite === 'remove-icon' ? (
              <DeleteIcon htmlColor="#ed6999" />
            ) : isFavorite ? (
              <FavoriteIcon />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Tippy>
        <ShareLinks url={newsUrl} title={title} description={description} />
      </CardActions>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  userId: state.user.id,
  loadingFavorites: state.newsData.loadingFavorites,
});

export default connect(mapStateToProps, {
  markFavoriteNews,
  addToUserFavorites,
  removeFromFavorites,
})(NewsCard);
