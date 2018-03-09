const maprClient = require('mapr-node-bindings')
const config = require('./config')

const {MAPRDB_HOST, MAPRDB_PORT} = config
const { Document, StoreConnection, ODate, OInterval, OTime, OTimestamp } = maprClient

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
    const docId = 123;
    const table = store.getStore(tableName)
    const doc = new Document(docId)
      .setField('test_int', 123)
      .setField('test_date', new ODate(1518689532))
      .setField('test_interval', new OInterval(172800000))
      .setField('test_time', new OTime(3456))
      .setField('test_timestamp', new OTimestamp(29877132000))
      .setField('test_bool', true)
      .setField('test_bool_false', false)
      .setField('test_str', 'strstr')
      .setField('test_object', {a: 1, b: 2})
      .setField('test_empty_object', {})

    table.insertOrReplace(doc.toJSON(), tableName, (err, result) => {
        console.log('insertOrReplace', {err, result})
        findDocument(docId)
    })
}

function findDocument(id) {
    store.findById(tableName, id, (err, result) => {
        console.log('findById', {err, result})
    })
}

function main() {
    createTable()
}

main()
