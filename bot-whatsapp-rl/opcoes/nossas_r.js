
const DicT = require('../dicusuarios.js')
const Lim = require('../ferramentas/limpaDic.js')
const MsgA = require('./deseja_a.js')

async function nossas_rI(dicInf) {
    var client = dicInf['idCli']
    var message = dicInf['idMsg']
    var primeira = dicInf['idPri']
    var idNum = message.from
    
    if (primeira) {
        await client.sendText(
            idNum,
            `Temos varias!  โฒ
๐
            
Instagram, ๐ธ
instagram.com/techtudo
            
Tik Tok, ๐
tiktok.com/techtudo
            
Twitter, ๐ฆ
twitter.com/techtudo
            
YouTube, โฏ๏ธ
youtube.com/techtudo
            
Facebook, ๐ฃ
facebook.com/techtudo
            
Pinterest, ๐๏ธ
pinterest.com/techtudo

Segue lรก!  ๐`
        )
        client.startTyping(idNum)
        await MsgA.deseja_a(idNum, client)
    
        DicT.postEstado(idNum, '1.00')
        Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
    }
}

module.exports = {
    nossas_rI
}