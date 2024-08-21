# ZenoPay-Firebase-Node.js
To implement this functionality using Firebase, you'll typically use Cloud Functions to handle the HTTP requests and logging. Here's how you can set up a Firebase Cloud Function that sends the request to the API and logs any errors to Firestore instead of a file.

### Steps:

1. **Set Up Firebase Project**:
   - Make sure you have Firebase CLI installed and your project is set up.
   - Initialize Firebase Functions in your project.

2. **Install Dependencies**:
   - Install the `axios` package to handle HTTP requests, as it's commonly used in Node.js.

   ```bash
   npm install axios
   ```

3. **Create Cloud Function**:
   - Create a new Cloud Function in your `index.js` or `functions.js` file.

### Example Code

```javascript
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
```

### Deploy the Function
Deploy your Cloud Function using the Firebase CLI:

```bash
firebase deploy --only functions:createOrder
```

### Usage
After deploying the function, you can trigger it via an HTTP request by sending a POST request to the URL provided by Firebase, e.g., `https://<your-project-id>.cloudfunctions.net/createOrder`. Make sure to pass the necessary data in the request body.

### Error Logging
Errors will be logged to a Firestore collection named `error_logs`. Each error entry will include the error message and a timestamp.