import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import Grid from '@material-ui/core/Grid';
import Card from '../components/Card';
import Button from '@material-ui/core/Button';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
/**
    TODO:
    - Remove test data after development process
*/
/* TEST DATA */
// import data from '../data';

/* Redux */
import { connect } from 'react-redux';
import { getNewsData } from '../actions/newsActions';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 20,
  },
  card: {
    minHeight: 500,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  scrollTop: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
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

const ScrollTop = (props) => {
  const { children, window } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor'
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div
        onClick={handleClick}
        role="presentation"
        className={classes.scrollTop}
      >
        {children}
      </div>
    </Zoom>
  );
};

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

const Home = ({ articles, loading, maxLimit, getNewsData }) => {
  
  const [offset, setOffset] = React.useState(12);
  
  const handleNewsRequest = () => {
    getNewsData('', offset);
    setOffset((prevState) => prevState + 12);
  };

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
                  sourceName={item.sourceName}
                  imageSource={item.imageSource}
                  markFavorite={item.favorite}
                />
              ) : (
                <Card />
              )}
            </Grid>
          );
        })}
        {!!articles.length && !loading && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewsRequest}
            style={{
              margin: '10px auto',
            }}
            id="load-more-button"
            disabled={maxLimit}
          >
            Load more News
          </Button>
        )}
        {!articles.length && !loading && <NoNews />}
      </Grid>
      <ScrollTop>
        <Fab
          style={{
            background: '#f48fb1',
          }}
          size="small"
          aria-label="scroll back to top"
        >
          <KeyboardArrowUpIcon color="secondary" />
        </Fab>
      </ScrollTop>
    </div>
  );
};

const mapStateToProps = (state) => ({
  articles: state.newsData.articles,
  loading: state.newsData.loading,
  maxLimit: state.newsData.maxLimit,
});

export default connect(mapStateToProps, { getNewsData })(Home);
