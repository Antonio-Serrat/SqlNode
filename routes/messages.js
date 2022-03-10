const express = require('express');
const path = require('path');
const { Router } = express;

const messageModel = require('../models/messages')
const router = Router();

admin = true

router.get('/createTable', async (req, res) => {
    try {
        await messageModel.createTable()
        res.status(200).send({success: 'tabla creada correctamente'})
    } catch (error) {
        res.status(400).send({error: 'No se pudo crear la tabla'+ error})
    }
})

// add new product
router.post("/", async (req, res) =>{
    try {
        if(!admin){
            res.status(403)
            .send({error: 'Usted no posee el permiso de administrador para realizar esta llamda'})
        }else{
            const { Name, price, description, code, stock} = req.body;
            const date = Date.now()
            await messageModel.save(Name, date, parseFloat(price), description, code, parseInt(stock), thumbnail).then(date =>{ console.log(date)});
            res.status(201).send({success: 'Producto creado con exito'})
        }
    } catch (error) {
        res.status(400).send({
            error:'Problema al tratar de agregar un nuevo prodcuto', 
            description : error    
        })
    }
  })


  module.exports = router;
