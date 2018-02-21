//Including Mongoose model...
var mongoose = require('mongoose');
//creating object 
var Schema = mongoose.Schema;
//Creating Schema for Tickets....
var ticketSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    ticketNumber: {
        type: String,
        index: true
    },
    queryTitle: {
        type: String,
        required: true
    },
    queryDetails: {
        type: String,
        required: true
    },
    message: [{
        sender: String,
        queryText: String,
        createdAt: {
            type: Date,
            default: Date.now(),
            index: true
        }
                    }],
    ticketStatus: {
        type: String,
        default: "Open"
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        index: true
    }

}, { usePushEach: true });
//model for ticketSchema...
mongoose.model('Ticket', ticketSchema);
