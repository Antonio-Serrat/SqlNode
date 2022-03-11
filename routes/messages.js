const express = require('express');
const { Router } = express;

const messageModel = require('../models/messages')
const router = Router();


// Drop and create table
router.get('/createTable', async (req, res) => {
    try {
        await messageModel.createTable()
        res.status(200).send({success: 'tabla creada correctamente'})
    } catch (error) {
        res.status(400).send({error: 'No se pudo crear la tabla'+ error})
    }
})

// Add new message
router.post("/", async (req, res) =>{
    try {
        const { name, message, user_id } = req.body;
        const date = Date.now()
        await messageModel.save(name, message, user_id, date);
        res.status(201).send({success: 'mensaje guardado con exito'})
    } catch (error) {
        res.status(400).send({
            error:'Problema al tratar de guardar el mensaje', 
            description : error    
        })
    }
  })

// Get all messages
router.get('/', async (req, res) =>{
    try {
        const messages = await messageModel.getAll()
        res.status(201).send(messages)
    } catch (error) {
        res.status(400).send({
            error:'Problema al tratar de traer todos los mensajes', 
            description : error    
        })
    }
})

  module.exports = router;
