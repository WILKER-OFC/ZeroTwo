import fetch from 'node-fetch'
import { generateWAMessageFromContent, generateWAMessageContent, proto } from '@whiskeysockets/baileys' 

let handler = async (m, { conn, args }) => {
  let mentionedJid = await m.mentionedJid
  let userId = mentionedJid && mentionedJid[0] ? mentionedJid[0] : m.sender
  let totalreg = Object.keys(global.db.data.users).length
  let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

  const sections = [
    // ... (tus secciones permanecen iguales)
  ]

  const footer = `*━━━━━━━━━━━━━━━━━━━━━━━━*`

  let txt = `╭─── •• ─── ✦ ─── •• ───╮
┊   *¡Hola! @${userId.split('@')[0]}*
┊   *Soy ${botname}*
┊   ${(conn.user.jid == global.conn.user.jid ? '𝗣𝗿𝗶𝗻𝗰𝗶𝗽𝗮𝗹' : '𝗦𝘂𝗯-𝗕𝗼𝘁')}
╰─── •• ─── ✦ ─── •• ───╯

╭─⊷ *𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈Ó𝐍*
│ ✦ *Usuarios*: ${totalreg.toLocaleString()}
│ ✦ *Versión*: ${vs}
│ ✦ *Comandos*: ${totalCommands}
│ ✦ *Librería*: ${libreria}
╰───────────────

*📜 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒*
`
'╭─⊷ *Subbots*
╰──────────────'
  sections.forEach(section => {
    txt += `\n╭─⊷ *${section.title}*
`
    section.commands.forEach(([command, description], index) => {
      txt += `│ ✦ ${command}
│   › ${description}
`
      if (index < section.commands.length - 1) {
        txt += `│
`
      }
    })
    txt += `╰───────────────\n`
  })

  let media = await generateWAMessageContent({ 
    image: { url: banner } 
  }, { 
    upload: conn.waUploadToServer 
  })

  let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: {
          body: { text: txt },
          footer: { text: footer },
          header: {
            hasMediaAttachment: true,
            imageMessage: media.imageMessage
          },
          nativeFlowMessage: {
            buttons: [
              {
                "name": "cta_url",
                "buttonParamsJson": JSON.stringify({
                  "display_text": "✎ 𝖦𝗋𝗎𝗉𝗈 𝖮𝖿𝗂𝖼𝗂𝖺𝗅",
                  "url": "https://chat.whatsapp.com/FQ59hW6PzNkDlPjiD2Uk9K",
                  "merchant_url": "https://chat.whatsapp.com/FQ59hW6PzNkDlPjiD2Uk9K"
                })
              }
            ]
          },
          contextInfo: {
            mentionedJid: [userId],
            isForwarded: false
          }
        }
      }
    }
  }, { quoted: m })

  await conn.relayMessage(m.chat, msg.message, {})
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler