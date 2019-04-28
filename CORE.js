const Discord = require('discord.js');
const fs = require('fs');





const ytkey = "AIzaSyD5HkfjExwmv2HFDfS0zwAHdkrNNEmJcsw"
const ytsc = require('youtube-search');
const ytdl = require('ytdl-core');

const app = new Discord.Client();

let song = []
let timeCounter = []
let timeCycle = []

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


app.on('message', async message => {
	let Prefix = "~"
	 let messageArray = message.content.split(" ");
	 let cmd = messageArray[0];
	 let args = messageArray.slice(1);
	let msg = message.content.slice(Prefix.length);
	
	if(msg === "플레이" || msg === "불러줘") {
		
		if(!message.member.voiceChannel) return message.channel.send('음성 채널에 들어가셔야 합니다')
	        if(message.guild.me.voiceChannel) return message.channel.send('지금 다른곳에서 노래부르고있음')
		
		
		let search = message.content.replace(`~${msg}`, "")
	        if(!search) return message.channel.send('검색할 음악이나 유튜브 URL 을 입력해주세요')
		
		let validate = await ytdl.validateURL(search);
		
		if(!validate) {
		
        ytch(search, {
          maxResults: 5,
          key: ytkey,
          type: 'video'
        }, (err, results) => {
          if (err) {
            console.log('에러발생!\n' + err)
          } else {
		  
		  message.channel.send(`
1. ${results[0].title}
2. ${results[1].title}
3. ${results[2].title}
4. ${results[3].title}
5. ${results[4].title}

1 - 5 중 하나를 입력하세요.

`)
		  let userid = message.author.id
		  const filter = (m) => m.author.id === userid && m.content === "1" || m.content === "2" || m.content === "3" || m.content === "4" || m.content === "5"


message.channel.awaitMessages(filter, {
		max: 1
}).then((collected) => {	
	let co = collected.first().content;
	if (co === "1") {
		song[msg.channel.id] = msg.guild.voiceConnection.playStream(ytdl(results[0].link, { audioonly: true }), { volume: 0.5 })
	message.channel.send(`${results[0].title} 이(가) 플레이됩니다!`)
	} else if (co === "2") {
				song[msg.channel.id] = msg.guild.voiceConnection.playStream(ytdl(results[1].link, { audioonly: true }), { volume: 0.5 })
	message.channel.send(`${results[1].title} 이(가) 플레이됩니다!`)
		
	} else if (co === "3") {
		
				song[msg.channel.id] = msg.guild.voiceConnection.playStream(ytdl(results[2].link, { audioonly: true }), { volume: 0.5 })
	message.channel.send(`${results[2].title} 이(가) 플레이됩니다!`)
		
	} else if (co === "4") {
				song[msg.channel.id] = msg.guild.voiceConnection.playStream(ytdl(results[3].link, { audioonly: true }), { volume: 0.5 })
	message.channel.send(`${results[3].title} 이(가) 플레이됩니다!`)
		
	} else if (co === "5") {
				song[msg.channel.id] = msg.guild.voiceConnection.playStream(ytdl(results[4].link, { audioonly: true }), { volume: 0.5 })
	message.channel.send(`${results[4].title} 이(가) 플레이됩니다!`)
		
		
	}
		
	});
	  });
	
	
		  

              

		} else {
			song[message.channel.id] = msg.guild.voiceConnection.playStream(ytdl(search, { filter : audioonly }));
			
			message.channel.send(`${search} 이(가) 플레이됩니다!`)
		
		}
	} 
	if (msg === "그만불러" || msg === "닥쳐" || msg === "스킵"){
		return
	}
	
});
