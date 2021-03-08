var request = require('request');
var QRCode = require('qrcode')

module.exports = {
    postQrcode: async (req, res, next) => {

        var ticket =  req.body.ticket;
        
        QRCode.toDataURL(ticket, 
            {
                type:'terminal',
                errorCorrectionLevel: 'H'
            }, (err, url) => {

            if(url) {
                res.status(200).json(url);
            }

            if(err) {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }

          });
        
      }
};