const mongoose = require('mongoose');

const TicketSchema = mongoose.Schema({
    memberId: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        default : "No reason"
    },
    descFlag: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('ticket', TicketSchema);