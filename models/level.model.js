const {Schema, mongoose} = require('mongoose');
const LevelSchema = mongoose.Schema({
    memberId: {
        type: String,
        required: true
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('level', LevelSchema);