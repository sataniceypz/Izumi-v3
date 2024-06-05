function tConvert (time) {
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) {
    time = time.slice (1); 
    time[5] = +time[0] < 12 ? 'AM' : 'PM'; 
    time[0] = +time[0] % 12 || 12; 
  }
  return time.join (''); 
}
const { izumi, getJson  } = require('../lib/')
izumi(	{pattern: 'gitclone ?(.*)',		fromMe: true,	desc: 'git tepo details',		type: 'search' 	},async (message, match) => {
if (!match)
return await message.send('Eg:- .gitclone whatsapp bot md',{quoted: message.data});
 var result = (await getJson(`https://api.github.com/search/repositories?q=${match}`))
var id = result.items.map(mask => mask.id)
result.items = result.items.slice(0,10)
var items = result.items.map(mask => mask.name)
var fname = result.items.map(mask => mask.full_name)
var star = result.items.map(mask => mask.stargazers_count)
var owner = result.items.map(mask => mask.owner.login)
var private = result.items.map(mask => mask.private)
var url = result.items.map(mask => mask.owner.url)
var gurl = result.items.map(mask => mask.owner.gist_url)
var rurl = result.items.map(mask => mask.owner.repos_url)
var type = result.items.map(mask => mask.owner.type)
var link = result.items.map(mask => mask.html_url)
var desc = result.items.map(mask => mask.description)
var fork = result.items.map(mask => mask.forks_count)
var created = result.items.map(mask => mask.created_at)
var updated = result.items.map(mask => mask.updated_at)
var push = result.items.map(mask => mask.pushed_at)
var size = result.items.map(mask => mask.size)
var watch = result.items.map(mask => mask.watchers_count)
var laug = result.items.map(mask => mask.language)
var wiki = result.items.map(mask => mask.has_wiki)
var issue = result.items.map(mask => mask.has_issues)
var openissues = result.items.map(mask => mask.open_issues_count)
var page = result.items.map(mask => mask.has_pages)
var afork = result.items.map(mask => mask.allow_forking)
var licence = result.items.map(mask => mask.licence)
var branch = result.items.map(mask => mask.default_branch)
var score = result.items.map(mask => mask.score)
var msg = ''
for (i in items){
msg+=`
*${i}* :-
*📌LINK* : ${link[i]}
*🆔ID* : ${id[i]}
*🌻Repository*: ${items[i]}
*💌FULL NAME* : ${fname[i]}
*💌Owner* : ${owner[i]}
*🌟STARS* : ${star[i]}
*💥FORKS* : ${fork[i]}
*🗂️SIZE* : ${size[i]}
*💫SCORE* : ${score[i]}
*👀TOTAL WATCHING* : ${watch[i]}
*🔐PRIVATE* : ${private[i]}
*〽️LAUGUAGE* : ${laug[i]}
*©️LICENCE* : ${licence[i]}
*🧾ALLOW FORKING* : ${afork[i]}
*🌿DEFAULT BRANCH* : ${branch[i]}
*🧾WIKI* : ${wiki[i]}
*📃PAGE* : ${page[i]}
*📃ISSUE* : ${issue[i]}
*🧾OPEN ISSUES* : ${openissues[i]}
*❣️CREATED AT* : ${created[i].split('T')[0]} ${tConvert(created[i].split('T')[1].replace('Z',''))}
*📤UPDATED AT* : ${updated[i].split('T')[0]} ${tConvert(updated[i].split('T')[1].replace('Z',''))}
*🗳️PUSHED AT* : ${push[i].split('T')[0]} ${tConvert(push[i].split('T')[1].replace('Z',''))}
___________________________________\n`
}
await message.send(msg.replace(/undefined/g,'not available'))
});