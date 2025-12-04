const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

async function test() {
    try {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        console.log('MongoMemoryServer URI:', uri);
        await mongoose.connect(uri);
        console.log('Mongoose connected successfully');
        await mongoose.disconnect();
        await mongod.stop();
        console.log('Done');
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
