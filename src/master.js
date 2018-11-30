const Sharder = require("./Sharder");
const raven = require("raven");


if(process.env.NODE_ENV !== "TEST") {
    process.env.SENTRY_URL = "https://cf3928d8c0064d2a922b71609f64792e@sentry.io/225011";
    raven.config(process.env.SENTRY_URL).install();
    raven.context(function () {
        const sharder = new Sharder();
    });
} else {
    process.env.GRPC_URL = "127.0.0.1:8881";
    try {
        const sharder = new Sharder();
        console.log(sharder);
    } catch (e) {
        console.error(e);
    }
}
