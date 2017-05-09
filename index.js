const express = require('express');
const path = require('path');  
const app = express();  

var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'public/', 'favicon.ico'))); 

app.use(express.static(path.join(__dirname, "public")));

app.listen(process.env.PORT || 3000, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening`)
})