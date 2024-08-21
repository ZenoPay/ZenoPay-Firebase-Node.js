const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

const db = admin.firestore();

exports.createOrder = functions.https.onRequest(async (req, res) => {
    const url = "https://api.zeno.africa";

    const orderData = {
        'create_order': 1,
        'buyer_email': req.body.buyer_email || 'YOUR_CUSTOMER_EMAIL',
        'buyer_name': req.body.buyer_name || 'YOUR_CUSTOMER_NAME',
        'buyer_phone': req.body.buyer_phone || '0752117588',
        'amount': req.body.amount || 10000,
        'account_id': req.body.account_id || 'YOUR_ACCOUNT_ID',
        'api_key': req.body.api_key || 'YOUR_KEY',
        'secret_key': req.body.secret_key || 'YOUR_SECRET_KEY'
    };

    try {
        const response = await axios.post(url, orderData);
        res.status(200).send(response.data);
    } catch (error) {
        await db.collection('error_logs').add({
            error: error.message,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(500).send('Error creating order');
    }
});
