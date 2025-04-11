const pg=require('pg')
const pool=new pg.Pool({
    user:'postgres',
    host:'localhost',
    database:'DigiMenu',
    password:'Chhotu@2002',
    port:'5432',
})
module.exports=pool