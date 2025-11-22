import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"

global.botNumber = "" 

global.owner = ["50493732693", "584242773183", "51921826291"]
global.suittag = [""] 
global.prems = []

global.libreria = "Baileys Multi Device"
global.vs = "^1.8.2|Latest"
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.yukiJadibts = true

global.botname = 'Zᴇʀᴏ 𝐓𝐰𝐨 ✿'
global.textbot = 'Zᴇʀᴏ 𝐓𝐰𝐨 ✎ 𝙼𝚊𝚍𝚎 𝚋𝚢 𝙲𝚕𝚞𝚋 𝙰.𝚈.𝙼'
global.dev = '© 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐂𝐥𝐮𝐛 𝐀.𝐘.𝐌 ✦'
global.author = '✿ 𝐌𝐚𝐝𝐞 𝐰𝐢𝐭𝐡 𝐂𝐥𝐮𝐛 𝐀.𝐘.𝐌'
global.etiqueta = '𝐂𝐥𝐮𝐛 𝐀.𝐘.𝐌 ✎'
global.currency = '€ 𝐄𝐮𝐫𝐨𝐬'
global.banner = "https://qu.ax/TkbrV.jpg"
global.icono = "https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742678797993.jpeg"
global.catalogo = fs.readFileSync('./lib/catalogo.jpg')

global.group = "https://chat.whatsapp.com/HaKf6ezcwdbGzmH782eBal"
global.community = "https://chat.whatsapp.com/G0kXqsteJFU74yrLtg79o6"
global.channel = "https://whatsapp.com/channel/0029Vb64nWqLo4hb8cuxe23n"
global.github = "https://github.com/The-King-Destroy/YukiBot-MD"
global.gmail = "thekingdestroy507@gmail.com"
global.ch = {
ch1: "120363401404146384@newsletter"
}

global.APIs = {
xyro: { url: "https://api.xyro.site", key: null },
yupra: { url: "https://api.yupra.my.id", key: null },
vreden: { url: "https://api.vreden.web.id", key: null },
delirius: { url: "https://api.delirius.store", key: null },
zenzxz: { url: "https://api.zenzxz.my.id", key: null },
siputzx: { url: "https://api.siputzx.my.id", key: null },
adonix: { url: "https://api-adonix.ultraplus.click", key: 'Adofreekey' }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.redBright("Update 'settings.js'"))
import(`${file}?update=${Date.now()}`)
})
