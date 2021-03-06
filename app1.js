//const request = require('request')
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./units/geocode')
const forecast = require('./units/forecast')

const app = express()

//Define paths for express config.
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//Setup handlebars engine and views locations.
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory.
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
     res.render('index',{
         title:'Weather app',
         name:'komal'
   })
  })

app.get('/about',(req,res)=>{
   res.render('about',{
       title:'About me',
       name:'Komal'
  })
})


app.get('/help',(req,res)=>{
    res.render('help',{ 
              title:'help',
              helptext:'This is some helpful text',
              name:'komal'
   })
})



app.get('/weather',(req,res)=>{

    if(!req.query.address){
    return res.send({
        error:'you must provide an error.'
    })
  }

geocode(req.query.address,(error,{latitude,longitude,location} = {})=>{
     if(error){
        return res.send({error})
    } 

    forecast(latitude,longitude,(error,forecastData)=>{
              if(error){
                    return res.send({error})
       }
             res.send({
              forecast:forecastData,
              location,
              address:req.query.address
            })
    })      
  })
})

app.get('/products',(req,res)=>{
     if(!req.query.search){
       return res.send({
           error:"you must provide a search term."
      })
  }
       console.log(req.query.search)
    res.send({
          products:[]
  })
})

app.get('/help/*',(req,res)=>{
     res.render('404',{
    title:'404',
       name:'komal',
       errorMessage:'Help article not found'
 })
})

app.get('*',(req,res)=>{
   res.render('404',{
       title:'404',
       name:'komal',
       errorMessage:'Page not found'
  })
})

app.listen(3000, () =>{
   console.log('Server is up on port 3000')
 
 })