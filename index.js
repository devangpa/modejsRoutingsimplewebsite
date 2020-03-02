const fs = require('fs');
const http = require('http');
const url = require('url');
// const data = fs.readFileSync('devang.txt', 'utf-8');
// console.log(data);

// // const textOut = `This is what:${txtin}.\nCreated on ${Date.now()}`;
// const k = fs.readFileSync('devang.txt', 'utf-8', (error, data) => {
//   console.log(data);
// });
// console.log('reading process!!!!');
// console.log(k);

//sever
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

const tempoverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const {query, pathname} = url.parse(req.url, true);

  const pathName = req.url;

  //overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {'Content-type': 'text/html'});
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(''); //convert a array to string
    const output = tempoverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    // console.log(cardsHtml);
    res.end(output);
  } else if (pathname === '/product') {
    console.log(query);

    res.writeHead(200, {'Content-type': 'text/html'});
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //API
  else if (pathname === '/api') {
    res.writeHead(200, {'Content-type': 'application/json'});
    res.end(data);
  }

  // not found
  else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'Hello-word'
    });
    res.end('<h1>page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening a request ');
});
