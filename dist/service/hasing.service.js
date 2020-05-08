"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcryptjs");
class HashingService {
    hash(password) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                return hash;
            });
        });
    }
    checkPassword(password, hashPass) {
        return bcrypt.compare(password, hashPass, (err, res) => {
            return res;
        });
    }
}
exports.HashingService = HashingService;
//# sourceMappingURL=hasing.service.js.map