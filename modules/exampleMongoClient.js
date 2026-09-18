/**
 * The following code shows how you can specify the connection string and 
 * the Stable API client option when connecting to a MongoDB deployment 
 * on Atlas and verify that the connection is successful:
 * 
 */

const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDb Atlas SRV Connection String
const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI is not set — check your .env file');
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Async run function copied from MongoDb Atlas setup guide
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


/* Previous example - deprecated
export async function runStableAPIConnect() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    const result = await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
    return result;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
runStableAPIConnect().catch(console.dir);
*/