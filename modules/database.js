const { MongoClient } = require('mongodb');

// import MongoClient from 'mongodb'

// ---------------------------------------------------------------------------- LOGIN DETAILS

const username = 'scalessamantha_db_user';
const password = 'UdyQG9cBeS4f0Tdc';

const uri = `mongodb+srv://${username}:${password}@financial-planner-app.vvbstzd.mongodb.net/?appName=financial-planner-app`;

// ---------------------------------------------------------------------------- COLLECTIONS

async function createCollection(name) {
  const client = new MongoClient(uri);

  try {
    const database = client.db('transactions');
    const createColl = await database.createCollection(name);

    console.log(createColl);
    console.log(`Collection ${name} created successfully.`);
    return createColl;

  } finally {
    await client.close();
    
  }
}

// ---------------------------------------------------------------------------- INSERTS

async function insertSingleDocument(dbName, collectionName, document) {
    const client = new MongoClient(uri);

  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const result = await collection.insertOne(document);
    console.log(
      `A document was inserted with the _id: ${result.insertedId}`,
    );
    
    return result;

  } finally {
    await client.close();

  }
}

async function insertMultipleDocuments(dbName, collectionName, documents) {
  const client = new MongoClient(uri);
  const myDB = client.db(dbName);
  const myColl = myDB.collection(collectionName);
  try {
    const docs = [
        { "_id": 1, "color": "red"},
        { "_id": 2, "color": "purple"},
        { "_id": 1, "color": "yellow"},
        { "_id": 3, "color": "blue"}
    ];
    const insertManyresult = await myColl.insertMany(documents);
    let ids = insertManyresult.insertedIds;
    console.log(`${insertManyresult.insertedCount} documents were inserted.`);

    for (let id of Object.values(ids)) {
        console.log(`Inserted a document with id ${id}`);

    }
  } catch(e) {
    console.log(`A MongoBulkWriteException occurred, but there are successfully processed documents.`);
    let ids = e.result.result.insertedIds;

    for (let id of Object.values(ids)) {
        console.log(`Processed a document with id ${id._id}`);

    }
    console.log(`Number of documents inserted: ${e.result.result.nInserted}`);

  } finally {
    await client.close();

  }
}

// ---------------------------------------------------------------------------- QUERIES

async function getCurrentBudget() {
  const client = new MongoClient(uri);

  try {
    const database = client.db('transactions');
    const budgets = database.collection('budgets');

    // Queries for a movie that has a title value of 'Back to the Future'
    const query = { status: 'active', label: 'current' };
    const currentBudget = await budgets.findOne(query);
    
    console.log(currentBudget);
    return currentBudget;

  } finally {
    await client.close();

  }
}

// getCurrentBudget().catch(console.dir);

module.exports = { getCurrentBudget, createCollection, insertSingleDocument, insertMultipleDocuments };