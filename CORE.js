const Discord = require('discord.js');
const fs = require('fs');

let TheToken = process.env.BotToken


const { Client, Util } = require('discord.js');
const PREFIX = "노트야 "
const GOOGLE_API_KEY = "AIzaSyD5HkfjExwmv2HFDfS0zwAHdkrNNEmJcsw"
const YouTube = require('simple-youtube-api');
const superagent = require('superagent')
const client = new Discord.Client();
const ytdl = require('ytdl-core');

client.login(TheToken)

client.on('ready', () => {
  client.guilds.array().forEach((eachGuild) => {
    if (eachGuild.voiceConnection) {
      eachGuild.voiceConnection.channel.leave()
    }
})
console.log('준비됨!')
	client.user.setActivity(`'노트야 도움말' 해봐!`, {type: "PLAYING"});
});

const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('message', async msg => {
	if (!msg.content.startsWith('노트')) return undefined;
	const args = msg.content.split(' ');
	const searchString = args.slice(2).join(' ');
	const url = args[2] ? args[2].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);
        const searchString2 = args.slice(1).join(' ');
	const url2 = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';

        let pr = msg.content.replace('노트야 ', '')
	let command = pr.split(' ')[0];


        if (command === '도움' || command === '도움말' || msg.content.startsWith('노트도움')) {
		
		let help = new Discord.RichEmbed()
		.setTitle('노트봇 도움말')
		.addField('플레이', '노트플 / 노트야 플레이 / 노트야 불러줘')
		.addField('스킵', '노트닥 / 노트야 닥쳐 / 노트야 스킵')
		.addField('정지', '노트정 / 노트야 정지 / 노트야 초기화')
		.addField('볼륨', '노트볼 / 노트야 볼륨')
		.addField('재생목록', '노트큐 / 노트야 재생목록 / 노트야 뭐남음')
		.addField('음악 정보', '노트뭐 / 노트야 뭐임')
		.setColor('#00ff6c')
		.setFooter('버그 리포트는 Oasics#5074 로 DM ㄱㄱ')
		msg.channel.send(help)
		
	}
	if (command === '서버' || msg.content.startsWith('노트섭')) { msg.channel.send(`${client.guilds.size}`) }
        if (command === '공지') {
     let owners = process.env.owners
 let prefix = '노트야 공지'
 
    let filter = (reaction, user) => (reaction.emoji.name === '❌' || reaction.emoji.name === '⭕') && user.id === msg.author.id
    if (owners.includes(msg.author.id)) {
      let reason = msg.content.replace(`${prefix} `, '')
      let firstembed = new Discord.RichEmbed()
      .setTitle(`${client.guilds.size}개의 서버에 공지가 발신됩니다`)
      .addField(`공지의 내용은 다음과 같습니다`, `\`\`\`\n${reason}\n\`\`\``)
      .setColor(Math.floor(Math.random() * 16777214) + 1)
      .setFooter('Discord.Js Notice Bot by 오아시스 (iOas // Oasics#5074)')
      msg.channel.send(firstembed).then((th) => {
        th.react('❌')
        th.react('⭕')
        th.awaitReactions(filter, {
          max: 1
        }).then((collected) => {
          if (collected.array()[0].emoji.name === '⭕') {
		 let errors = ``
            client.guilds.forEach(g => {
              let reason = msg.content.replace(`${prefix} `, '')
              let gc
	       g.channels.forEach(c => {
                let cname = `${c.name}`
                if (cname.includes('공지') || cname.includes('notice') || cname.includes('알림') || cname.includes('announce')) {
                  if (!cname.includes('업로드') && !cname.includes('길드') && !cname.includes('벤') && !cname.includes('경고') && !cname.includes('guild') && !cname.includes('ban') && !cname.includes('warn') && !cname.includes('영상')) {
                    gc = `${c.id}`
                  }
                }
              })
              let ann = new Discord.RichEmbed()
                .setTitle(`노트봇 공지`)
                .setThumbnail(client.user.avatarURL)
                .setDescription(`${reason}`)
                .setColor(Math.floor(Math.random() * 16777214) + 1)
                .setFooter(`공지 발신자: ${msg.member.user.tag} - 인증됨`, msg.author.avatarURL)
                .setTimestamp()
              let Ch = client.channels.get(gc)
              let ment
              try {
                if (!Ch.permissionsFor(g.me).has(`SEND_MESSAGES`)) {
                  ment = `${g.name}: 발신 실패 (메시지 발신 권한 없음)\n`
                } else { Ch.send(ann) }
              } catch (e) {
                if (!g.me.hasPermission("MANAGE_CHANNELS")) {
                ment = `${g.name}: 발신 실패 (채널 생성 권한 없음)\n`
                } else {
                ment = `${g.name}: 채널 자동 생성 및 발신 성공\n`
                g.createChannel(`공지-자동생성됨`).then(channel => {
                  channel.send(ann)
                })
              }
              } finally {
                if (ment) { errors += ment }
              }
            })
            if (errors === ``) { errors = '성공적으로 모든 서버에 발신되었습니다!' }
            let finalembed = new Discord.RichEmbed()
            .setTitle('발신이 완료되었습니다!')
            .addField('결과:', `\`\`\`\n${errors}\n \`\`\``)
            .setColor(Math.floor(Math.random() * 16777214) + 1)
            .setFooter('Discord.Js Notice Bot by 오아시스 (iOas // Oasics#5074)')
            th.edit(finalembed)
          } else {
            let cemb = new Discord.RichEmbed()
            .setTitle('공지 발신이 취소되었습니다')
            .setColor(Math.floor(Math.random() * 16777214) + 1)
            .setFooter('Discord.Js Notice Bot by 오아시스 (iOas // Oasics#5074)')
            th.edit(cemb)
          }
        })
      })
    } else {
	 msg.channel.send('당신은 봇 관리자로 등록되어있지 않습니다.')
}
        }
	if (command === '채널설정') {
		if (searchString === '공지') {
			superagent.get("http://api.myjson.com/bins/6zrt0").then((res) => {
                        let welcomechannel = res.body;
				
				  if(!welcomechannel[msg.guild.id]){
                                    welcomechannel[msg.guild.id] = {
                                        welcomechannel: 0
                                    };
                                   }
                        let msguild = welcomechannel[msg.guild.id].welcomechannel		
                  if (msguild === 0) {
		     let chaid = msg.channel.id
                      welcomechannel[msg.guild.id] = {
                         welcomechannel: chaid
                      };
                     msg.channel.send('공지 채널이 설정되었습니다.')
                   } else if (msguild > 0) {
	                let chaid = msg.channel.id
                        welcomechannel[msg.guild.id] = {
                               welcomechannel: 0
                         };
	
	msg.channel.send("공지 채널이 초기화되었습니다")
	
          }
            superagent.put("http://api.myjson.com/bins/6zrt0").send(welcomechannel).catch((err) => console.log(err));
			});
		}
	}
	if (command === '불러줘' || command === '플레이') {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send(`${msg.author.username} 이 음성채널에 없습니다. \n음성채널에 들어간다음 다시 시도해 보세요.`);
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('그곳에 들어갈수 있는 권한이 없어요..\n서버 설정에 역할에 들어가서 노트봇이 관리자 권한을 가지고 있는지 확인해주세요.');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('말하기 권한이 없어;;');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, msg, voiceChannel, true);
			}
      ytdl.getBasicInfo(playlist.url, (err1, info) => {
       let vedl = `${info.length_seconds / 60}`
	       vedl = vedl.split('.')
	       vedl = `${vedl[0]}` + `:` + `${info.length_seconds % 60}`
			return msg.channel.send(`✅ **${playlist.title}** 가 재생목록에 추가되었습니다! ( ${vedl} )`);
    });
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 5);
					let index = 0;
					msg.channel.send(`
__**검색결과:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
1 - 5 를 입력하여 선택하시면 됩니다. (20초가 지나면 시간초과로 취소됩니다)
					`).then((th) => th.delete(20000));
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 20000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('시간초과 ㅅㄱ');

					}

					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('🆘 음? 검색이 안됨..');
				}
			}
			return handleVideo(video, msg, voiceChannel);


		}
	} else if (msg.content.startsWith('노트플')) {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send(`${msg.author.username} 이 음성채널에 없습니다. \n음성채널에 들어간다음 다시 시도해 보세요.`);
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('그곳에 들어갈수 있는 권한이 없어요..\n서버 설정에 역할에 들어가서 노트봇이 관리자 권한을 가지고 있는지 확인해주세요.');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('말하기 권한이 없어;;');
		}

		if (url2.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url2);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
	     ytdl.getBasicInfo(playlist.url, (err1, info) => {
	       let vedl = `${info.length_seconds / 60}`
	       vedl = vedl.split('.')
	       vedl = `${vedl[0]}` + `:` + `${info.length_seconds % 60}`
			return msg.channel.send(`✅ **${playlist.title}** 가 재생목록에 추가되었습니다! ( ${vedl} )`);
	     });
		} else {
			try {
				var video = await youtube.getVideo(url2);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString2, 5);
					let index = 0;
					msg.channel.send(`
__**검색결과:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
1 - 5 를 입력하여 선택하시면 됩니다. (20초가 지나면 시간초과로 취소됩니다)
					`).then((th) => th.delete(20000));
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 20000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('시간초과 ㅅㄱ');

					}

					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('🆘 음? 검색이 안됨..');
				}
			}
			return handleVideo(video, msg, voiceChannel);


		}
	} else if (command === '그만불러' || command === '스킵' || command === '닥쳐' || msg.content.startsWith('노트닥')) {
		if (!msg.member.voiceChannel) return msg.channel.send('넌 내 노래를 듣고있지도 않은데 뭘 스킵이야');
		if (!serverQueue) return msg.channel.send('스킵할 노래가 없음;;');
		serverQueue.connection.dispatcher.end('쳇..');
		msg.channel.send("알겠어 그만부를게..");
		return undefined;
	} else if (command === '정지' || command === '멈춰' || command === '초기화' || msg.content.startsWith('노트정')) {
		if (!msg.member.voiceChannel) return msg.channel.send('먼저 음성 채널에 들어가시죠');
		if (!serverQueue) return msg.channel.send('님한테 멈춰줄 노래가 없네요 ㅅㄱ');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('초기화됨!');
		msg.channel.send("음악을 멈추고 재생목록을 초기화했어 ㅂㅇ");
		return undefined;
	} else if (command === '볼륨') {
		if (!msg.member.voiceChannel) return msg.channel.send('음성 채널에 먼저 들어와!');
		if (!serverQueue) return msg.channel.send('부르고 있는 노래가 없어;;');
		if (!args[2]) return msg.channel.send(`현재 볼륨: **${serverQueue.volume * 100}**`);
		let voll = parseInt(args[2]) / 100;
		serverQueue.volume = voll;
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[2] / 100);
		return msg.channel.send(`볼륨 변경 완료! : **${args[2]}**`);
	} else if (msg.content.startsWith('노트볼')) {
		if (!msg.member.voiceChannel) return msg.channel.send('음성 채널에 먼저 들어와!');
		if (!serverQueue) return msg.channel.send('부르고 있는 노래가 없어;;');
		if (!args[1]) return msg.channel.send(`현재 볼륨: **${serverQueue.volume * 100}**`);
		let voll = parseInt(args[1]) / 100;
		serverQueue.volume = voll;
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 100);
		return msg.channel.send(`볼륨 변경 완료! : **${args[1]}**`);
	} else if (command === '뭐부르고있음' || command === '지금' || command === '뭐임' || msg.content.startsWith('노트뭐')) {
		if (!serverQueue) return msg.channel.send('아무것도 안부름');
		ytdl.getBasicInfo(serverQueue.songs[0].url, (err1, info) => {
	       let vedl = `${info.length_seconds / 60}`
	       vedl = vedl.split('.')
	       vedl = `${vedl[0]}` + `:` + `${info.length_seconds % 60}`
		return msg.channel.send(`🎶 지금 부르는거: **${serverQueue.songs[0].title}** ( ${vedl} )`);
		});
	} else if (command === '재생목록' || command === '뭐남음' || msg.content.startsWith('노트큐')) {
		if (!serverQueue) return msg.channel.send('아무것도 안남음');
		return msg.channel.send(`
__**재생목록:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
__**지금 부르는거:**__ ${serverQueue.songs[0].title}
		`);
	} else if (command === '일시정지' || command === '잠만') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ 일시정지됨!');
		}
		return msg.channel.send('잠깐 멈춰줄 노래가 없음');
	} else if (command === '다시불러') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ ㅇㅋ 다시부름!');
		}
		return msg.channel.send('다시부를게 없네');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 0.5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`채널에 들어갈수 없음: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`채널에 들어갈수 없음: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist)  { return undefined;
			       } else {
		ytdl.getBasicInfo(song.url, (err1, info) => {
	       let vedl = `${info.length_seconds / 60}`
	       vedl = vedl.split('.')
	       vedl = `${vedl[0]}` + `:` + `${info.length_seconds % 60}`
		return msg.channel.send(`✅ **${song.title}** 가 재생목록에 추가되었습니다! ( ${vedl} )`);

});
	}
}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume);
	      ytdl.getBasicInfo(song.url, (err1, info) => {
	       let vedl = `${info.length_seconds / 60}`
	       vedl = vedl.split('.')
	       vedl = `${vedl[0]}` + `:` + `${info.length_seconds % 60}`

	serverQueue.textChannel.send(`🎶  **${song.title}** (${vedl}) 들려줄게`);
	      });
}
