import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '../components/Card';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: '30px',
  },
}));

export default function FullWidthGrid() {
  const classes = useStyles();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/.netlify/functions/fetch-news?from=firestore')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error('Something went wrong: ', error);
      });
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {data.length ? (
          data.map((item) => {
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
}
