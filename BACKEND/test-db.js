const mongoose = require('mongoose');

// Option A: Standard +srv (what you have)
const uriSrv = "mongodb+srv://harishpathania150:harishpathania150@cluster0.ktlbccs.mongodb.net/student-teacher-appointment?retryWrites=true&w=majority";

// Option B: Direct Connection (Bypassing DNS SRV)
const uriDirect = "mongodb://harishpathania150:harishpathania150@ac-abw0ebp-shard-00-00.ktlbccs.mongodb.net:27017,ac-abw0ebp-shard-00-01.ktlbccs.mongodb.net:27017,ac-abw0ebp-shard-00-02.ktlbccs.mongodb.net:27017/student-teacher-appointment?ssl=true&replicaSet=atlas-7d7bhr-shard-0&authSource=admin&retryWrites=true&w=majority";

console.log("Testing connection...");

async function run() {
    try {
        console.log("Trying DIRECT connection string...");
        await mongoose.connect(uriDirect, { serverSelectionTimeoutMS: 5000 });
        console.log("✅ Success with DIRECT connection!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Direct connection failed:", err.message);
        
        try {
             console.log("\nRetrying with standard SRV connection...");
             await mongoose.connect(uriSrv, { serverSelectionTimeoutMS: 5000 });
             console.log("✅ Success with SRV connection!");
             process.exit(0);
        } catch (err2) {
             console.error("❌ SRV connection also failed:", err2.message);
             process.exit(1);
        }
    }
}

run();
