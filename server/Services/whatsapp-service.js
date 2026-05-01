const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

let client;

function initWhatsApp() {

    if (client) return client; // prevents multiple instances
    let qrSaved = false;

    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: { headless: true }
    });

    client.on("qr", async (qr) => {

        if (qrSaved) return;

        try {

            await qrcode.toFile("whatsapp-qr.png", qr);

            console.log("QR saved as image");

            qrSaved = true;

        } catch (err) {

            console.error(err);

        }

    });

    client.on("ready", () => {
        console.log("WhatsApp Bot Ready");
    });

    client.initialize();

    return client;
}

function sendMessage(to, message) {
    if (!client) {
        console.error("WhatsApp client not initialized");
        return;
    }
    client.sendMessage(to, message)
        .then(response => {
            console.log("Message sent:", response);
        })
        .catch(err => {
            console.error("Failed to send message:", err);
        });
}

module.exports = { initWhatsApp, sendMessage };