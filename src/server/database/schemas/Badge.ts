import { Schema, model } from 'mongoose';

const BadgeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
})

const BadgeModel = model('Badge', BadgeSchema);

export { BadgeSchema, BadgeModel };