import fetch from 'node-fetch'
import { generateWAMessageFromContent, generateWAMessageContent, proto } from '@whiskeysockets/baileys' 

let handler = async (m, { conn, args }) => {
  let mentionedJid = await m.mentionedJid
  let userId = mentionedJid && mentionedJid[0] ? mentionedJid[0] : m.sender
  let totalreg = Object.keys(global.db.data.users).length
  let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

  const sections = [
    {
      title: "ECONOMÍA",
      commands: [
        [".crime", "Comando de crimen"],
        [".depositar", "Depositar dinero"],
        [".minar", "Minar recursos"],
        [".pay", "Pagar a alguien"],
        [".robar", "Robar a otros"],
        [".slut", "Trabajo de prostitución"],
        [".work", "Trabajar"]
      ]
    },
    {
      title: "DESCARGAS",
      commands: [
        [".apk", "Descargar APK"],
        [".playvideo", "Reproducir video"],
        [".mediafire", "Descargar de Mediafire"],
        [".tiktokvid", "Descargar video de TikTok"],
        [".tiktok", "Descargar TikTok"],
        [".play8", "Reproducir audio/video 8"],
        [".playaudio", "Reproducir audio"],
        [".ytmp4doc", "Descargar YouTube como MP4"],
        [".play4 <búsqueda>", "Buscar y reproducir"]
      ]
    },
    {
      title: "HERRAMIENTAS",
      commands: [
        [".its <text>", "Herramientas de texto"]
      ]
    }
  ]

  const footer = `*━━━━━━━━━━━━━━━━━━━━━━━━*`

  let txt = `*¡Hola! @${userId.split('@')[0]}* | *Soy ${botname}*\n`
  txt += `*${botname}* | ${(conn.user.jid == global.conn.user.jid ? 'Principal' : 'Sub-Bot')}\n`
  txt += `─•─•─•─•─•─•─•─•─•─•─\n\n`
  
  txt += `*INFORMACIÓN*\n`
  txt += `• *Usuarios*: ${totalreg.toLocaleString()}\n`
  txt += `• *Versión*: ${vs}\n`
  txt += `• *Comandos*: ${totalCommands}\n`
  txt += `• *Librería*: ${libreria}\n\n`
  
  txt += `*COMANDOS DISPONIBLES*\n`

  sections.forEach(section => {
    txt += `\n• *${section.title}*\n`
    section.commands.forEach(([command, description], index) => {
      txt += `  ${command}`
      if (description) {
        txt += ` - ${description}`
      }
      txt += `\n`
    })
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