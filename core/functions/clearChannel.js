module.exports = async(channelID, interaction, maxLimit=100) => {
    try {
        return new Promise(async (resolve, reject) => {
            const channel = await interaction.guild.channels.cache.get(channelID);
            let fetched;
            do {
                fetched = await channel.messages.fetch({limit: maxLimit});
                await channel.bulkDelete(fetched);
            }
            while(fetched.size >= 2);
            resolve();
        })
    } catch {
        return false
    }
}