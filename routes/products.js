const express = require('express');
const path = require('path');
const { Router } = express;

const productModel = require('../models/products')
// const productModel = new Product();
const upload = require('../middlewares/file');
const router = Router();

admin = true

router.get('/createTable', async (req, res) => {
    try {
        await productModel.createTable()
        res.status(200).send({success: 'tabla creada correctamente'})
    } catch (error) {
        res.status(400).send({error: 'No se pudo crear la tabla'+ error})
    }
})


// get all produts
router.get('/', async (req, res) => {
    try {
        const products =  await productModel.getAll()
        !products ? res.status(417).send({error:'Hubo un inconveniente al tratar de recuperar todos los prodcutos, trate nuevamente en unos minutos.'})
        : res.status(200).send(products)    
    } catch (error) {
        res.status(400).send({
            error:'Problema al intentar obtener todos los productos', 
            description : error    
        })
    }
})

// get product by id
router.get('/:id', async (req, res)=> {
    try {
        const product = await productModel.getById(req.params.id)
        !product ? res.status(417).send({error:'El producto no existe o el id es erroeo'})
        : res.status(200).send(product)
    } catch (error) {
        res.status(400).send({
            error:'Problema al tratar de obtener el producto', 
            description : error    
        })
    }
})

// add new product
router.post("/", upload.single("thumbnail"), async (req, res) =>{
    try {
        if(!admin){
            res.status(403)
            .send({error: 'Usted no posee el permiso de administrador para realizar esta llamda'})
        }else{
            const { Name, price, description, code, stock} = req.body;
            const date = Date.now()
            const thumbnail = path.join("static/img/" + req.file.filename)
            await productModel.save(Name, date, parseFloat(price), description, code, parseInt(stock), thumbnail).then(date =>{ console.log(date)});
            res.status(201).send({success: 'Producto creado con exito'})
        }
    } catch (error) {
        res.status(400).send({
            error:'Problema al tratar de agregar un nuevo prodcuto', 
            description : error    
        })
    }
  })


// update product by id
router.put("/:id", upload.single("thumbnail"), async (req, res) => {
    try {     
        if(!admin){
            res.status(403)
            .send({error: 'Usted no posee el permiso de administrador para realizar esta llamda'})
        }else{
            const newProduct = {}
            const { Name, price, description, code, stock} = req.body;
            const thumbnail = path.join("static/img/" + req.file.filename)
            newProduct.date = Date.now()
            newProduct.Name = Name
            newProduct.description = description
            newProduct.code = code
            newProduct.thumbnail = thumbnail
            newProduct.price = price
            newProduct.stock = stock
            await productModel.updateById(req.params.id, newProduct)
            res.status(200).send({success: 'Producto actualizado'})
        }
    } catch (error) {
        res.status(400).send({
            error:'Problema al tratar de actualizar el producto', 
            description : error    
        })
    }
})

// delete product by id
router.delete('/:id', async (req, res)=> {
    try {
        if(!admin){
            res.status(403)
            .send({error: 'Usted no posee el permiso de administrador para realizar esta llamda'})
        }else{
            const deleted = await productModel.deleteById(req.params.id)
            !deleted ? res.status(404).send({error:'No se encontro el producto'})
            : res.status(200).send({success: 'Producto eliminado con exito'})
        }
    } catch (error) {
        res.status(400).send({
            error:'Problema al tratar de eliminar el producto', 
            description : error    
        })
    }
})


  module.exports = router;
