/*Author : lalbiakthuama */

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
app.set("view engine","ejs");
app.use(express.static("public"));

/*This section is for connecting to databse*/
const dataSchema = new mongoose.Schema({
    name:String,
    last:String,
    buy:String,
    sell:String,
    volume:String,
    base_unit:String,
});
const Data = mongoose.model('Data',dataSchema);

const connectDB = async () => {
    await mongoose.connect("mongodb://localhost:27017/test");
    if((await Data.find()).length >= 10){
        return;
    }
    await axios.get('https://api.wazirx.com/api/v2/tickers').then((response) => {
        const data = response.data;
        const keys= Object.keys(data);
        for(let i=0;i<10;i++){
            let newData = new Data({
                name:data[keys[i]].name,
                last:data[keys[i]].last,
                buy:data[keys[i]].buy,
                sell:data[keys[i]].sell,
                volume:data[keys[i]].volume,
                base_unit:data[keys[i]].base_unit,
            });
            newData.save();
            console.log(data[keys[i]]);
        }
        }).catch((error) => {
            console.log(error);
        }).then(() => {
            console.log('Success');
        });
}
connectDB();

/*This is the route for extracting the data*/

app.get('/',async(req,res) => {
    const datas = await Data.find();
    console.log(datas);
    res.render('index',{datas:datas});
})

app.listen(8080,()=> {
    console.log('Running API on 8080');
})
