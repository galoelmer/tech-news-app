import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '../components/Card';
import testData from '../data';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: '30px',
  },
}));

export default function FullWidthGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {testData.articles.map((item) => {
            if (!item.title || !item.description || !item.urlToImage) {
                return null;
            }
          return (
            <Grid key={item.title} item xs={12} sm={6} md={4} lg={3} xl={2}>
              <Card
                title={item.title}
                description={item.description}
                newsUrl={item.url}
                imageUrl={item.urlToImage}
                datePublished={item.publishedAt}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
