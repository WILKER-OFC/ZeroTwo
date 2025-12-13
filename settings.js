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

global.botname = '✿ 𝖠𝗂𝗄𝗈 𝖡𝗈𝗍'
global.textbot = 'ᰔᩚ 𝖠𝗂𝗄𝗈 𝖡𝗈𝗍'
global.dev = '© 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 𝗔𝗱𝗼, 𝗬𝗼𝘀𝘂𝗲'
global.author = '❀ 𝗠𝗮𝗱𝗲 𝘄𝗶𝘁𝗵 𝗔𝗱𝗼, 𝗬𝗼𝘀𝘂𝗲'
global.etiqueta = '𝗔𝗱𝗼, 𝗬𝗼𝘀𝘂𝗲'
global.currency = '€ 𝖤𝖴𝖱𝖮𝖲'
global.banner = "https://files.catbox.moe/8obt28.jpg"
global.icono = "https://files.catbox.moe/hhxpb5.jpg"
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
