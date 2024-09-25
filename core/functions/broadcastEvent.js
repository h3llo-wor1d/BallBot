module.exports = (eventType, content) => {
    setTimeout(() => global.wsConnections.forEach(c => {
        try {
            c.send(
                JSON.stringify({
                type: eventType,
                content: content
            })
        )
        } catch {
            console.log('Found dead connection, purging...')
            global.wsConnections = global.wsConnections.filter(con => con !== c);
        }
    }))
 }