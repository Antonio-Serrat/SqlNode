const knex = require('knex')

class Products {
    constructor() {
        
        // Connection Pool
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
    }

// Create table for Products
    async createTable(){
        await this.db.schema.dropTableIfExists('products')
        await this.db.schema.createTable('products', (table) => {
            table.increments('id')
            table.string('name')
            table.string('date')
            table.double('price')
            table.string('thumbnail')
        })
        return
    }


// Save new Product
    async save(title, date, price, thumbnail) {
        let producto = {
            date: date,
            name: title,
            thumbnail: thumbnail,
            price: price
        };
        try {
            await this.db("products").insert(producto)
            return producto.date
        } catch (error) {
            return error;
        }
    }

// Get all Products
    async getAll() {
        try {
            const products = await this.db.select().from('products')
            return products;
        } catch (error) {
            return error
        }
    }

// Get Product by ID
    async getById(id) {
        try {
            const product = await this.db('products').where({ id }).first()
            return product
        } catch (error) {
            return error
        }
    }

// Delet Product by ID
    async deleteById(id) {
        try {
            await this.db('products').where({ id }).del()
        } catch (error) {
            return error
        }
    }

// Delete all Products
    async deleteAll() {
        try {
            this.createTable()
            return
        } catch (error) {
            return error
        }
    }

// Update Product by ID
    async updateById(id, newProduct) {
        try {
            await this.db('products').where({ id }).update(newProduct)
            return
        } catch (error) {
            return error
        }
    }
}


module.exports = new Products();