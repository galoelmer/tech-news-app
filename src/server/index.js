import { createServer } from 'miragejs';
import data from './data';

export function makeServer({ environment = 'test' } = {}) {
  let server = createServer({
    environment,

    seeds(server){
      server.db.loadData(data)
    },

    routes() {
      this.namespace = 'api';
      this.timing = 2000;

      this.get('/get-news-data', (schema) => {
        return {data: schema.db.data}
      });
    },
  });

  return server;
}
