console.log("script carregado! [ab bird]")

let frames = 0
let pontuacao = 0
const somDeMorte = new Audio()
const somDePonto = new Audio()
const somDePulo = new Audio()

somDeMorte.src = "./efeitos/morte.mp3"
somDePonto.src = "./efeitos/ponto.mp3"
somDePulo.src = "./efeitos/pulo.mp3"

const CarregarSprites = new Image()
CarregarSprites.src = "./sprites.png"

const canvas = document.querySelector("canvas")
const contexto = canvas.getContext("2d")

function criarPlacar(){
  const placar = {
    pontuacao: 0,
    spawnar(){
      contexto.font = '30px "VT323"';
      contexto.fillStyle = "white";
      contexto.fillText(`Pontuação: ${placar.pontuacao}`, 50, 90);
    },

    update(){
      
    }
  }
  return placar
}

const globais = {}
let telaAtual = {}

function trocarTela(novaTela){
  telaAtual = novaTela 

  if(telaAtual.carregar){
    telaAtual.carregar()
  }
}

function colisao(passaro,chaoBackground){
  const passaroY = passaro.y + passaro.altura
  const chao = chaoBackground.y

  if(passaroY >= chao){
    return true
  }

  return false;
}

function criarCanos(){
  const canos = {
    largura: 52,
    altura:400,
    chao:{
      spriteX:0,
      spriteY:169,
    },
    ceu: {
      spriteX:52,
      spriteY: 169,
    },
    espaco: 80,
    spawnar(){
      canos.pares.forEach(function(par){
        const AlturaAleatoria = par.y
        const espacoEntreCanos = 90
  
  
        const canoCeuX = par.x
        const canoCeuY = AlturaAleatoria

        contexto.drawImage(
          CarregarSprites,
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura
        )
  
        const canoChaoX = par.x
        const canoChaoY = canos.altura + espacoEntreCanos + AlturaAleatoria;
  
        contexto.drawImage(
          CarregarSprites,
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura
        )

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },

    temColisaoComOFlappyBird(par) {
      const cabecaDoPassaro = globais.passaro.y;
      const peDoPassaro = globais.passaro.y + globais.passaro.altura;

      if(globais.passaro.x >= par.x && globais.passaro.x <= par.x){
        globais.placar.pontuacao = globais.placar.pontuacao + 1
        somDePonto.play()
        console.log(globais.placar.pontuacao)
      }
      
      if(globais.passaro.x >= par.x && globais.passaro.x <= par.x + canos.largura) {

        if(cabecaDoPassaro <= par.canoCeu.y) {
          return true;
        }

        if(peDoPassaro >= par.canoChao.y) {
          return true;
        }
      }
      return false;
    },
    pares:[],
    update(){
      const passou100frames = frames % 70 === 0;
      if(passou100frames){
        canos.pares.push({
            x: canvas.width,
            y: -150 * (Math.random() + 1),
          })
      }

      canos.pares.forEach(function(par){
        par.x = par.x - 2

        if(canos.temColisaoComOFlappyBird(par)){
          somDeMorte.play()
          trocarTela(elementos.gameOver)
        }

        if(par.x + canos.largura <= 0){
          canos.pares.shift();
        }
      })

    }
  }
  return canos
}

function criarPassaro(){
  const passaro ={
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x:300,
    y:50,
    pulo: 4.5,
    pular(){
      passaro.velocidade = - passaro.pulo
      somDePulo.play()
    },
    forcaGravitacional: 0.25,
    velocidade: 0,

    gravidade() {

      if(colisao(passaro,globais.chaoBackground)){  
        somDeMorte.play()

          trocarTela(elementos.gameOver)
        return
      }

      passaro.velocidade = passaro.velocidade + passaro.forcaGravitacional
      passaro.y = passaro.y + passaro.velocidade
    },
    movimentos: [
      {spriteX: 0, spriteY: 0},
      {spriteX: 0, spriteY: 26},
      {spriteX: 0, spriteY: 52},
      {spriteX: 0, spriteY: 26}
    ],
    frameAtual: 0,
    atualizarFrames(){
      const intervalo = 10
      const passouIntervalo = frames % intervalo === 0;

      if(passouIntervalo){
        const base = 1
        const trocarFrame = base + passaro.frameAtual
        const repeticao = passaro.movimentos.length
        passaro.frameAtual = trocarFrame % repeticao
      }
    },
    spawnar() {
      passaro.atualizarFrames()
      const {spriteX,spriteY} = passaro.movimentos[passaro.frameAtual]

      contexto.drawImage(
      CarregarSprites,
      spriteX,spriteY,
      passaro.largura,passaro.altura,
      passaro.x,passaro.y,
      passaro.largura,passaro.altura,
    )
   }
  }
  return passaro;
}

function criarChao(){
  const chaoBackground = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x:0,
    y:canvas.height - 112,
    animar(){
      const movimentoChao = 1
      const repetir = (chaoBackground.largura / 2) - 112 /2
      const movimentacao = chaoBackground.x - movimentoChao

      chaoBackground.x = movimentacao % repetir
    },
    spawnar() {
    contexto.drawImage(
      CarregarSprites,
      chaoBackground.spriteX,chaoBackground.spriteY,
      chaoBackground.largura,chaoBackground.altura,
      chaoBackground.x,chaoBackground.y,
      chaoBackground.largura,chaoBackground.altura,
    )
    contexto.drawImage(
      CarregarSprites,
      chaoBackground.spriteX,chaoBackground.spriteY,
      chaoBackground.largura,chaoBackground.altura,
      (chaoBackground.x + chaoBackground.largura),chaoBackground.y,
      chaoBackground.largura,chaoBackground.altura,
    )
    contexto.drawImage(
      CarregarSprites,
      chaoBackground.spriteX,chaoBackground.spriteY,
      chaoBackground.largura,chaoBackground.altura,
      (chaoBackground.x + chaoBackground.largura * 2),chaoBackground.y,
      chaoBackground.largura,chaoBackground.altura,
    )
    contexto.drawImage(
      CarregarSprites,
      chaoBackground.spriteX,chaoBackground.spriteY,
      chaoBackground.largura,chaoBackground.altura,
      (chaoBackground.x + chaoBackground.largura * 3),chaoBackground.y,
      chaoBackground.largura,chaoBackground.altura,
    )
    contexto.drawImage(
      CarregarSprites,
      chaoBackground.spriteX,chaoBackground.spriteY,
      chaoBackground.largura,chaoBackground.altura,
      (chaoBackground.x + chaoBackground.largura * 4),chaoBackground.y,
      chaoBackground.largura,chaoBackground.altura,
    )
    contexto.drawImage(
      CarregarSprites,
      chaoBackground.spriteX,chaoBackground.spriteY,
      chaoBackground.largura,chaoBackground.altura,
      (chaoBackground.x + chaoBackground.largura * 5),chaoBackground.y,
      chaoBackground.largura,chaoBackground.altura,
    )
  }
 }
 return chaoBackground
}

function criarBackground(){
  const Background = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x:0,
    y:canvas.height - 315,
    spawnar() {
        contexto.fillStyle = "#70c5ce"
        contexto.fillRect(0,0, canvas.width, canvas.height)
  
        contexto.drawImage(
          CarregarSprites,
          Background.spriteX,Background.spriteY,
          Background.largura,Background.altura,
          Background.x,Background.y,
          Background.largura,Background.altura,
        )
  
        contexto.drawImage(
          CarregarSprites,
          Background.spriteX,Background.spriteY,
          Background.largura,Background.altura,
          (Background.x + Background.largura),Background.y,
          Background.largura,Background.altura,
        )
        contexto.drawImage(
          CarregarSprites,
          Background.spriteX,Background.spriteY,
          Background.largura,Background.altura,
          (Background.x + Background.largura * 2),Background.y,
          Background.largura,Background.altura,
        )
        contexto.drawImage(
          CarregarSprites,
          Background.spriteX,Background.spriteY,
          Background.largura,Background.altura,
          (Background.x + Background.largura * 3),Background.y,
          Background.largura,Background.altura,
        )
        contexto.drawImage(
          CarregarSprites,
          Background.spriteX,Background.spriteY,
          Background.largura,Background.altura,
          (Background.x + Background.largura * 4),Background.y,
          Background.largura,Background.altura,
        ) 
    }
  }
  return Background
}

const telaInicial = {
  spriteX: 134,
  spriteY: 0,
  largura: 174,
  altura: 152,
  x:(canvas.width / 2 ) - 174 /2 ,
  y:(canvas.height / 2 ) - 174 /2 ,

  spawnar() {
    contexto.drawImage(
     CarregarSprites,
     telaInicial.spriteX,telaInicial.spriteY,
     telaInicial.largura,telaInicial.altura,
     telaInicial.x,telaInicial.y,
     telaInicial.largura,telaInicial.altura,
    )
  }
}

const telaGameOver = {
  spriteX: 134,
  spriteY: 153,
  largura: 226,
  altura: 200,
  x:(canvas.width / 2 ) - 226 /2 ,
  y:(canvas.height / 2 ) - 226 /2 ,

  spawnar() {
    contexto.drawImage(
     CarregarSprites,
     telaGameOver.spriteX,telaGameOver.spriteY,
     telaGameOver.largura,telaGameOver.altura,
     telaGameOver.x,telaGameOver.y,
     telaGameOver.largura,telaGameOver.altura,
    )
  }
}

const elementos = {
  inicio:{
    carregar(){
      globais.passaro = criarPassaro()
      globais.chaoBackground = criarChao()
      globais.Background = criarBackground()
      globais.canos = criarCanos()
    },
    spawn(){
      globais.Background.spawnar()
      globais.passaro.spawnar()

      globais.chaoBackground.spawnar()
      telaInicial.spawnar()
    },
    acao(){
      trocarTela(elementos.jogo)
    },
    update(){
      globais.chaoBackground.animar()
    }
  }
}

elementos.jogo = {
  carregar(){
    globais.placar = criarPlacar();
  },
  spawn(){
    globais.Background.spawnar()
    globais.canos.spawnar()
    globais.chaoBackground.spawnar()
    globais.passaro.spawnar()
    globais.placar.spawnar()
  },
  acao(){
    globais.passaro.pular();
  },
  update(){
    globais.canos.update()
    globais.chaoBackground.animar()
    globais.passaro.gravidade()
    globais.placar.update()
  }
}

elementos.gameOver = {
  spawn(){
    telaGameOver.spawnar();
  },
  update(){

  },
  acao(){
    trocarTela(elementos.inicio)
  }
}


function loopFPS(){
  telaAtual.spawn()
  telaAtual.update()

  frames = frames + 1
  requestAnimationFrame(loopFPS)
}

window.addEventListener("keypress", function(){
  if(telaAtual.acao){
    telaAtual.acao()
  }
})

trocarTela(elementos.inicio)
loopFPS();