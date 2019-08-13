var express = require('express');
var router = express.Router();
const request = require('request');

const apiKey = '1fb720b97cc13e580c2c35e1138f90f8';
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

router.use((req, res, next)=>{
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});


/* GET home page. */
router.get('/', function(req, res, next) {
  // any method of request is same as that of router method
  // they have two argument
  // 1. URL
  // 2. a callback method which gets executed when data comes
  //  this callback has 3 arguments
  //  1. error object
  //  2. response object which gets all response header 
  //  3. actual data in string format.
  request.get(nowPlayingUrl, (error, response, movieData) => {
      if (error) {
        console.log('Error->', error);
      }
      const parsedData = JSON.parse(movieData);
      res.render('index', { 
        parsedData: parsedData.results
       });
  });
});

router.get('/movie/:id', (req, res, next)=>{
    const movieId = req.params.id;
    const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`
    request.get(thisMovieUrl, (error, response, movieDetail)=>{
        if (error) {
          res.json(error);
        }
        const parsedMovieDetail = JSON.parse(movieDetail);
        res.render('single-movie',{ parsedData: parsedMovieDetail});
    });
});

router.post('/search', (req, res, next)=>{

  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const searchUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`;
  
  request.get(searchUrl, (error, response, movieData)=>{
    if (error) {
      res.json(error);
    }
    
    let parsedData = JSON.parse(movieData);

    if (cat === 'person') {
      parsedData.results = parsedData.results[0].known_for;
    }

    res.render('index', {
      parsedData: parsedData.results
    });
  });
});

module.exports = router;
