const Messages = (req, res) => {
    // Si req.message no existe, evitamos que el servidor explote
    if (!req.message) {
        return res.status(500).json({
            type: "Error",
            message: "No messages"
        });
    }

    const { type, message, status } = req.message
    return res.status(status).json({ type, message })
}

export default Messages;