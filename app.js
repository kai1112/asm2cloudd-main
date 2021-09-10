var express = require('express')
var hbs = require('hbs')

var app = express()


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'hbs')

var url = 'mongodb+srv://kai:doiaido11@cluster0.7rn9g.mongodb.net/test'; // CẦN ĐỊA CHỈ ĐỂ KẾT NỐI
var MongoClient = require('mongodb').MongoClient;


app.get('/delete', async(req, res) => { //delrte product
    let id = req.query.id; // get id product
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("technology");

    await dbo.collection("product").deleteOne(condition);
    res.redirect('/')
})

app.get('/', async(req, res) => { // DÙNG async để đồng bộ
    let client = await MongoClient.connect(url);
    let dbo = client.db("technology");
    let results = await dbo.collection("product").find({}).toArray();

    res.render('index', { model: results })
})

app.get('/insert', (req, res) => {
    res.render('newProduct')
})

app.post('/doInsert', async(req, res) => {
    var priceInput = req.body.txtPrice;
    var productcodeInput = req.body.txtProductcode;
    var colorInput = req.body.txtColor;
    var nameInput = req.body.txtName;
    var newProduct = { name: nameInput, price: priceInput, productcode: productcodeInput, color: colorInput };
    if (!priceInput.endsWith('$')) {
        res.render('newProduct', { error: " fail" })
    } else {
        let client = await MongoClient.connect(url);
        let dbo = client.db("technology");
        await dbo.collection("product").insertOne(newProduct);
        res.redirect('/')
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT);
console.log('server is running at 3000')