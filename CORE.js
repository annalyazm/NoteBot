const Discord = require('discord.js');
const fs = require('fs');

let TheToken = process.env.BotToken




const ytkey = "AIzaSyD5HkfjExwmv2HFDfS0zwAHdkrNNEmJcsw"
const ytsc = require('yt-search');
const ytdl = require('ytdl-core');

const app = new Discord.Client();

let song = []
let timeCounter = []
let timeCycle = []

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
		
		ytch(search, function(err, res) {
			let videos = res.videos.slice(0, 10)
			let resp = '';
			for (var i in videos) {
				resp += `[${parseInt(i)+1}] : \`${videos[i].title}\`\n`;
			}
			resp += `\n 1 - ${videos.length} 에서 하나 고르시면 됩니다`
		message.channel.send(resp)
			const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;
			const collector = message.channel.createMessageCollector(filter);
			
			collector.videos = videos;
			
			collector.once('collect', function(m) {
		        let searchthing = videos.[parseInt(m.content)-1.url]
				
			let info = await ytdl.getinfo(searchthing);
			let connection = await message.member.voiceChannel.join();
			let dispacher = await connection.playStream(ytdl(searchthing, { filter : audioonly }));
			
			message.channel.send(`${info.title} 이(가) 플레이됩니다!`)
			
			})
		});
		} else {
			let info = await ytdl.getinfo(search);
			let connection = await message.member.voiceChannel.join();
			let dispacher = await connection.playStream(ytdl(search, { filter : audioonly }));
			
			message.channel.send(`${info.title} 이(가) 플레이됩니다!`)
		
		}
	} else if (msg === "그만불러" || msg === "닥쳐" || msg === "스킵"){
		return
	}
	
});
