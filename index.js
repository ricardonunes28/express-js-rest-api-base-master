var express = require("express")
var app = express()
var router = require("./routes/routes")

const port = 8000;
 
// express application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// express application/json
app.use(express.json())

app.use("/",router);

app.listen(port,() => {
    console.log(`Servidor rodando na porta: ${port}`)
});
