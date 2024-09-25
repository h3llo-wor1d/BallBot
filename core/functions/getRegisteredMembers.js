require('dotenv').config()

module.exports = async () => {
    let f1 = await fetch(process.env.REG_ENDPOINT);
    let f2 = await f1.json();
    return f2.Items;
}