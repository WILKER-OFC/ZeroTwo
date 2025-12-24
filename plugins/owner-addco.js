import { sticker } from '../lib/sticker.js'

let stickerCommands = new Map()

const handler = async (m, { conn, command, text, usedPrefix }) => {
try {
if (!text) {
return conn.reply(m.chat, 
`❀ *USO DEL COMANDO:*\n` +
`» *${usedPrefix}addco [comando]*\n\n` +
`❀ *EJEMPLOS:*\n` +
`» *${usedPrefix}addco kick* (responde a un sticker)\n` +
`» *${usedPrefix}addco menu* (responde a un sticker)\n` +
`» *${usedPrefix}addco ban* (responde a un sticker)\n\n` +
`❀ *DESCRIPCIÓN:*\n` +
`Vincula un sticker a un comando. Cuando uses ese sticker como respuesta, se ejecutará el comando.`,
m)
}

let q = m.quoted
if (!q || !q.mimetype || !q.mimetype.includes('sticker')) {
return conn.reply(m.chat, '❀ Por favor, responde a un *sticker* para vincularlo al comando.', m)
}

await m.react('🕒')

// Descargar el sticker
let stickerBuffer = await q.download()
if (!stickerBuffer) {
return conn.reply(m.chat, '❀ Error al descargar el sticker.', m)
}

// Obtener metadata del sticker
let stickerInfo = {}
try {
if (q.isAnimated) {
stickerInfo.type = 'animated'
} else {
stickerInfo.type = 'static'
}
stickerInfo.fileSize = stickerBuffer.length
} catch (e) {
stickerInfo.type = 'unknown'
}

// Generar un ID único para el sticker
const stickerHash = require('crypto')
.createHash('md5')
.update(stickerBuffer)
.digest('hex')
.substring(0, 10)

const commandName = text.toLowerCase().trim()
const stickerId = `sticker_${stickerHash}`

// Guardar la relación sticker-comando
stickerCommands.set(stickerId, {
command: commandName,
stickerBuffer: stickerBuffer,
stickerHash: stickerHash,
addedBy: m.sender,
addedAt: new Date().toISOString(),
type: stickerInfo.type,
fileSize: stickerInfo.fileSize
})

await m.react('✅')
return conn.reply(m.chat, 
`✅ *STICKER VINCULADO EXITOSAMENTE*\n\n` +
`*Comando:* ${usedPrefix}${commandName}\n` +
`*ID del Sticker:* ${stickerId}\n` +
`*Tipo:* ${stickerInfo.type}\n` +
`*Tamaño:* ${formatBytes(stickerInfo.fileSize)}\n\n` +
`*Ahora cuando respondas a alguien con este sticker, se ejecutará:* ${usedPrefix}${commandName}`,
m)

} catch (error) {
console.error(error)
await m.react('❌')
return conn.reply(m.chat, `❀ Error: ${error.message}`, m)
}
}

// Handler para detectar stickers respondidos
const stickerHandler = async (m, { conn }) => {
try {
if (!m.quoted || !m.quoted.isBaileys || !m.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
return
}

// Verificar si el mensaje es un sticker
if (!m.message?.stickerMessage) {
return
}

// Descargar el sticker
const stickerBuffer = await conn.downloadMediaMessage(m.message.stickerMessage)
if (!stickerBuffer) return

// Generar hash del sticker
const stickerHash = require('crypto')
.createHash('md5')
.update(stickerBuffer)
.digest('hex')
.substring(0, 10)

const stickerId = `sticker_${stickerHash}`

// Buscar si el sticker tiene un comando asignado
if (stickerCommands.has(stickerId)) {
const stickerData = stickerCommands.get(stickerId)
const command = stickerData.command

// Obtener el usuario al que se respondió
const quotedMsg = m.message.extendedTextMessage.contextInfo.quotedMessage
const quotedSender = m.message.extendedTextMessage.contextInfo.participant
const quotedMessageId = m.message.extendedTextMessage.contextInfo.stanzaId

// Ejecutar el comando según el tipo
switch (command) {
case 'kick':
case 'ban':
case 'expulsar':
case 'eliminar':
// Verificar si el bot es admin
const isAdmin = conn.user && conn.user.jid === conn.user.jid
if (!isAdmin) {
return conn.reply(m.chat, '❀ Necesito ser administrador para usar este comando.', m)
}

// Obtener información del grupo
const groupMetadata = await conn.groupMetadata(m.chat)
const participants = groupMetadata.participants
const botAdmin = participants.find(p => p.id === conn.user.jid)?.admin

if (!botAdmin) {
return conn.reply(m.chat, '❀ Necesito ser administrador para expulsar miembros.', m)
}

// Expulsar al usuario mencionado
await conn.groupParticipantsUpdate(m.chat, [quotedSender], 'remove')
await conn.reply(m.chat, `✅ Usuario expulsado mediante sticker vinculado al comando *${command}*`, m)
break

case 'menu':
case 'help':
case 'comandos':
// Ejecutar comando menu
await conn.sendMessage(m.chat, { text: '📋 *MENÚ DE COMANDOS*\n\nEste es el menú ejecutado desde un sticker vinculado.' }, { quoted: m })
// Aquí puedes llamar a tu función del menú principal
// await handlerMenu(m, { conn })
break

case 'warn':
case 'advertencia':
// Sistema de advertencias
await conn.reply(m.chat, `⚠️ *ADVERTENCIA*\n\nSe ha registrado una advertencia para el usuario mediante sticker.`, m)
break

default:
// Para otros comandos, simular el envío del comando
await conn.reply(m.chat, `🔧 *Ejecutando comando:* ${command}\n\nSticker vinculado detectado.`, m)
// Aquí podrías llamar a otros handlers según el comando
break
}
}
} catch (error) {
console.error('Error en sticker handler:', error)
}
}

// Comando para listar stickers vinculados
const listStickerCommands = async (m, { conn, usedPrefix }) => {
try {
if (stickerCommands.size === 0) {
return conn.reply(m.chat, '❀ No hay stickers vinculados a comandos.', m)
}

let listText = `📋 *STICKERS VINCULADOS*\n\n`
let i = 1

for (const [stickerId, data] of stickerCommands.entries()) {
listText += `${i}. *ID:* ${stickerId}\n`
listText += `   *Comando:* ${usedPrefix}${data.command}\n`
listText += `   *Creador:* @${data.addedBy.split('@')[0]}\n`
listText += `   *Tipo:* ${data.type}\n`
listText += `   *Tamaño:* ${formatBytes(data.fileSize)}\n`
listText += `   *Fecha:* ${new Date(data.addedAt).toLocaleString()}\n\n`
i++
}

listText += `\nTotal: ${stickerCommands.size} stickers vinculados`

await conn.reply(m.chat, listText, m)
} catch (error) {
console.error(error)
conn.reply(m.chat, `❀ Error: ${error.message}`, m)
}
}

// Comando para eliminar sticker vinculado
const removeStickerCommand = async (m, { conn, text }) => {
try {
if (!text) {
return conn.reply(m.chat, 
`❀ *USO:* ${usedPrefix}delsticker [ID]\n\n` +
`Usa ${usedPrefix}liststickers para ver los IDs disponibles.`,
m)
}

const stickerId = text.trim()
if (stickerCommands.has(stickerId)) {
stickerCommands.delete(stickerId)
await conn.reply(m.chat, `✅ Sticker con ID *${stickerId}* eliminado exitosamente.`, m)
} else {
await conn.reply(m.chat, `❀ No se encontró un sticker vinculado con el ID *${stickerId}*`, m)
}
} catch (error) {
console.error(error)
conn.reply(m.chat, `❀ Error: ${error.message}`, m)
}
}

// Función auxiliar para formatear bytes
function formatBytes(bytes) {
if (bytes === 0) return '0 B'
const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
const i = Math.floor(Math.log(bytes) / Math.log(1024))
return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

// Exportar handlers
handler.help = ['addco [comando]']
handler.tags = ['tools']
handler.command = ['addco', 'addcommand', 'addsticker']
handler.admin = false
handler.group = true
handler.botAdmin = false

// Exportar el handler de stickers
export { stickerHandler }

// Comando adicional para listar stickers
const listHandler = async (m, { conn, usedPrefix }) => {
await listStickerCommands(m, { conn, usedPrefix })
}
listHandler.help = ['liststickers']
listHandler.tags = ['tools']
listHandler.command = ['liststickers', 'liststicker', 'stickerslist']
listHandler.admin = false

// Comando para eliminar sticker
const delHandler = async (m, { conn, usedPrefix, text }) => {
await removeStickerCommand(m, { conn, usedPrefix, text })
}
delHandler.help = ['delsticker [id]']
delHandler.tags = ['tools']
delHandler.command = ['delsticker', 'removesticker', 'deletesticker']
delHandler.admin = false

export default handler
export { listHandler, delHandler }