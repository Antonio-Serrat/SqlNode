const knex = require('knex')
const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');
const dataJson = path.join(__dirname, "../public/database/messages.json")

class Messages {
    constructor() {
        this.db = knex({
            client:"sqlite3",
            connection:{
                filename: "./messages.sqlite"
            },
            useNullAsDefault:true
        })

        this.nombreArchivo = dataJson
    }

    async createTable(){
        await this.db.schema.dropTableIfExists('messages')
        await this.db.schema.createTable('messages', (table) => {
            table.increments('id')
            table.string('name')
            table.string('date')
            table.string('message')
        })
        return
    }

    async save(name, date, message, id) {
       let msg = {
            id:id,
            name:name,
            date:date,
            message:message
        }
        let newMsgs = []

        try {
            if (!(fs.existsSync(this.nombreArchivo))) {
                const data = JSON.stringify(newMsgs, null, 2)
                await writeFile(data)
            }
            const data = await fsp.readFile(this.nombreArchivo)
            const messages = JSON.parse(data)
            newMsgs = messages
            newMsgs.push(msg)

            const allMessages = JSON.stringify(newMsgs, null, 2)
            await writeFile(allMessages)
            return 
        }catch (error){
            return error
        }
    }
}

async function writeFile(data){
    await fsp.writeFile(dataJson, data, 'utf-8')
    return
}

module.exports = new Messages();