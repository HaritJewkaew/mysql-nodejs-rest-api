const https = require('https');

https.get('https://mystretcherapi.ohmiler.repl.co/products', (response) => {
    let data = '';
    response.on('data', (chunk) => {
        data += chunk;
    })

    response.on('end', () => {
        console.log(data);
    })
    .on('error' ,(error) => {
        console.log(error);
    })
}) 