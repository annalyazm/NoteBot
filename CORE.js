const Discord = require('discord.js');
const app = new Discord.Client();
const fs = require('fs');
const ytdl = require('ytdl-core');
const ytsearch = require('youtube-search');

let TheToken = process.env.BotToken
app.login(TheToken)

app.on('ready', () => {
  app.guilds.array().forEach((eachGuild) => {
    if (eachGuild.voiceConnection) {
      eachGuild.voiceConnection.channel.leave()
    }
})
console.log('oKtHiSrEaDyLeTsDoThIsYaYhErOkUcAnHoStMuZiCbOt')
});

app.on('message', (message) => {
  let search = message.content.slice(process.env.mupf.length)
  if ((search === '그만불러' || search === '닥쳐') && message.content.startsWith(process.env.mupf) && song[message.channel.id]) {
    song[message.channel.id].end()
    message.channel.send('쳇... ')
  } else if ((search === '잠만뭠춰봐' || search === '잠만') && message.content.startsWith(process.env.mupf) && song[message.channel.id]) {
    song[message.channel.id].pause()
    message.channel.send('뮤? 일단 뭠췄다뮤! 다시 키려면 `mz!다시불러`, 다른 노래로 바꾸고 싶다면 `mz!그만불러`를 사용하라뮤!')
  } else if ((search === '계속불러' || search === '플레이') && message.content.startsWith(process.env.mupf) && song[message.channel.id]) {
    song[message.channel.id].resume()
    message.channel.send('뮤봇이 계속 불러준다뮤~')
  } else if (search && message.content.startsWith(process.env.mupf) && !song[message.channel.id]) {
    if (message.member.voiceChannel) {
      if (!message.guild.voiceConnection) {
        message.member.voiceChannel.join()
      }
      message.channel.send('검색중... ' + search).then((th) => {
        ytch(search, {
          maxResults: 1,
          key: ytToken,
          type: 'video'
        }, (err, results) => {
          if (err) {
            th.edit('에러발생!\n' + err)
          } else {
            ytdl.getBasicInfo(results[0].link, (err1, info) => {
              if (err1) th.edit('에러발생!\n' + err1)

              song[msg.channel.id] = msg.guild.voiceConnection.playStream(ytdl(results[0].link, { audioonly: true }), { volume: 0.5 })

              let songEmb = new discord.RichEmbed()
                .setAuthor(msg.author.username + '님이 뮤봇의 노래를 듣고있습니다', msg.author.displayAvatarURL)
                .setTitle(results[0].title)
                .setDescription(results[0].description)
                .addField('영상 길이', Math.floor(parseInt(info.length_seconds) / 60) + ':' + parseInt(info.length_seconds) % 60, true)
                .addField('플레이 시간', 0, true)
                .setThumbnail(results[0].thumbnails.default.url)
                .setColor(randomHexColor())
                .setFooter('유튜브 서비스 상태의 따라 재생속도가 느리거나 음질이 좋지 않을 수 있습니다')
              th.edit(songEmb)
              msg.channel.send('컨트롤러: ``mz!그만불러`` | ``mz!잠만뭠춰봐`` | ``mz!계속불러``')

              timeCounter[msg.channel.id] = 0
              timeCycle[msg.channel.id] = setInterval(() => {
                timeCounter[msg.channel.id]++
                songEmb.fields[1].value = Math.floor(timeCounter[msg.channel.id] / 60) + ':' + timeCounter[msg.channel.id] % 60 + ' (**-' + (parseInt(info.length_seconds) - timeCounter[msg.channel.id]) + '초**)'
                songEmb.setThumbnail(null)
                th.edit(songEmb)
              }, 1000)
              song[msg.channel.id].on('end', () => {
                let songEndEmb = new discord.RichEmbed()
                  .setAuthor(msg.author.username + '님이 뮤봇의 노래를 듣고있*었*습니다', msg.author.displayAvatarURL)
                  .setTitle(results[0].title)
                  .setDescription(results[0].description)
                  .setThumbnail(results[0].thumbnails.default.url)
                  .setColor('#ff0000')
                  .setFooter('유튜브 서비스 상태의 따라 재생속도가 느리거나 음질이 좋지 않을 수 있*었*습니다')
                clearTimeout(timeCycle[msg.channel.id])
                timeCycle[msg.channel.id] = null
                song[msg.channel.id] = null
                msg.member.voiceChannel.leave()
                th.edit(songEndEmb)
              })
            })
          }
        })
      })
    } else {
      msg.channel.send('음성채팅방에 ' + msg.author.username + '가 없다뮤! 아무때나 들어가서 다시 부르라뮤!')
    }
  } else if (msg.content.startsWith(process.env.mupf) && song[msg.channel.id]) {
    msg.channel.send('이미 재생중인 노래가 있다뮤! `mz!그만불러`를 사용하라뮤!')
  }
})
