const maprClient = require('mapr-node-bindings')
const config = require('./config')

const {MAPRDB_HOST, MAPRDB_PORT} = config
const { Document, StoreConnection } = maprClient

const maprURL = `${MAPRDB_HOST}:${MAPRDB_PORT}`
const tableName = '/test-db-1'

console.log('new StoreConnection', maprURL)
const store = new StoreConnection(maprURL)

function createTable() {
    store.tableExists(tableName, (err, result) => {
        console.log('tableExists', {err, result})
        if (result) {
            insertDocument()
        } else {
            store.createTable(tableName, (err, result) => {
                console.log('createTable', {err, result})
                insertDocument()
            })
        }
    })
}

function insertDocument() {
    const table = store.getStore(tableName)
    const doc = new Document('test_id')
    doc.setField('field', 'value')

    table.insertOrReplace(doc.toJSON(), tableName, (err, result) => {
        console.log('insertOrReplace', doc.toJSON(), {err, result})
    })
}

function main() {
    createTable()
}

main()
