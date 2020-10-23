import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import Grid from '@material-ui/core/Grid';
import Card from '../components/Card';

/**
    TODO:
    - Remove test data after development process
*/
/* TEST DATA */
// import data from '../data';

/* Redux */
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: '30px',
  },
  card: {
    minHeight: 500,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}));

const NoNews = () => (
  <Container maxWidth="sm">
    <Box mt={5}>
      <AnnouncementIcon
        style={{
          fontSize: 70,
          display: 'block',
          margin: '0 auto',
          color: '#00bfff',
        }}
      />
      <Typography component="h2" variant="h3" align="center" color="primary">
        No News Available
      </Typography>
      <Typography variant="body1" align="center" color="textSecondary">
        Try again later
      </Typography>
    </Box>
  </Container>
);

const Home = ({articles, loading }) => {

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {(loading ? Array.from(new Array(12)) : articles).map((item, index) => {
          return (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={2}>
              {item ? (
                <Card
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  newsUrl={item.url}
                  imageUrl={item.urlToImage}
                  datePublished={item.publishedAt}
                  imageSource={item.imageSource}
                  markFavorite={item.favorite}
                />
              ) : (
                <Card />
              )}
            </Grid>
          );
        })}
        {!articles.length && <NoNews />}
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({
  articles: state.newsData.articles,
  loading: state.newsData.loading,
});

export default connect(mapStateToProps)(Home);
