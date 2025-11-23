import fs from "fs"
import path from "path"
import ws from "ws"

const handler = async (m, { conn, usedPrefix, participants }) => {
try {
const users = [
    global.conn.user.jid,
    ...new Set(
        global.conns
            .filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED)
            .map((conn) => conn.user.jid)
    )
]

let groupBots = users.filter((bot) => participants.some((p) => p.id === bot))
if (participants.some((p) => p.id === global.conn.user.jid) && !groupBots.includes(global.conn.user.jid)) {
    groupBots.push(global.conn.user.jid)
}

function getSubBotCustomName(jid) {
    try {
        const num = jid.replace(/[^0-9]/g, "")
        const file = path.join("./Sessions/SubBot", num, "config.json")
        if (fs.existsSync(file)) {
            const data = JSON.parse(fs.readFileSync(file))
            return data?.name || null
        }
    } catch {}
    return null
}

const botsGroup = groupBots.length > 0
    ? groupBots.map((bot) => {
        const isMainBot = bot === global.conn.user.jid
        const customName = isMainBot ? null : getSubBotCustomName(bot)
        const showName = isMainBot ? (global.botname || 'Bot') : (customName || 'Sub-Bot')
        const typeLabel = isMainBot ? "Principal" : "Sub"
        const mention = bot.replace(/[^0-9]/g, '')

        return `✰ *[${typeLabel} • ${showName}]* › @${mention}`
    }).join("\n")
    : `_No hay bots vinculados en este chat._`

const total = users.length
const subs = total - 1

const message = `❀ *Lista de Bots Activos (${total} Sesiones)*\n\n` +
    `Resumen global:\n` +
    `✰ *Principal › 1 | Subs › ${subs} | En este grupo › ${groupBots.length}*\n\n` +
    `${botsGroup}\n\n` +
    `_Mostrando usuarios conectados al sistema actualmente._\n` +
    `↺ Lista actualizada en tiempo real.`

const mentionList = groupBots.map(bot => bot.endsWith("@s.whatsapp.net") ? bot : `${bot}@s.whatsapp.net`)

await conn.sendMessage(m.chat, { text: message, mentions: mentionList }, { quoted: m })

} catch (error) {
m.reply(`❀ *Ocurrió un error interno.*\n\nDetalles:\n✰ *${error.message}*`)
}}

handler.tags = ["serbot"]
handler.help = ["botlist"]
handler.command = ["botlist", "listbots", "listbot", "bots", "sockets", "socket"]

export default handler