import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

async function uploadToFreeImageHost(buffer) {
  try {
    const form = new FormData()
    form.append('source', buffer, 'file')
    const res = await axios.post('https://freeimage.host/api/1/upload', form, {
      params: {
        key: '6d207e02198a847aa98d0a2a901485a5'
      },
      headers: form.getHeaders()
    })
    return res.data.image.url
  } catch (err) {
    console.error('Error FreeImageHost:', err?.response?.data || err.message)
    return null
  }
}

const handler = async (m, { conn, command, text, usedPrefix }) => {
  const senderNumber = m.sender.replace(/[^0-9]/g, '')
  const botPath = path.join('./Sessions/SubBot', senderNumber)
  const configPath = path.join(botPath, 'config.json')

  if (!fs.existsSync(botPath)) {
    return m.reply(`✿ *Acceso denegado.*\n\n✎ *Este comando es exclusivo para usuarios con SubBots activos.*`)
  }

  let config = {}
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath))
    } catch (e) {
      config = {}
    }
  }

  try {
    if (command === 'setname') {
      if (!text) return m.reply(`✿ *Configuración de Nombre.*\n\n✎ *Uso correcto:* ${usedPrefix + command} Nuevo Nombre\n↺ *Ejemplo:* ${usedPrefix + command} MiBot Pro`)
      
      config.name = text.trim()
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

      return m.reply(`✿ *Nombre actualizado correctamente.*\n\n✎ *Nuevo nombre:* ${text.trim()}\n↺ *El cambio se reflejará inmediatamente.*`)
    }

    if (command === 'setbanner') {
      const q = m.quoted || m
      const mime = (q.msg || q).mimetype || q.mediaType || ''

      if (!mime || !/image\/(jpe?g|png|webp)/.test(mime)) {
        return m.reply(`✿ *Configuración de Banner.*\n\n✎ *Por favor, responde a una imagen con:* ${usedPrefix + command}\n↺ *Formatos aceptados:* JPG, PNG, WEBP.`)
      }

      await conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } })

      const media = await q.download()
      if (!media) throw new Error('No se pudo descargar la imagen.')

      const uploadedUrl = await uploadToFreeImageHost(media)
      if (!uploadedUrl) throw new Error('Error al subir la imagen a FreeImageHost.')

      config.banner = uploadedUrl
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      
      return m.reply(`✿ *Banner actualizado correctamente.*\n\n✎ *Imagen vinculada:* ${uploadedUrl}\n↺ *Tu bot ahora mostrará esta imagen.*`)
    }

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { react: { text: '✖️', key: m.key } })
    return m.reply(`✿ *Ocurrió un error.*\n\n✎ *Detalle:* No se pudo guardar la configuración.\n↺ *Inténtalo de nuevo más tarde.*`)
  }
}

handler.help = ['setname', 'setbanner']
handler.tags = ['serbot']
handler.command = ['setname', 'setbanner']

export default handler