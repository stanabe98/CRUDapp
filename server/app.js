const express= require('express')
const app= express();

const cors= require('cors');
const dotenv= require('dotenv');
dotenv.config();


const dbService= require('./dbservice');



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// create

app.post('/insert', (req,res) => {
    const {name} = req.body;  //object destructuring to prevent req.body.name'
    
  
    const db= dbService.getDbServiceInstance();


    const result = db.insertNewName(name);


    result
    .then(data => res.json({ data: data}))
    .catch(err => console.log(err));


});


//read

app.get('/get', (req,res)=>{

    const db= dbService.getDbServiceInstance();
 
    const result=db.getAllData();


    // console.log(result)

    result.then(data =>res.json({data:data})) //response sent to index.html
    .catch(err => console.log(err))
})



 
// delete 

app.delete('/delete/:id', (req,res)=> {
    const {id} = req.params;
    const db= dbService.getDbServiceInstance();

    const result=db.deleteRowById(id);
    console.log(result)

    result.then(data =>res.json({success :data})) //response sent to index.html
    .catch(err => console.log(err))


})

//patch 
app.patch('/update', (req,res) =>{
    const {id, name} = req.body;
    const db= dbService.getDbServiceInstance();

    const result= db.updateNameById(id, name);
    
    

    result.then(data =>res.json({success :data})) //response sent to index.html
    .catch(err => console.log(err))


})

app.get('/search/:name', (req, res) =>{
    const {name} = req.params;
    const db= dbService.getDbServiceInstance();

    const result= db.searchByName(name);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));


})


app.listen(process.env.PORT, () => console.log('app is running')) 


