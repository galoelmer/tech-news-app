import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '../components/Card';

/* Redux */
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: '30px',
  },
}));

const Favorites = ({ favorites = [] }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {favorites.length ? (
          favorites.map((item) => {
            if (!item.title || !item.description || !item.urlToImage) return null;
            return (
              <Grid key={item.title} item xs={12} sm={6} md={4} lg={3} xl={2}>
                <Card
                  id={item.articleId}
                  title={item.title}
                  description={item.description}
                  newsUrl={item.url}
                  imageUrl={item.urlToImage}
                  datePublished={item.publishedAt}
                  imageSource={item.imageSource}
                  markFavorite="remove-icon"
                />
              </Grid>
            );
          })
        ) : (
          <div>You don't have favorites yet</div>
        )}
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({
  favorites: state.user.favorites,
});

export default connect(mapStateToProps)(Favorites);
