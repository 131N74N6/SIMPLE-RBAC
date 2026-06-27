import mongoose from "mongoose";

const db = mongoose.connect(`${process.env.MONGODB_URL}`)
.then(res => {
    if (res) console.log('database connected');
}).catch(error => {
    console.log(error || 'connection failed' );
});

export default db;