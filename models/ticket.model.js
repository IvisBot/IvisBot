const mongoose = require('mongoose');

const TicketSchema = mongoose.Schema({
    ticketId: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        default : "No reason"
    },
    description: {
        type: String,
        default : "No description"
    },
});

module.exports = mongoose.model('ticket', TicketSchema);