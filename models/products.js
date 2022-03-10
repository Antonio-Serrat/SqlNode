const knex = require('knex')
const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');
const dataJson = path.join(__dirname, '../public/database/products.json')

class Products {
    constructor() {
        this.db = knex({
            client:"mysql",
            connection:{
                host:"localhost",
                port:3306,
                user:"root",
                password:"rootpass",
                database:"products_db"
            }
        })
        this.nombreArchivo = dataJson
    }

    async createTable(){
        await this.db.schema.dropTableIfExists('products')
        await this.db.schema.createTable('products', (table) => {
            table.increments('id')
            table.string('name')
            table.string('date')
            table.string('description')
            table.string('code')
            table.double('price')
            table.integer('stock')
            table.string('thumbnail')
        })
        return
    }

    async save(Name, date, price, description, code, stock, thumbnail) {
        let producto = {
            date: date,
            name: Name,
            description: description,
            code: code,
            thumbnail: thumbnail,
            price: price,
            stock: stock
        };
        let newProducts = [];
        try {
            await this.db("products").insert(producto)
            if (!(fs.existsSync(this.nombreArchivo))) {
                const data = JSON.stringify(newProducts, null, 2)
                writeFile(data)
            }
            
            const data = await fsp.readFile(this.nombreArchivo) 
            const products = JSON.parse(data);
            newProducts = products;
            newProducts.push(producto);
            const allProducts = JSON.stringify(newProducts, null, 2);
            writeFile(allProducts)
            return producto.date
        } catch (error) {
            return error;
        }
    }

    async getAll() {
        try {
            const products = await this.db.select().from('products')
            return products;
        } catch (error) {
            return error
        }
    }

    async getById(id) {
        try {
            const product = await this.db('products').where({ id }).first()
            return product
        } catch (error) {
            return error
        }
    }

    async deleteById(id) {
        try {
            await this.db('products').where({ id }).del()
            const product = products.find(product => product.id == id);
            if (product) {
                const index = products.indexOf(product)
                products.splice(index, 1)
                return true
            }
            else{
                return false
            }
        } catch (error) {
            return error
        }
    }

    async deleteAll() {
        try {
            await this.db.schema.dropTableIfExists('products')
            writeFile('[]')
            return
        } catch (error) {
            return error
        }
    }

    async updateById(id, newProduct) {
        try {
            await this.db('products').where({ id }).update(newProduct)

            const product = products.find(product => product.id == id);
            const index = products.indexOf(product)
            newProduct.id = product.id 
            products.splice(index, 1, newProduct)
            const updatedProducts = JSON.stringify(products, null, 2);
            writeFile(updatedProducts)
            return
        } catch (error) {
            return error
        }
    }
}


async function readFile (){
    const data = await fsp.readFile(dataJson)
    return JSON.parse(data);
}

async function writeFile(data){
    await fsp.writeFile(dataJson, data, 'utf-8')
    return
}

module.exports = new Products();