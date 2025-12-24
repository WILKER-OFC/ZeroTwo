import fs from 'fs'
import path from 'path'

// Ruta para guardar los stickers vinculados
const stickerDBPath = './stickers_commands.json'

// Cargar base de datos de stickers
let stickerCommands = {}
try {
if (fs.existsSync(stickerDBPath)) {
const data = fs.readFileSync(stickerDBPath, 'utf8')
stickerCommands = JSON.parse(data)
}
} catch (e) {
stickerCommands = {}
console.log('Base de datos de stickers creada nueva')
}

// Guardar base de datos
function saveStickerDB() {
try {
fs.writeFileSync(stickerDBPath, JSON.stringify(stickerCommands, null, 2))
} catch (e) {
console.error('Error guardando DB de stickers:', e)
}
}

const handler = async (m, { conn, command, text, usedPrefix }) => {
try {
if (!text) {
return conn.reply(m.chat, 
`❀ *USO DEL COMANDO:*\n` +
`» ${usedPrefix}addco [comando]\n\n` +
`❀ *EJEMPLOS:*\n` +
`» ${usedPrefix}addco kick (responde a un sticker)\n` +
`» ${usedPrefix}addco ban (responde a un sticker)\n` +
`» ${usedPrefix}addco warn (responde a un sticker)\n\n` +
`❀ *DESCRIPCIÓN:*\n` +
`Vincula un sticker a un comando. Cuando uses ese sticker como respuesta a alguien, se ejecutará el comando.`,
m)
}

// Verificar que se está respondiendo a un sticker
let q = m.quoted
if (!q || !q.mime || !q.mime.includes('sticker')) {
return conn.reply(m.chat, '❀ Por favor, *responde a un sticker* para vincularlo al comando.', m)
}

await m.react('🕒')

// Descargar el sticker
let stickerBuffer = await q.download()
if (!stickerBuffer) {
return conn.reply(m.chat, '❀ Error al descargar el sticker.', m)
}

// Obtener información del sticker
let stickerId = q.fileSha256.toString('hex') || 
require('crypto').createHash('md5').update(stickerBuffer).digest('hex')

// Si es sticker animado
const isAnimated = q.isAnimated || q.type === 'lottie'

// Guardar información del sticker
stickerCommands[stickerId] = {
command: text.toLowerCase().trim(),
addedBy: m.sender,
addedAt: new Date().toISOString(),
chat: m.chat,
isAnimated: isAnimated,
fileSize: stickerBuffer.length
}

// Guardar en archivo
saveStickerDB()

await m.react('✅')
return conn.reply(m.chat, 
`✅ *STICKER VINCULADO EXITOSAMENTE*\n\n` +
`*Comando:* ${usedPrefix}${text.trim()}\n` +
`*ID del Sticker:* ${stickerId.substring(0, 10)}...\n` +
`*Tipo:* ${isAnimated ? 'Animado' : 'Normal'}\n` +
`*Vinculado por:* @${m.sender.split('@')[0]}\n\n` +
`*Ahora cuando respondas a alguien con este sticker, se ejecutará:* ${usedPrefix}${text.trim()}`,
m, { mentions: [m.sender] })

} catch (error) {
console.error(error)
await m.react('❌')
return conn.reply(m.chat, `❀ Error: ${error.message}`, m)
}
}

// =============================================
// HANDLER PARA DETECTAR STICKERS RESPONDIDOS
// =============================================
export const stickerResponseHandler = async (m, { conn }) => {
try {
// Verificar que sea un sticker
if (!m.message?.stickerMessage) return

// Verificar que esté respondiendo a alguien
if (!m.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
return // No está respondiendo a nadie
}

// Obtener información del sticker
const stickerMsg = m.message.stickerMessage
const stickerId = stickerMsg.fileSha256?.toString('hex')

if (!stickerId) return

// Buscar si el sticker está vinculado a un comando
const stickerData = stickerCommands[stickerId]
if (!stickerData) return // Sticker no vinculado

// Obtener información del mensaje respondido
const contextInfo = m.message.extendedTextMessage.contextInfo
const quotedParticipant = contextInfo.participant // Persona a la que se respondió
const quotedMessageId = contextInfo.stanzaId
const quotedMessage = contextInfo.quotedMessage

if (!quotedParticipant) return

// Obtener comando vinculado
const commandName = stickerData.command.toLowerCase()

console.log(`Sticker detectado - Comando: ${commandName}, Usuario: ${quotedParticipant}`)

// Ejecutar el comando según lo vinculado
switch (commandName) {
case 'kick':
case 'expulsar':
case 'remove':
case 'eliminar':
// Verificar si el bot es admin
try {
const groupMetadata = await conn.groupMetadata(m.chat)
const participants = groupMetadata.participants
const botAdmin = participants.find(p => p.id === conn.user.jid)?.admin

if (!botAdmin) {
return conn.reply(m.chat, '❀ Necesito ser administrador para expulsar miembros.', m)
}

// Verificar que la persona a expulsar no sea admin
const targetAdmin = participants.find(p => p.id === quotedParticipant)?.admin
if (targetAdmin) {
return conn.reply(m.chat, '❀ No puedo expulsar a un administrador.', m)
}

// Expulsar al usuario
await conn.groupParticipantsUpdate(m.chat, [quotedParticipant], 'remove')
await conn.reply(m.chat, 
`✅ *USUARIO EXPULSADO*\n\n` +
`*Mediante:* Sticker vinculado\n` +
`*Comando:* ${commandName}\n` +
`*Usuario:* @${quotedParticipant.split('@')[0]}\n` +
`*Ejecutado por:* @${m.sender.split('@')[0]}`,
m, { mentions: [quotedParticipant, m.sender] })
} catch (error) {
console.error('Error al expulsar:', error)
conn.reply(m.chat, `❀ Error al expulsar: ${error.message}`, m)
}
break

case 'warn':
case 'advertencia':
case 'warning':
await conn.reply(m.chat, 
`⚠️ *ADVERTENCIA*\n\n` +
`*Para:* @${quotedParticipant.split('@')[0]}\n` +
`*Motivo:* Sticker vinculado (${commandName})\n` +
`*Advertido por:* @${m.sender.split('@')[0]}`,
m, { mentions: [quotedParticipant, m.sender] })
break

case 'ban':
case 'bloquear':
await conn.reply(m.chat, 
`🚫 *USUARIO BLOQUEADO*\n\n` +
`*Usuario:* @${quotedParticipant.split('@')[0]}\n` +
`*Acción:* ${commandName}\n` +
`*Por:* @${m.sender.split('@')[0]}\n\n` +
`*Nota:* Esta es una simulación. Para ban real necesitas configuración adicional.`,
m, { mentions: [quotedParticipant, m.sender] })
break

case 'menu':
case 'help':
case 'comandos':
// Enviar menú
await conn.sendMessage(m.chat, { 
text: `📋 *MENÚ EJECUTADO DESDE STICKER*\n\n` +
`*Comando vinculado:* ${commandName}\n` +
`*Solicitado por:* @${m.sender.split('@')[0]}\n\n` +
`Usa ${usedPrefix}help para ver todos los comandos.` 
}, { quoted: m })
break

default:
// Para comandos personalizados
await conn.reply(m.chat, 
`🔧 *COMANDO EJECUTADO DESDE STICKER*\n\n` +
`*Comando:* ${commandName}\n` +
`*Usuario objetivo:* @${quotedParticipant.split('@')[0]}\n` +
`*Ejecutado por:* @${m.sender.split('@')[0]}`,
m, { mentions: [quotedParticipant, m.sender] })
break
}

} catch (error) {
console.error('Error en sticker handler:', error)
}
}

// =============================================
// COMANDO PARA VER STICKERS VINCULADOS
// =============================================
handler.help = ['addco [comando]']
handler.tags = ['tools', 'stickers']
handler.command = ['addco', 'addcommand', 'addsticker']
handler.admin = false
handler.group = true

// Comando para listar stickers vinculados
const listStickers = async (m, { conn, usedPrefix }) => {
try {
const stickers = Object.keys(stickerCommands)
if (stickers.length === 0) {
return conn.reply(m.chat, '❀ No hay stickers vinculados a comandos.', m)
}

let text = `📋 *STICKERS VINCULADOS*\n\n`
let i = 1

for (const stickerId of stickers) {
const data = stickerCommands[stickerId]
const shortId = stickerId.substring(0, 8)
const user = data.addedBy.split('@')[0]
const date = new Date(data.addedAt).toLocaleDateString()
const chatName = data.chat ? data.chat.split('@')[0] : 'Desconocido'
const isAnimated = data.isAnimated ? '🎞️ Animado' : '🖼️ Normal'

text += `${i}. *ID:* ${shortId}...\n`
text += `   *Comando:* ${usedPrefix}${data.command}\n`
text += `   *Tipo:* ${isAnimated}\n`
text += `   *Creador:* @${user}\n`
text += `   *Grupo:* ${chatName}\n`
text += `   *Fecha:* ${date}\n\n`
i++
}

text += `\n*Total:* ${stickers.length} stickers vinculados`

await conn.reply(m.chat, text, m)
} catch (error) {
console.error(error)
conn.reply(m.chat, `❀ Error: ${error.message}`, m)
}
}

// Comando para eliminar sticker vinculado
const deleteSticker = async (m, { conn, text }) => {
try {
if (!text) {
return conn.reply(m.chat, 
`❀ *USO:* ${usedPrefix}delsticker [ID]\n\n` +
`Usa ${usedPrefix}liststickers para ver los IDs disponibles.`,
m)
}

const searchId = text.trim()
let deleted = false

// Buscar sticker por ID parcial
for (const stickerId in stickerCommands) {
if (stickerId.startsWith(searchId) || stickerId.includes(searchId)) {
delete stickerCommands[stickerId]
deleted = true
saveStickerDB()
break
}
}

if (deleted) {
await conn.reply(m.chat, `✅ Sticker vinculado eliminado exitosamente.`, m)
} else {
await conn.reply(m.chat, `❀ No se encontró un sticker vinculado con ese ID.`, m)
}
} catch (error) {
console.error(error)
conn.reply(m.chat, `❀ Error: ${error.message}`, m)
}
}

// Exportar handlers
export default handler
export { listStickers, deleteSticker }

// Configurar comandos adicionales
const listHandler = async (m, { conn, usedPrefix }) => {
await listStickers(m, { conn, usedPrefix })
}
listHandler.help = ['liststickers']
listHandler.tags = ['tools']
listHandler.command = ['liststickers', 'liststicker']
listHandler.admin = false

const delHandler = async (m, { conn, usedPrefix, text }) => {
await deleteSticker(m, { conn, usedPrefix, text })
}
delHandler.help = ['delsticker [id]']
delHandler.tags = ['tools']
delHandler.command = ['delsticker', 'removesticker']
delHandler.admin = false

export { listHandler, delHandler }