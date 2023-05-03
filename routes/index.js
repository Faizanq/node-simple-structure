
const express = require('express');
const itemRoutes = require('./itemRoutes');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/api/items',
    route: itemRoutes,
  }
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });

 
  module.exports = router;