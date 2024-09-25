module.exports = async (i) => {
    let out = [];
    
    // Why was I fetching this every time I loop this, it seems so inefficient lol
    let skippedRole = i.guild.roles.cache.find(r => r.name === "Skipped");
    if (registeredMembers.length === 0 && skippedList.length > 0) {
        for (const skipped of global.skippedList) {
            let mem = i.guild.members.cache.get(skipped);
            mem.roles.remove(skippedRole);
        }
        global.registeredMembers = skippedList;
        global.skippedList = [];
    }
    for (const memberID of global.registeredMembers) {
        let member = await i.guild.members.cache.get(memberID);
        try {
            if (member.presence.status) {
                // Todo: advanced settings on React site to allow for advanced settings
                if (member.presence.status !== "offline" /*&& global.rawMemberData.filter(i => i.id === memberID).shouldSkip*/) {
                    out.push(memberID)
                }
            }
        } catch {}    
    }
    return out;
}