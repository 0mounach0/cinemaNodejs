var request = require('request');

module.exports = {
    searchMovie: async (req, res, next) => {
        var query =  req.query.query ? ("&query="+req.query.query) : "";
        var url = 'https://api.themoviedb.org/3/search/movie?api_key='
                            + process.env.THEMOVIEDB_KEY + '&language=en-US' + query;
        await req.pipe(request(url)).pipe(res).
                    on('error', function(e){
                        console.log(err);
                        res.status(500).json({
                        error: err
                        });
                        handleError(e)
                    });
      },
      getOne: async (req, res, next) => {
        var id =  req.params.id;
        var url = "https://api.themoviedb.org/3/movie/" + id + "?api_key="
                                    + process.env.THEMOVIEDB_KEY +"&language=en-US";
        await req.pipe(request(url)).pipe(res).
                    on('error', function(e){
                        console.log(err);
                        res.status(500).json({
                        error: err
                        });
                        handleError(e)
                    });
      }
};