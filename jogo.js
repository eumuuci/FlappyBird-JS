console.log("script carregado! [ab bird]")

let frames = 0
const somDeMorte = new Audio()
somDeMorte.src = "./efeitos/morte.mp3"

const CarregarSprites = new Image()
CarregarSprites.src = "./sprites.png"

const canvas = document.querySelector("canvas")
const contexto = canvas.getContext("2d")

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
      
      if(globais.passaro.x >= par.x) {
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
      const passou100frames = frames % 100 === 0;
      if(passou100frames){
        canos.pares.push({
            x: canvas.width,
            y: -150 * (Math.random() + 1),
          })
      }

      canos.pares.forEach(function(par){
        par.x = par.x - 2

        if(canos.temColisaoComOFlappyBird(par)){
          console.log("bateu no cano")
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
    },
    forcaGravitacional: 0.25,
    velocidade: 0,

    gravidade() {

      if(colisao(passaro,globais.chaoBackground)){  
        somDeMorte.play()

        setTimeout(() => {
          trocarTela(elementos.inicio)
        },2200)
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

const elementos = {
  inicio:{
    carregar(){
      globais.passaro = criarPassaro()
      globais.chaoBackground = criarChao()
      globais.canos = criarCanos()
    },
    spawn(){
      Background.spawnar()
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
  spawn(){
    Background.spawnar()
    globais.canos.spawnar()
    globais.chaoBackground.spawnar()
    globais.passaro.spawnar()
  },
  acao(){
    globais.passaro.pular();
  },
  update(){
    globais.canos.update()
    globais.chaoBackground.animar()
    globais.passaro.gravidade()
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