'use strict';

exports.DATABASE_URL = "mongodb+srv://chase2themac:Hyruleh3ro@my-first-atlas-db-hrrfa.mongodb.net/capstoneTwo?retryWrites=true"
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || "mongodb://localhost/capstoneTwo";
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';