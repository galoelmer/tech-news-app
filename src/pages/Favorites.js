import React, { useState, useEffect } from 'react';
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

const Favorites = ({ articles }) => {
  const classes = useStyles();

  const [list, setList] = useState([]);

  useEffect(() => {
    setList(() => {
      return articles.filter((article) => article.favorite === true);
    });
  }, [articles]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {list.length ? (
          list.map((item) => {
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
  articles: state.newsData.articles,
});

export default connect(mapStateToProps)(Favorites);
