
const DicT = require('../dicusuarios.js')
const Lim = require('../ferramentas/limpaDic.js')
const Mdb = require('../../mysql-db/index/Mdb.js')
const Fom = require('../ferramentas/fomIdNum.js')
const Lis = require('./lista.js')
const Cap = require('../ferramentas/capitalize.js')
const MsgP = require('./msg_padrao.js')


async function introducaoI(dicInf) {
    var client = dicInf['idCli']
    var message = dicInf['idMsg']
    var idNum = message.from
    var estado = await DicT.getEstado(idNum)
    

    if (estado === '0.00' || estado === 'SemNome') {
        await client.sendText(idNum, `Olá!\nMeu nome é *Thayna*, sou assistente virtual da _Tech Tudo_! 🙂\n\n*Como gostaria de ser chamado?* 😁`)

        DicT.postEstado(idNum, '0.01')
        Lim.defiTemp(idNum, 120, 'estadodb', '0.00')
    }

    else if (estado === '0.01') {
        let valorDigitado = Cap.capitalize(message.body)

        if (valorDigitado.length <= 15) {
            var buttons = [{"buttonText": {"displayText": "Sim"}}, {"buttonText": {"displayText": "Não"}}]
            await client.sendButtons(idNum, `O nome abaixo está correto?\n🤔     *${valorDigitado}*\n`, buttons, `_Escolha uma opção:_`)
            DicT.postEstado(idNum, valorDigitado, 'nome')
            DicT.postEstado(idNum, '0.02')
            Lim.defiTemp(idNum, 60, 'estadodb', '0.00', 
                {idNum: idNum , funFuCon: function() {DicT.postEstado(this.idNum, '', 'nome')}})
        }

        else if (valorDigitado.length >= 15) {
            await client.sendText(idNum, `Foi mal, é permitido apenas um máximo de 15 caracteres 😕\n\n*Por favor, digite novamente:*`)
            DicT.postEstado(idNum, '0.01')
            Lim.defiTemp(idNum, 50, 'estadodb', '0.00')
        }
    }

    else if (estado === '0.02') {
        let valorDigitado = message.body.toLowerCase()

        var simLista = ['sim', 'ssss', 'sss', 'ss', 's', 'yes', 'y', 'positivo', 'exatamente', 'isso', 'esta', 'está', 'estar']
        var naoLista = ['não', 'nao', 'n', 'nn', 'nnn', 'ñ', 'errado', 'não esta', 'nao esta', 'incorreto', 'não está', 'nao está']
        if (simLista.indexOf(valorDigitado) >= 0) {
            await client.sendText(idNum, `Então está OK! 😄`)
            client.startTyping(idNum)

            var dicInsert = {
                numerocDB: idNum, 
                numerofDB: Fom.fomIdNum(idNum), 
                nomeDB: await DicT.getEstado(idNum, 'nome'), 
                estadoDB: '1.00', 
                novidadesDB: '2',
                desblockDB: '0'
            } ; const insertNovoUsuario = await Mdb.insertUsa(dicInsert)

            const getNome = await DicT.getEstado(idNum, 'nome')

            await client.sendListMenu(idNum, `Olá *${getNome}*! É um prazer te conhecer! Acabei de salvar seu número, *salva o meu!* 😊\n\n`, 
                'TTT', 'Como posso ajudar?\n_Escolha uma opção 👇🏼_', 'O que deseja? 🤔', Lis.lista)

            DicT.postEstado(idNum, '1.00')
            Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
        }

        else if (naoLista.indexOf(valorDigitado) >= 0) {
            await client.sendText(idNum, `Tudo bem! Pode repetir,\n\n*Como gostaria de ser chamado?* 😁`)
            DicT.postEstado(idNum, '', 'nome')
            DicT.postEstado(idNum, '0.01', 'estado')
            Lim.defiTemp(idNum, 60, 'estadodb', '0.00')
        }

        else {
            let nomeDigitadoAnterior = await DicT.getEstado(idNum, valor='nome')
            var buttons = [{"buttonText": {"displayText": "Sim"}}, {"buttonText": {"displayText": "Não"}}]
            await client.sendButtons(idNum, `O nome abaixo está correto?\n🤔     *${nomeDigitadoAnterior}*\n`, buttons, `_Escolha uma opção:_`)
            Lim.defiTemp(idNum, 60, 'estadodb', '0.00')
        }
    }

    else if (estado === '1.00') {
        await MsgP.msg_padrao(idNum, client)
        Lim.defiTemp(idNum, 60, 'estadodb', '1.00')
    }
}

module.exports = {
    introducaoI
}


