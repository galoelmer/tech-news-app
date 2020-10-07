import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '../components/Card';

/* Redux */
import { connect } from 'react-redux';
import { getNewsData } from '../actions/newsActions';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: '30px',
  },
}));

const Home = ({ userId, getNewsData, articles, authenticated }) => {
  const classes = useStyles();
  useEffect(() => {
    getNewsData(authenticated  ? userId : null);
  }, [authenticated, getNewsData, userId]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {articles.length ? (
          articles.map((item) => {
            if (!item.title || !item.description || !item.urlToImage) {
              return null;
            }
            return (
              <Grid key={item.title} item xs={12} sm={6} md={4} lg={3} xl={2}>
                <Card
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  newsUrl={item.url}
                  imageUrl={item.urlToImage}
                  datePublished={item.publishedAt}
                  markFavorite={item.favorite}
                />
              </Grid>
            );
          })
        ) : (
          <div>No news available</div>
        )}
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userId: state.user.id,
  authenticated: state.user.authenticated,
  articles: state.newsData.articles,
});

export default connect(mapStateToProps, { getNewsData })(Home);
