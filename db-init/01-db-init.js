db.createUser({
  user: "cass",
  pwd: "hunter2",
  roles: [
    {
      role: "readWrite",
      db: "cass",
    },
  ],
});

db.courses.insertMany([{
  "_id": {
    "$oid": "5eddd2a57f5e324690576601"
  },
  "subject": "CS",
  "number": 160,
  "title": "Intro To Comp Sci",
  "term": "sp19",
  "instructorId": {
    "$oid": "5ee024d213e6b43630db79ff"
  },
  "students":[{"$oid":"5ee024d213e6b43630db799b"},{"$oid":"5ee024d213e6b43630db799c"}],
  "assignments":[]
},{
  "_id": {
    "$oid": "5eddd2a57f5e324690576602"
  },
  "subject": "CS",
  "number": 161,
  "title": "Intro To Comp Sci I",
  "term": "sp19",
  "instructorId": {
    "$oid": "5ee024d213e6b43630db79ff"
  },"students":[],
  "assignments":[]
},{
  "_id": {
    "$oid": "5eddd2a57f5e324690576603"
  },
  "subject": "CS",
  "number": 162,
  "title": "Intro To Comp Sci II",
  "term": "sp19",
  "instructorId": {
    "$oid": "5ee024d213e6b43630db79ff"
  },"students":[],
  "assignments":[]
},{
  "_id": {
    "$oid": "5eddd2a57f5e324690576604"
  },
  "subject": "CS",
  "number": 261,
  "title": "Data Structures",
  "term": "sp19",
  "instructorId": {
    "$oid": "5ee024d213e6b43630db7a00"
  },"students":[],
  "assignments":[]
},{
  "_id": {
    "$oid": "5eddd2a57f5e324690576605"
  },
  "subject": "CS",
  "number": 271,
  "title": "Computer Architecture and Assembly Language",
  "term": "sp19",
  "instructorId": {
    "$oid": "5ee024d213e6b43630db7a01"
  },"students":[],
  "assignments":[]
},{
  "_id": {
    "$oid": "5eddd2a57f5e324690576606"
  },
  "subject": "CS",
  "number": 290,
  "title": "Web Development",
  "term": "sp19",
  "instructorId": {
    "$oid": "5ee024d213e6b43630db7a00"
  },"students":[],
  "assignments":[]
},{
  "_id": {
    "$oid": "5eddd2a57f5e324690576607"
  },
  "subject": "CS",
  "number": 325,
  "title": "Analysis of Algorithms",
  "term": "sp19",
  "instructorId": {
    "$oid": "5ee024d213e6b43630db7a02"
  },"students":[],
  "assignments":[]
},{
  "_id": {
    "$oid": "5eddd2a57f5e324690576608"
  },
  "subject": "CS",
  "number": 344,
  "title": "Operating Systems I",
  "term": "sp19",
  "instructorId": {
    "$oid": "5ee024d213e6b43630db7a03"
  },"students":[],
  "assignments":[]
},{
  "_id": {
    "$oid": "5eddd2a57f5e324690576609"
  },
  "subject": "CS",
  "number": 372,
  "title": "Computer Networks",
  "term": "sp19",
  "instructorId": {
    "$oid": "5ee024d213e6b43630db7a01"
  },"students":[],
  "assignments":[]
},{
  "_id": {
    "$oid": "5eddd2a57f5e32469057660a"
  },
  "subject": "CS",
  "number": 444,
  "title": "Operating Systems II",
  "term": "sp19",
  "instructorId": {
    "$oid": "5ee024d213e6b43630db7a04"
  },"students":[],
  "assignments":[]
},{
  "_id": {
    "$oid": "5eddd2a57f5e32469057660b"
  },
  "subject": "CS",
  "number": 475,
  "title": "Intro To Parallel Programming",
  "term": "sp19",
  "instructorId": {
    "$oid": "5ee024d213e6b43630db7a05"
  },"students":[],
  "assignments":[]
},{
  "_id": {
    "$oid": "5eddd2a57f5e32469057660c"
  },
  "subject": "CS",
  "number": 492,
  "title": "Mobile Application Development",
  "term": "sp19",
  "instructorId": {
    "$oid": "5ee024d213e6b43630db7a00"
  },"students":[],
  "assignments":[]
},{
  "_id": {
    "$oid": "5eddd2a57f5e32469057660d"
  },
  "subject": "CS",
  "number": 493,
  "title": "Cloud Application Development",
  "term": "sp19",
  "instructorId": {
    "$oid": "5ee024d213e6b43630db7a04"
  },"students":[],
  "assignments":[]
}]);

db.users.insertMany([{"name":"Kara Furminger","email":"kfurminger0@weather.com","password":"iyIt53VLenl","role":"student"},
{"name":"Dunn Dunbobbin","email":"ddunbobbin1@hexun.com","password":"wycnzz4kFJv","role":"student"},
{"name":"Josefina Truin","email":"jtruin2@accuweather.com","password":"ByifFMfdoSv","role":"student"},
{"name":"Ailis Huegett","email":"ahuegett3@sogou.com","password":"hXcQgkRmHSVD","role":"student"},
{"name":"Dedie Howship","email":"dhowship4@eepurl.com","password":"YqKYL3rvr","role":"student"},
{"name":"Martelle Peddar","email":"mpeddar5@usgs.gov","password":"zBG8Blkc5","role":"student"},
{"name":"Ellyn Pilipyak","email":"epilipyak6@t-online.de","password":"rQwlV0Wm9","role":"student"},
{"name":"Bendicty Thridgould","email":"bthridgould7@time.com","password":"Rn03DTj2o2A","role":"student"},
{"name":"Mario Portsmouth","email":"mportsmouth8@marriott.com","password":"Kgkq2tx1j","role":"student"},
{"name":"Alleen Ranklin","email":"aranklin9@hp.com","password":"TELvKys","role":"student"},
{"name":"Lusa Colleford","email":"lcolleforda@e-recht24.de","password":"c2rMQ2LjD","role":"student"},
{"name":"Colver Jovicevic","email":"cjovicevicb@dmoz.org","password":"wavEodk","role":"student"},
{"name":"Marshall Baudacci","email":"mbaudaccic@sciencedirect.com","password":"yVkaaGC","role":"student"},
{"name":"Mickie Mayow","email":"mmayowd@loc.gov","password":"1g0Nhanm","role":"student"},
{"name":"Bevan Imos","email":"bimose@umich.edu","password":"0dioFS3wBc","role":"student"},
{"name":"Alexia Jonczyk","email":"ajonczykf@psu.edu","password":"vSqNek4DpeCd","role":"student"},
{"name":"Angelia Climance","email":"aclimanceg@dyndns.org","password":"GkxemN7U8u","role":"student"},
{"name":"Joyce O' Donohue","email":"joh@google.fr","password":"fiU5yE","role":"student"},
{"name":"Rodrigo Baldacco","email":"rbaldaccoi@woothemes.com","password":"yprcaIEBAZ8","role":"student"},
{"name":"Stanly Crease","email":"screasej@hugedomains.com","password":"pbwtqQoSV","role":"student"},
{"name":"Mari Silver","email":"msilverk@bing.com","password":"YHhD0mTf05","role":"student"},
{"name":"Amata Vivyan","email":"avivyanl@nhs.uk","password":"AE96dLQ","role":"student"},
{"name":"Una Cauley","email":"ucauleym@tinyurl.com","password":"tO0QecQvC","role":"student"},
{"name":"Kellina D'Alesco","email":"kdalescon@shutterfly.com","password":"A1nGJpdeJ","role":"student"},
{"name":"Levin Dumsday","email":"ldumsdayo@vinaora.com","password":"0CzNxKkK7xRO","role":"student"},
{"name":"Laurice Rainbird","email":"lrainbirdp@ibm.com","password":"pLxbOH","role":"student"},
{"name":"Bonni Beeble","email":"bbeebleq@shinystat.com","password":"BTy7EVFYopcq","role":"student"},
{"name":"Joaquin Stiffkins","email":"jstiffkinsr@princeton.edu","password":"1wwc9yr","role":"student"},
{"name":"Timoteo Ladson","email":"tladsons@mit.edu","password":"KAy4jkZod","role":"student"},
{"name":"Davidson Bille","email":"dbillet@marriott.com","password":"3Lefov","role":"student"},
{"name":"Bryan Neville","email":"bnevilleu@hao123.com","password":"qikg4C5f","role":"student"},
{"name":"Sula Flaonier","email":"sflaonierv@census.gov","password":"ceAkjAo3xi","role":"student"},
{"name":"Antonetta Carluccio","email":"acarlucciow@reddit.com","password":"g7MxSmCc","role":"student"},
{"name":"Shelba MacGaffey","email":"smacgaffeyx@blogger.com","password":"1zdi0bSG","role":"student"},
{"name":"Hamlin Yokley","email":"hyokleyy@last.fm","password":"LYfVoKhNm64l","role":"student"},
{"name":"Ludovika Gunther","email":"lguntherz@businesswire.com","password":"ZwWrkGnPaZ","role":"student"},
{"name":"Andriana Gallier","email":"agallier10@theguardian.com","password":"vrrppTcnj8u","role":"student"},
{"name":"Finlay Marczyk","email":"fmarczyk11@jimdo.com","password":"WOey1LHZQN","role":"student"},
{"name":"Rosemarie Kiessel","email":"rkiessel12@yandex.ru","password":"OflXZo0","role":"student"},
{"name":"Ernst Ilson","email":"eilson13@apache.org","password":"Eehhf8bKqDB2","role":"student"},
{"name":"Ezekiel Goulden","email":"egoulden14@cbc.ca","password":"P8NVajqT","role":"student"},
{"name":"Lindy Minerdo","email":"lminerdo15@time.com","password":"aLod43","role":"student"},
{"name":"Sherm Scrimgeour","email":"sscrimgeour16@360.cn","password":"2m4HJKzbBc","role":"student"},
{"name":"Emilia Huleatt","email":"ehuleatt17@un.org","password":"EPpcyiKEJrC","role":"student"},
{"name":"Velma McGeady","email":"vmcgeady18@arizona.edu","password":"5VWAmeElUtw","role":"student"},
{"name":"Andra Cawsey","email":"acawsey19@stumbleupon.com","password":"dkbjvGvZ9S7Z","role":"student"},
{"name":"Ulrike Cartmale","email":"ucartmale1a@whitehouse.gov","password":"WOLeRPhQAdX0","role":"student"},
{"name":"Bogart Maddick","email":"bmaddick1b@friendfeed.com","password":"oCPZgTahQJu","role":"student"},
{"name":"Raine Pirson","email":"rpirson1c@flickr.com","password":"Wuck1NgvJO","role":"student"},
{"name":"Miran Arkow","email":"markow1d@nytimes.com","password":"Y56Jf4","role":"student"},
{"name":"Suzy Annable","email":"sannable1e@dyndns.org","password":"k7dyVngei2p","role":"student"},
{"name":"Sydel Hebner","email":"shebner1f@moonfruit.com","password":"l8DJk2tG","role":"student"},
{"name":"Wynn Middlemist","email":"wmiddlemist1g@cornell.edu","password":"AH5xAd9TJ","role":"student"},
{"name":"Maddi Schulze","email":"mschulze1h@ameblo.jp","password":"ARbOlr3","role":"student"},
{"name":"Row Pym","email":"rpym1i@360.cn","password":"i51APueif","role":"student"},
{"name":"Rebeca Gillow","email":"rgillow1j@xinhuanet.com","password":"SJqtess8RsiJ","role":"student"},
{"name":"Jobye Chiplin","email":"jchiplin1k@moonfruit.com","password":"TrXRgRg","role":"student"},
{"name":"Lula Daybell","email":"ldaybell1l@va.gov","password":"9cvGARX","role":"student"},
{"name":"Kinny Wayte","email":"kwayte1m@about.me","password":"zLg7ZGeI1L","role":"student"},
{"name":"Immanuel Bolles","email":"ibolles1n@craigslist.org","password":"LLZhS8Nf","role":"student"},
{"name":"Wileen Feechan","email":"wfeechan1o@latimes.com","password":"AOEIrZ9Fs","role":"student"},
{"name":"Jone Priddy","email":"jpriddy1p@virginia.edu","password":"4aCzsA","role":"student"},
{"name":"Paxon Lound","email":"plound1q@vinaora.com","password":"teWo6wTSEz","role":"student"},
{"name":"Jemie Spellacy","email":"jspellacy1r@usa.gov","password":"K0gb6qF","role":"student"},
{"name":"Granthem Roggieri","email":"groggieri1s@51.la","password":"2wVrP28r2Un","role":"student"},
{"name":"Ameline Dunbabin","email":"adunbabin1t@taobao.com","password":"ISgdGde7eMEk","role":"student"},
{"name":"Neddie Shenfisch","email":"nshenfisch1u@newsvine.com","password":"MIoYx0qn","role":"student"},
{"name":"Charlean Phippard","email":"cphippard1v@disqus.com","password":"RMh6uLdnb","role":"student"},
{"name":"Etty Slesser","email":"eslesser1w@bloglines.com","password":"QaIhj6LzdxLL","role":"student"},
{"name":"Daniele Raoul","email":"draoul1x@hhs.gov","password":"5mbmn21sKEE","role":"student"},
{"name":"Dian Ruggles","email":"druggles1y@spotify.com","password":"W75LIp","role":"student"},
{"name":"Buckie Litchfield","email":"blitchfield1z@hhs.gov","password":"greMBZAAJ","role":"student"},
{"name":"Kurtis Mead","email":"kmead20@slate.com","password":"oqHybcdP8r","role":"student"},
{"name":"Elonore Mallabar","email":"emallabar21@nyu.edu","password":"NTkPqKT","role":"student"},
{"name":"Malia Calleja","email":"mcalleja22@about.com","password":"1tTvmzTX","role":"student"},
{"name":"Quill Pittaway","email":"qpittaway23@jugem.jp","password":"nTKOomq","role":"student"},
{"name":"Donnajean McKinnon","email":"dmckinnon24@go.com","password":"hsVdTj25C","role":"student"},
{"name":"Tallou Seadon","email":"tseadon25@state.tx.us","password":"0KIrd73","role":"student"},
{"name":"Barbra Panas","email":"bpanas26@answers.com","password":"TllOuZZJW","role":"student"},
{"name":"Etta McIlrath","email":"emcilrath27@ed.gov","password":"Uy2M3Poru","role":"student"},
{"name":"Pattin Jakoub","email":"pjakoub28@blog.com","password":"wL34UnM","role":"student"},
{"name":"Gail Diche","email":"gdiche29@guardian.co.uk","password":"haaF4iGyZH","role":"student"},
{"name":"Jacklyn Gormally","email":"jgormally2a@feedburner.com","password":"vd9FVo","role":"student"},
{"name":"Caril Guillem","email":"cguillem2b@pinterest.com","password":"T3ncHCULbKY","role":"student"},
{"name":"Carlin Vedeneev","email":"cvedeneev2c@yahoo.co.jp","password":"MovTPCb7Cq","role":"student"},
{"name":"Boycie Southerton","email":"bsoutherton2d@acquirethisname.com","password":"9zbEKmp","role":"student"},
{"name":"Eberhard Olenov","email":"eolenov2e@tinyurl.com","password":"3r9A09FizQ","role":"student"},
{"name":"Farley Shakelady","email":"fshakelady2f@wordpress.org","password":"VHvYceOL9VKx","role":"student"},
{"name":"Lindy Mathouse","email":"lmathouse2g@symantec.com","password":"wsYEuJo4rWu","role":"student"},
{"name":"Trix Lanston","email":"tlanston2h@nbcnews.com","password":"w6k3WW6F","role":"student"},
{"name":"Cher Carletto","email":"ccarletto2i@utexas.edu","password":"HAR5nIz","role":"student"},
{"name":"Maribeth Grzelak","email":"mgrzelak2j@netvibes.com","password":"TgQl3f","role":"student"},
{"name":"Charyl McTeague","email":"cmcteague2k@vkontakte.ru","password":"0gxIcMT0oR","role":"student"},
{"name":"Dare Sharrocks","email":"dsharrocks2l@livejournal.com","password":"A5J3NF","role":"student"},
{"name":"Bryant Trubshaw","email":"btrubshaw2m@washington.edu","password":"oet1QT7tg","role":"student"},
{"name":"Rodrick Crix","email":"rcrix2n@addtoany.com","password":"SJWdluAC33i","role":"student"},
{"name":"Gerry Short","email":"gshort2o@tumblr.com","password":"DaOex1p","role":"student"},
{"name":"Karalee Tire","email":"ktire2p@gnu.org","password":"VG8FXK","role":"student"},
{"name":"Timmy Fontelles","email":"tfontelles2q@ocn.ne.jp","password":"Rsyxd2MZtLM","role":"student"},
{"name":"Elihu Lere","email":"elere2r@pen.io","password":"iSD5R1g2ZI","role":"student"},
{"_id":{"$oid":"5ee024d213e6b43630db79ff"},"name":"Haven Maultby","email":"hmaultby0@google.co.uk","password":"YE7tRYw","role":"instructor"},
{"_id":{"$oid":"5ee024d213e6b43630db7a00"},"name":"Gusta Casson","email":"gcasson1@reuters.com","password":"xm6k5RvJz","role":"instructor"},
{"_id":{"$oid":"5ee024d213e6b43630db7a01"},"name":"Arly Brockwell","email":"abrockwell2@wsj.com","password":"crpEUF","role":"instructor"},
{"_id":{"$oid":"5ee024d213e6b43630db7a02"},"name":"Jeannine Bartczak","email":"jbartczak3@imgur.com","password":"huTOLVto","role":"instructor"},
{"_id":{"$oid":"5ee024d213e6b43630db7a03"},"name":"Jerrilyn Peare","email":"jpeare4@hostgator.com","password":"IEKdZQWYd2YQ","role":"instructor"},
{"_id":{"$oid":"5ee024d213e6b43630db7a04"},"name":"Catha Classen","email":"cclassen5@about.me","password":"SqD8TkhGyO","role":"instructor"},
{"_id":{"$oid":"5ee024d213e6b43630db7a05"},"name":"Herc Gorriessen","email":"hgorriessen6@state.gov","password":"f83JXt2FJGM","role":"instructor"},
{"name":"Hildy McMurthy","email":"hmcmurthy0@shinystat.com","password":"z1bioG1ae","role":"admin"},
{"name":"Odessa Bris","email":"obris1@indiatimes.com","password":"v4eKsZbXgH","role":"admin"},
{"name":"Willow Pulley","email":"wpulley2@about.me","password":"IaaUPbwzETf","role":"admin"}]);