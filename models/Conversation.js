import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
prompt: String,
response: String,
createdAt: {
    type: Date,
    default: Date.now
}
});

export default mongoose.model('Conversation', conversationSchema);
