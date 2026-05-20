const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
dotenv.config();
const port = process.env.PORT;

const uri = process.env.MONGODB_URI;

// permissions
app.use(cors());
app.use(express.json());


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const db = client.db('car-rental');
        const carsCollection = db.collection('cars');
        const bookingsCollection = db.collection('bookings');

        app.get('/cars', async (req, res) => {

            const result = await carsCollection.find().toArray();
            res.json(result);

        })
        app.patch('/cars/:carId', async (req, res) => {

            const { carId } = req.params;
            const updateData = req.body;


            const result = await carsCollection.updateOne(
                { _id: new ObjectId(carId) },
                { $set: updateData })
            res.json(result);

        })

        app.get('/cars/:id', async (req, res) => {

            const { id } = req.params;
            const result = await carsCollection.findOne({ _id: new ObjectId(id) });
            res.json(result);

        })

        app.post('/bookings', async (req, res) => {
            const bookingInfo = req.body;
            const result = await bookingsCollection.insertOne(bookingInfo);
            res.json(result);

        })
        app.get('/bookings/:userId', async (req, res) => {
            const { userId } = req.params;
            const result = await bookingsCollection.find({ userId }).toArray();
            res.json(result);

        })

        app.post('/cars', async (req, res) => {
            const addedCar = req.body;
            const result = await carsCollection.insertOne(addedCar);
            res.json(result);

        })
        app.get('/added-car/:userId', async (req, res) => {
            const { userId } = req.params;
            const result = await carsCollection.find({ userId }).toArray();
            res.json(result);

        })
        app.delete('/added-car/:carId', async (req, res) => {
            const { carId } = req.params;
            const result = await carsCollection.deleteOne({ _id: new ObjectId(carId) });
            res.json(result);

        })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Server is working')
})

app.listen(port, () => {
    console.log(`Server is working on port ${port}`)
})
