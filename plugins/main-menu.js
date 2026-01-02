import fetch from 'node-fetch'
import { generateWAMessageFromContent, generateWAMessageContent, proto } from '@whiskeysockets/baileys' 

let handler = async (m, { conn, args }) => {
  let mentionedJid = await m.mentionedJid
  let userId = mentionedJid && mentionedJid[0] ? mentionedJid[0] : m.sender
  let totalreg = Object.keys(global.db.data.users).length
  let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

  const sections = [
    {
      title: '✐ ECONOMÍA',
      emoji: '✿',
      commands: [
        ['#w • .work • #trabajar', 'Ganar coins trabajando.'],
        ['#slut • #prostitución', 'Ganar coins prostituyéndote.'],
        ['#coinflip • #flip • #cf [cantidad]', 'Apostar coins en un cara o cruz.'],
        ['#crime • #crimen', 'Ganar coins rápido.'],
        ['#roulette • #rt [red/black]', 'Apostar coins en una ruleta.'],
        ['#casino • #apostar • #slot', 'Apuestas coins en el casino.'],
        ['#balance • #bal • #bank', 'Ver cuantos coins tienes en el banco.'],
        ['#deposit • #dep • #depositar', 'Depositar tus coins en el banco.'],
        ['#withdraw • #with • #retirar', 'Retirar tus coins del banco.'],
        ['#economyinfo • #einfo', 'Ver tu información de economía en el grupo.'],
        ['#givecoins • #pay • #coinsgive', 'Dar coins a un usuario.'],
        ['#miming • #minar • #mine', 'Realizar trabajos de minería y ganar coins.'],
        ['#daily • #diario', 'Reclamar tu recompensa diaria.'],
        ['#cofre • #coffer', 'Reclamar tu cofre diario.'],
        ['#weekly • #semanal', 'Reclamar tu recompensa semanal.'],
        ['#monthly • #mensual', 'Reclamar tu recompensa mensual.'],
        ['#steal • #robar • #rob', 'Intentar robar coins a un usuario.'],
        ['#economyboard • #eboard • #baltop', 'Ver el ranking de economía en el grupo.'],
        ['#aventura • #adventure', 'Aventuras para ganar coins y exp.'],
        ['#curar • #heal', 'Curar salud para salir de aventuras.'],
        ['#cazar • #hunt', 'Cazar animales para ganar coins y exp.'],
        ['#fish • #pescar', 'Ganar coins y exp pescando.'],
        ['#mazmorra • #dungeon', 'Explorar mazmorras para ganar coins y exp.']
      ]
    },
    {
      title: '✐ DESCARGAS',
      emoji: '✿',
      commands: [
        ['#tiktok • #tt [Link]', 'Descargar un video de TikTok.'],
        ['#wagroups • #wpgroups', 'Buscar grupos de WhatsApp.'],
        ['#mediafire • #mf', 'Descargar un archivo de MediaFire.'],
        ['#mega • #mg', 'Descargar un archivo de MEGA.'],
        ['#play • #ytmp3 • #ytmp4', 'Descargar una canción o vídeo de YouTube.'],
        ['#facebook • #fb', 'Descargar un video de Facebook.'],
        ['#twitter • #x', 'Descargar un video de Twitter/X.'],
        ['#ig • #instagram', 'Descargar un reel de Instagram.'],
        ['#pinterest • #pin', 'Buscar y descargar imágenes de Pinterest.'],
        ['#image • #imagen', 'Buscar y descargar imágenes de Google.'],
        ['#apk • #modapk', 'Descargar un apk de Aptoide.'],
        ['#ytsearch • #search', 'Buscar videos de YouTube.']
      ]
    },
    {
      title: '✐ GACHA',
      emoji: '✿',
      commands: [
        ['#buycharacter • #buychar', 'Comprar un personaje en venta.'],
        ['#charimage • #waifuimage', 'Ver una imagen aleatoria de un personaje.'],
        ['#charinfo • #winfo', 'Ver información de un personaje.'],
        ['#claim • #c • #reclamar', 'Reclamar un personaje.'],
        ['#delclaimmsg', 'Restablecer el mensaje al reclamar un personaje.'],
        ['#deletewaifu • #delwaifu', 'Eliminar un personaje reclamado.'],
        ['#favoritetop • #favtop', 'Ver el top de personajes favoritos.'],
        ['#gachainfo • #ginfo', 'Ver tu información de gacha.'],
        ['#giveallharem', 'Regalar todos tus personajes a otro usuario.'],
        ['#givechar • #givewaifu', 'Regalar un personaje a otro usuario.'],
        ['#robwaifu • #robarwaifu', 'Robar un personaje a otro usuario.'],
        ['#harem • #waifus • #claims', 'Ver tus personajes reclamados.'],
        ['#haremshop • #tiendawaifus', 'Ver los personajes en venta.'],
        ['#removesale • #removerventa', 'Eliminar un personaje en venta.'],
        ['#rollwaifu • #rw • #roll', 'Waifu o husbando aleatorio.'],
        ['#sell • #vender', 'Poner un personaje a la venta.'],
        ['#serieinfo • #ainfo', 'Información de un anime.'],
        ['#serielist • #slist', 'Listar series del bot.'],
        ['#setclaimmsg • #setclaim', 'Modificar el mensaje al reclamar un personaje.'],
        ['#trade • #intercambiar', 'Intercambiar un personaje con otro usuario.'],
        ['#vote • #votar', 'Votar por un personaje para subir su valor.'],
        ['#waifusboard • #wtop', 'Ver el top de personajes con mayor valor.']
      ]
    },
    {
      title: '✐ SOCKETS',
      emoji: '✿',
      commands: [
        ['#qr • #code', 'Crear un Sub-Bot con un código QR/Code.'],
        ['#setname • #setbanner', 'Personaliza el nombre/banner de tu Sub-Bot.'],
        ['#bots • #botlist', 'Ver el número de bots activos.'],
        ['#status • #estado', 'Ver estado del bot.'],
        ['#p • #ping', 'Medir tiempo de respuesta.'],
        ['#join', 'Unir al bot a un grupo.'],
        ['#leave • #salir', 'Salir de un grupo.'],
        ['#logout', 'Cerrar sesión del bot.'],
        ['#setpfp • #setimage', 'Cambiar la imagen de perfil.'],
        ['#setstatus', 'Cambiar el estado del bot.'],
        ['#setusername', 'Cambiar el nombre de usuario.']
      ]
    },
    {
      title: '✐ UTILIDADES',
      emoji: '✿',
      commands: [
        ['#help • #menu', 'Ver el menú de comandos.'],
        ['#sc • #script', 'Link del repositorio oficial del Bot.'],
        ['#sug • #suggest', 'Sugerir nuevas funciones al desarrollador.'],
        ['#reporte • #reportar', 'Reportar fallas o problemas del bot.'],
        ['#calcular • #cal', 'Calcular tipos de ecuaciones.'],
        ['#delmeta', 'Restablecer el pack y autor por defecto para tus stickers.'],
        ['#getpic • #pfp', 'Ver la foto de perfil de un usuario.'],
        ['#say', 'Repetir un mensaje.'],
        ['#setmeta', 'Establecer el pack y autor por defecto para tus stickers.'],
        ['#sticker • #s • #wm', 'Convertir una imagen/video a sticker.'],
        ['#toimg • #img', 'Convertir un sticker/imagen a imagen.'],
        ['#brat • #bratv • #qc', 'Crear stickers con texto.'],
        ['#gitclone', 'Descargar un repositorio de Github.'],
        ['#enhance • #remini • #hd', 'Mejorar calidad de una imagen.'],
        ['#letra • #style', 'Cambiar la fuente de las letras.'],
        ['#read • #readviewonce', 'Ver imágenes viewonce.'],
        ['#ss • #ssweb', 'Ver el estado de una página web.'],
        ['#translate • #traducir', 'Traducir palabras en otros idiomas.'],
        ['#ia • #gemini', 'Preguntar a Chatgpt.'],
        ['#iavoz • #aivoz', 'Hablar o preguntar a chatgpt mexicano modo voz.'],
        ['#tourl • #catbox', 'Convertidor de imagen/video en urls.'],
        ['#wiki • #wikipedia', 'Investigar temas a través de Wikipedia.'],
        ['#dalle • #flux', 'Crear imágenes con texto mediante IA.'],
        ['#npmdl • #npmjs', 'Descargar paquetes de NPMJS.'],
        ['#google', 'Realizar búsquedas por Google.']
      ]
    },
    {
      title: '✐ PERFILES',
      emoji: '✿',
      commands: [
        ['#leaderboard • #lboard • #top', 'Top de usuarios con más experiencia.'],
        ['#level • #lvl', 'Ver tu nivel y experiencia actual.'],
        ['#marry • #casarse', 'Casarte con alguien.'],
        ['#profile', 'Ver tu perfil.'],
        ['#setbirth', 'Establecer tu fecha de cumpleaños.'],
        ['#setdescription • #setdesc', 'Establecer tu descripción.'],
        ['#setgenre', 'Establecer tu género.'],
        ['#delgenre • #delgenero', 'Eliminar tu género.'],
        ['#delbirth', 'Borrar tu fecha de cumpleaños.'],
        ['#divorce', 'Divorciarte de tu pareja.'],
        ['#setfavourite • #setfav', 'Establecer tu claim favorito.'],
        ['#deldescription • #deldesc', 'Eliminar tu descripción.'],
        ['#prem • #vip', 'Comprar membresía premium.']
      ]
    },
    {
      title: '✐ GRUPOS',
      emoji: '✿',
      commands: [
        ['#tag • #hidetag • #invocar', 'Envía un mensaje mencionando a todos.'],
        ['#detect • #alertas', 'Activar/desactivar las alertas de promote/demote.'],
        ['#antilink • #antienlace', 'Activar/desactivar el antienlace.'],
        ['#bot', 'Activar/desactivar al bot.'],
        ['#close • #cerrar', 'Cerrar el grupo para solo administradores.'],
        ['#demote', 'Descender a un usuario de administrador.'],
        ['#economy', 'Activar/desactivar los comandos de economía.'],
        ['#gacha', 'Activar/desactivar los comandos de Gacha y Games.'],
        ['#welcome • #bienvenida', 'Activar/desactivar la bienvenida y despedida.'],
        ['#setbye', 'Establecer un mensaje de despedida personalizado.'],
        ['#setprimary', 'Establece un bot como primario del grupo.'],
        ['#setwelcome', 'Establecer un mensaje de bienvenida personalizado.'],
        ['#kick', 'Expulsar a un usuario del grupo.'],
        ['#nsfw', 'Activar/desactivar los comandos NSFW.'],
        ['#onlyadmin', 'Permitir que solo los administradores usen comandos.'],
        ['#open • #abrir', 'Abrir el grupo para que todos envíen mensajes.'],
        ['#promote', 'Ascender a un usuario a administrador.'],
        ['#add • #añadir • #agregar', 'Invita a un usuario a tu grupo.'],
        ['admins • admin', 'Mencionar a los admins para solicitar ayuda.'],
        ['#restablecer • #revoke', 'Restablecer enlace del grupo.'],
        ['#addwarn • #warn', 'Advertir a un usuario.'],
        ['#unwarn • #delwarn', 'Quitar advertencias de un usuario.'],
        ['#advlist • #listadv', 'Ver lista de usuarios advertidos.'],
        ['#inactivos • #kickinactivos', 'Ver y eliminar a usuarios inactivos.'],
        ['#listnum • #kicknum', 'Eliminar usuarios con prefijo de país.'],
        ['#gpbanner • #groupimg', 'Cambiar la imagen del grupo.'],
        ['#gpname • #groupname', 'Cambiar el nombre del grupo.'],
        ['#gpdesc • #groupdesc', 'Cambiar la descripción del grupo.'],
        ['#del • #delete', 'Eliminar un mensaje.'],
        ['#linea • #listonline', 'Ver lista de usuarios en línea.'],
        ['#gp • #infogrupo', 'Ver la información del grupo.'],
        ['#link', 'Ver enlace de invitación del grupo.']
      ]
    },
    {
      title: '✐ REACCIONES ANIME',
      emoji: '✿',
      commands: [
        ['#angry • #enojado', 'Estar enojado.'],
        ['#bath • #bañarse', 'Bañarse.'],
        ['#bite • #morder', 'Muerde a alguien.'],
        ['#bleh • #lengua', 'Sacar la lengua.'],
        ['#blush • #sonrojarse', 'Sonrojarte.'],
        ['#bored • #aburrido', 'Estar aburrido.'],
        ['#clap • #aplaudir', 'Aplaudir.'],
        ['#coffee • #cafe', 'Tomar café.'],
        ['#cry • #llorar', 'Llorar por algo o alguien.'],
        ['#cuddle • #acurrucarse', 'Acurrucarse.'],
        ['#dance • #bailar', 'Sácate los pasitos prohibidos.'],
        ['#dramatic • #drama', 'Drama.'],
        ['#drunk • #borracho', 'Estar borracho.'],
        ['#eat • #comer', 'Comer algo delicioso.'],
        ['#facepalm • #palmada', 'Darte una palmada en la cara.'],
        ['#happy • #feliz', 'Salta de felicidad.'],
        ['#hug • #abrazar', 'Dar un abrazo.'],
        ['#impregnate • #preg', 'Embarazar a alguien.'],
        ['#kill • #matar', 'Toma tu arma y mata a alguien.'],
        ['#kiss • #muak', 'Dar un beso.'],
        ['#kisscheek • #beso', 'Beso en la mejilla.'],
        ['#laugh • #reirse', 'Reírte de algo o alguien.'],
        ['#lick • #lamer', 'Lamer a alguien.'],
        ['#love • #amor', 'Sentirse enamorado.'],
        ['#pat • #palmadita', 'Acaricia a alguien.'],
        ['#poke • #picar', 'Picar a alguien.'],
        ['#pout • #pucheros', 'Hacer pucheros.'],
        ['#punch • #pegar', 'Dar un puñetazo.'],
        ['#run • #correr', 'Correr.'],
        ['#sad • #triste', 'Expresar tristeza.'],
        ['#scared • #asustado', 'Estar asustado.'],
        ['#seduce • #seducir', 'Seducir a alguien.'],
        ['#shy • #tímido', 'Sentir timidez.'],
        ['#slap • #bofetada', 'Dar una bofetada.'],
        ['#sleep • #dormir', 'Tumbarte a dormir.'],
        ['#smoke • #fumar', 'Fumar.'],
        ['#spit • #escupir', 'Escupir.'],
        ['#step • #pisar', 'Pisar a alguien.'],
        ['#think • #pensar', 'Pensar en algo.'],
        ['#walk • #caminar', 'Caminar.'],
        ['#wink • #guiñar', 'Guiñar el ojo.'],
        ['#cringe • #avergonzarse', 'Sentir vergüenza ajena.'],
        ['#smug • #presumir', 'Presumir con estilo.'],
        ['#smile • #sonreír', 'Sonreír con ternura.'],
        ['#highfive • #5', 'Chocar los cinco.'],
        ['#bully • #bullying', 'Molestar a alguien.'],
        ['#handhold • #mano', 'Tomarse de la mano.'],
        ['#wave • #ola • #hola', 'Saludar con la mano.'],
        ['#waifu', 'Buscar una waifu aleatoria.'],
        ['#ppcouple • #ppcp', 'Genera imágenes para amistades o parejas.']
      ]
    },
    {
      title: '✐ NSFW',
      emoji: '✿',
      commands: [
        ['#danbooru • #dbooru', 'Buscar imágenes en Danbooru.'],
        ['#gelbooru • #gbooru', 'Buscar imágenes en Gelbooru.'],
        ['#rule34 • #r34', 'Buscar imágenes en Rule34.'],
        ['#xvideos • #xvideosdl', 'Descargar un video Xvideos.'],
        ['#xnxx • #xnxxdl', 'Descargar un video Xnxx.']
      ]
    }
  ]

  const footer = `*꒷꒦︶꒷꒦︶꒷꒦︶꒷꒦︶꒷꒦︶꒷꒦*`

  let txt = `> ꕤ ¡Hola! @${userId.split('@')[0]}, Soy ${botname}, ${(conn.user.jid == global.conn.user.jid ? '𝗣𝗿𝗶𝗻𝗰𝗶𝗽𝗮𝗹' : '𝗦𝘂𝗯-𝗕𝗼𝘁')}

> _*Aquí tienes la lista de comandos.*_
╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
│❍ *Usuarios* » ${totalreg.toLocaleString()}
│❏*Versión* » ${vs}
│❀*Plugins* » ${totalCommands}
│★*Librería* » ${libreria}
╰ׅ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
`

  sections.forEach(section => {
    txt += `𐔌   .  ⋮ *${section.title}* .ᐟ  ֹ   ₊ ꒱
> ${section.emoji} Comandos de *${section.title.replace(/[🛍️📥🎮⚙️🛠️👤👥💕🔞]/g, '').trim()}*.
┃
`
    section.commands.forEach(([command, description]) => {
      txt += `┃ ✿ \`${command}\`
┃ › _${description}_
`
    })
    txt += `${footer}

`
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
          body: { text: "---------------------------------------------" },
          footer: { text: txt },
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