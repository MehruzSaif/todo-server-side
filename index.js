const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m6tqh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("todo").collection("tasks");

        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

        app.patch("/task-complete/:id", async (req, res) => {
            const id = req.params.id;
            // const query = { _id: ObjectId(id) };
            console.log(id);

            const filter = { _id: ObjectId(id) };
            const updateTask = {
                $set: {
                    isComplete: true,
                },
            };
            const result = await taskCollection.updateOne(filter, updateTask);
            console.log(result);
            res.send(result);

        });
    }



    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Todofy!')
})

app.listen(port, () => {
    console.log(`Todofy app listening on port ${port}`)
})