import mongoose from "mongoose";

const connectDB = async () => {
	try{
		await mongoose.connect(process.env.MONGO_URI, {
			serverSelectionTimeoutMS: 10000
		});
		console.log("Database connected successfully");
	}catch(err){
		console.error(err);
		setTimeout(connectDB, 5000);
	}
}

mongoose.connection.on("disconnected", () => {
	console.warn("MongoDB server disconnected ... Reconnecting in 5 sec ...");
});
mongoose.connection.on("error", (err) => {
	console.error(err.message);
});

export default connectDB;
