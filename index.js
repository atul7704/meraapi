var express=require("express")
var app=express()
var pool=require('./db')
const bodyParser=require('body-parser')
app.use(bodyParser.json())
app.get('/',(req,res)=>{
res.send('<h1>yaar ab to fetch ho ja<h1/>')
})

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*") //allows all origin
    res.header("Access-Control-Allow-Methods","GET,HEAD,OPTIONS,POST,PUT,DELETE") //allows all methods
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization") 
    next();
    });




    //it is for menu database API

app.get('/menu',async(req,res)=>{
    try{
        var result= await pool.query("select * from menu")
        res.json({menulist:result.rows})
    }catch(err){
        console.log(err)
    }
})

app.get('/getmenubyid',async(req,res)=>{
    try{
        var {id}=req.body;
        var result=await pool.query('select * from menu where mid=$1',[id])
        res.json({menulist:result.rows})
    }catch(err){
        console.log(err)
    }
})


app.delete('/deletemenu',async(req,res)=>{
    try{
        var {id}=req.body;
        var result=await pool.query('delete from menu where mid=$1',[id])
        res.json({status:'200',message:"delete successful"})
    }catch(err){
        console.log(err)
    }
})


app.post('/insertmenu', async (req, res) => {
    try {
        var { mname, price, fid, qid } = req.body;
        var result = await pool.query(
            'INSERT INTO menu(mname, price, fid, qid) VALUES ($1, $2, $3, $4) RETURNING *',
            [mname, price, fid, qid]
        );
        
        // Return the newly inserted row (including mid) in the response
        res.json({ status: '200', message: "Insert successful", newMid: result.rows[0].mid });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: '500', message: 'Error inserting menu' });
    }
});

app.put('/updatemenu',async(req,res)=>{
    try{
        var {mname,price,fid,qid}=req.body;
        var result=await pool.query('update menu set mname=$1,price=$2,fid=$3,qid=$4 where mid=$4 returning *',[mname,price,fid,qid])
        res.json({status:'200',message:"update successful"})
    }catch(err){ 
        console.log(err)
    }
})





//it is for food category API

app.get('/foodcategory',async(req,res)=>{
    try{
        var result= await pool.query("select * from food_cat")
        res.json({foodtype:result.rows})
    }catch(err){
        console.log(err)
    }
})

app.get('/getfoodcatbyid',async(req,res)=>{
    try{
        var {id}=req.body;
        var result=await pool.query('select * from food_cat where fid=$1',[id])
        res.json({foodtype:result.rows})
    }catch(err){
        console.log(err)
    }
})


app.delete('/deletefoodcat', async (req, res) => {
    try {
        const { fid } = req.body; // Extract fid from request body

        // Delete the category from the food_cat table
        await pool.query('DELETE FROM food_cat WHERE fid = $1', [fid]);

        // Return success message
        res.json({
            status: '200',
            message: 'Delete successful',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: '500', message: 'Error deleting category' });
    }
});


app.post('/insertfoodcat', async (req, res) => {
    try {
        const { category } = req.body; // Extract category name from request body

        // Insert the category into the food_cat table and return the newly inserted row
        const result = await pool.query(
            'INSERT INTO food_cat (category) VALUES ($1) RETURNING *', // Use RETURNING * to get the inserted row
            [category]
        );

        // Return the newly inserted row (including fid) in the response
        res.json({
            status: '200',
            message: 'Insert successful',
            newFid: result.rows[0].fid, // Return the fid of the newly inserted category
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: '500', message: 'Error inserting category' });
    }
});

  


app.put('/updatefoodcat', async (req, res) => {
    try {
        const { fid, category } = req.body; // Extract fid and updated category name

        // Update the category in the food_cat table
        const result = await pool.query(
            'UPDATE food_cat SET category = $1 WHERE fid = $2 RETURNING *', // Use RETURNING * to get the updated row
            [category, fid]
        );

        // Return the updated row in the response
        res.json({
            status: '200',
            message: 'Update successful',
            updatedCategory: result.rows[0], // Return the updated category
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: '500', message: 'Error updating category' });
    }
});





//it is for quantity master API


// Backend changes

// Fetch all quantities
app.get('/quantitymaster', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM qty_mast');
        res.json({
            status: '200',
            quantity: result.rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: '500', message: 'Error fetching quantities' });
    }
});

// Fetch a specific quantity by qid
app.get('/getquantityid', async (req, res) => {
    try {
        const { id } = req.query; // Use req.query for GET requests
        const result = await pool.query('SELECT * FROM qty_mast WHERE qid=$1', [id]);
        res.json({ quantity: result.rows });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: '500', message: 'Error fetching quantity by ID' });
    }
});

// Delete a quantity by qid
app.delete('/deletequantity', async (req, res) => {
    try {
        const { qid } = req.body; // Extract qid from request body
        await pool.query('DELETE FROM qty_mast WHERE qid = $1', [qid]);
        res.json({
            status: '200',
            message: 'Delete successful',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: '500', message: 'Error deleting quantity' });
    }
});

// Insert a new quantity
app.post('/insertquantity', async (req, res) => {
    try {
        const { size } = req.body; // Extract size from request body
        const result = await pool.query(
            'INSERT INTO qty_mast (size) VALUES ($1) RETURNING *', // Use RETURNING * to get the inserted row
            [size]
        );
        res.json({
            status: '200',
            message: 'Insert successful',
            newQid: result.rows[0].qid, // Return the qid of the newly inserted quantity
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: '500', message: 'Error inserting quantity' });
    }
});

// Update an existing quantity
app.put('/updatequantity', async (req, res) => {
    try {
        const { qid, size } = req.body; // Extract qid and updated size
        const result = await pool.query(
            'UPDATE qty_mast SET size = $1 WHERE qid = $2 RETURNING *', // Use RETURNING * to get the updated row
            [size, qid]
        );
        res.json({
            status: '200',
            message: 'Update successful',
            updatedQuantity: result.rows[0], // Return the updated quantity
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: '500', message: 'Error updating quantity' });
    }
});


//it is for fetech all data from menu ,qty master and food category

app.get('/alldata',async(req,res)=>{
    try{
        var result= await pool.query("select mid, mname,price,category,size from menu,food_cat,qty_mast where food_cat.fid=menu.fid and qty_mast.qid=menu.qid")
        res.json({menulist:result.rows})
    }catch(err){
        console.log(err)
    }
})



//it is for dashboard

app.get('/countdata', async (req, res) => {
    try {
        // Get the count of records from menu, food_cat, and qty_mast tables
        const menuCount = await pool.query('SELECT COUNT(*) FROM menu');
        const foodCategoryCount = await pool.query('SELECT COUNT(*) FROM food_cat');
        const quantityCount = await pool.query('SELECT COUNT(*) FROM qty_mast');

        // Send the counts as a JSON response
        res.json({
            status: '200',
            message: 'Data fetched successfully',
            menuCount: menuCount.rows[0].count,
            foodCategoryCount: foodCategoryCount.rows[0].count,
            quantityCount: quantityCount.rows[0].count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: '500', message: 'Error fetching count data' });
    }
});


//it is for login

app.get('/user',async(req,res)=>{
    try{
        var result= await pool.query("select * from UserLogin")
        res.json({userlist:result.rows})
    }catch(err){
        console.log(err)
    }
})

app.get('/getuserbyid',async(req,res)=>{
    try{
        var {id}=req.body;
        var result=await pool.query('select * from UserLogin where uid=$1',[id])
        res.json({visitorlist:result.rows})
    }catch(err){
        console.log(err)
    }
})


app.delete('/deleteUserId',async(req,res)=>{
    try{
        var {id}=req.body;
        var result=await pool.query('delete from UserLogin where uid=$1',[id])
        res.json({status:'200',message:"delete successful"})
    }catch(err){
        console.log(err)
    }
})


app.post('/insertUserId',async(req,res)=>{
    try{
        var {emaill,passwordd}=req.body;
        var result=await pool.query('insert into UserLogin(email,password)values($1,$2) returning *',[emaill,passwordd])
        res.json({status:'200',message:"insert successful"})
    }catch(err){ 
        console.log(err)
    }
})


app.put('/updateUserId',async(req,res)=>{
    try{
        var {emaill,passwordd,id}=req.body;
        var result=await pool.query('update visitor set email=$1,password=$2 where uid=$2 returning *',[emaill,passwordd,id])
        res.json({status:'200',message:"update successful"})
    }catch(err){ 
        console.log(err)
    }
})


//it is for book table

app.get('/booktablee',async(req,res)=>{
    try{
        var result= await pool.query("select * from booktable")
        res.json({tablelist:result.rows})
    }catch(err){
        console.log(err)
    }
})

app.get('/contactuss',async(req,res)=>{
    try{
        var result= await pool.query("select * from ContactUs")
        res.json({contactlist:result.rows})
    }catch(err){
        console.log(err)
    }
})






app.listen(3000,'127.0.0.1',()=>{
    console.log("listening to 127.0.0.1:3000")
})