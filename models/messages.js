const knex = require('knex')
class Messages {
    constructor() {
        
        // Connection Pool
        this.db = knex({
            client:"sqlite3",
            connection:{
                filename: "./messages.sqlite"
            },
            useNullAsDefault:true
        })
    }

// Create table for Messages
    async createTable(){
        await this.db.schema.dropTableIfExists('messages')
        await this.db.schema.createTable('messages', (table) => {
            table.increments('id')
            table.string('name')
            table.string('message')
            table.string('user_id')
            table.date('date')
        })
        return
    }

// Save new Message
    async save(name, message, user_id, date) {
       let msg = {
           name:name,
           message:message,
           user_id:user_id,
           date:date
        }
        console.log(msg)
        try {
            await this.db('messages').insert(msg)
            return 
        }catch (error){
            return error
        }
    }

// Get all Messages
    async getAll(){
        try {
            const messages =  await this.db.select().from('messages')
            return messages
        } catch (error) {
            return error
        }
    }
}


module.exports = new Messages();