// Definir constantes
let Kw = 1.00e-14


// Selecionar Sliders
let ConcTitulante = document.getElementById('ConcTitulante')
let ConcTitulado = document.getElementById('ConcTitulado')

let VolTitulante = document.getElementById('VolTitulante')
let VolTitulado = document.getElementById('VolTitulado')


// Selecionar os Spans com os Value dos Sliders
let ConcTitulanteResp = document.getElementById('ConcTitulanteValue')
let ConcTituladoResp = document.getElementById('ConcTituladoValue')

let VolTitulanteResp = document.getElementById('VolTitulanteValue')
let VolTituladoResp = document.getElementById('VolTituladoValue')


// Selecionar a div onde vai parar a curva
let divCurva = document.getElementById('curva-pH')



// Atualizar os Sliders
ConcTitulante.oninput = function atualizarConcTitulante() {
    let ConcTitulanteValue = ConcTitulante.value / 100

    ConcTitulanteResp.innerHTML = `${ConcTitulanteValue.toFixed(2)}`

    let canvasCurva = document.getElementById('canvasCurva')
    divCurva.removeChild(canvasCurva)
    curva()
}
ConcTitulado.oninput = function atualizarConcTitulado() {
    let ConcTituladoValue = ConcTitulado.value / 100

    ConcTituladoResp.innerHTML = `${ConcTituladoValue.toFixed(2)}`

    let canvasCurva = document.getElementById('canvasCurva')
    divCurva.removeChild(canvasCurva)
    curva()
}

VolTitulante.oninput = function atualizarVolTitulante() {
    let VolTitulanteValue = VolTitulante.value / 100

    VolTitulanteResp.innerHTML = `${VolTitulanteValue.toFixed(2)}`

    let canvasCurva = document.getElementById('canvasCurva')
    divCurva.removeChild(canvasCurva)
    curva()
}
VolTitulado.oninput = function atualizarVolTitulado() {
    let VolTituladoValue = VolTitulado.value * 1

    VolTituladoResp.innerHTML = `${VolTituladoValue.toFixed(2)}`

    let canvasCurva = document.getElementById('canvasCurva')
    divCurva.removeChild(canvasCurva)
    curva()
}


function pontos() {
    let nTitulante = 0
    let nTitulado = 0

    let CTitulante = ConcTitulante.value / 100
    let CTitulado = ConcTitulado.value / 100
    
    let nH3O = 0
    let nHO = 0

    let CH3O = 0
    let CHO = 0
    
    let volumeTitulante = 0
    let volumeTitulado = VolTitulado.value * 1

    let volumeAdicional = VolTitulante.value / 100
    let volumeTotal = VolTitulado.value * 1

    let pH = 0

    let xVolumes = []
    let ypH = []

    while (true) {
        nH3O = 0
        nHO = 0

        nTitulante = volumeTitulante * CTitulante
        nTitulado = volumeTitulado * CTitulado

        if (nTitulante > nTitulado) {           // Gastou o Titulado completamente
            nH3O = nTitulante - nTitulado       // O Titulante que sobra Ioniza-se completamente

        } else if (nTitulado > nTitulante) {    // Gastou o Titulante Todo 
            nHO = nTitulado - nTitulante        // O Titulado que sobra Ioniza-se completamente
        
        } else {
            nH3O = nHO = 0
        }

        CH3O = nH3O / volumeTotal
        CHO = nHO / volumeTotal

        if (CH3O < 10e-10 && CH3O > 0) {
            CH3O = Math.sqrt(Kw)
        } else if (CHO < 10e-10 && CHO > 0) {
            CHO = Math.sqrt(Kw)
        }

        if (CH3O != 0) {
            pH = -Math.log10(CH3O)
        } else if (CHO != 0) {
            pOH = -Math.log10(CHO)
            pH = 14 - pOH
        } else {
            pH = 7
        }

        xVolumes.push(volumeTitulante.toFixed(2))
        ypH.push(pH.toFixed(2))

        if (volumeTitulante >= volumeTitulado) {
            break
        } else {
            volumeTotal += volumeAdicional
            volumeTitulante += volumeAdicional
        }
    }
    
    return [xVolumes, ypH]
}


function curva() {
    let tudo = pontos()
    let xVolumes = tudo[0]
    let ypH = tudo[1]

    // Criar o canvas on de vai estar a curva
    canvasCurva = document.createElement('canvas')
    canvasCurva.setAttribute('id', 'canvasCurva')
    canvasCurva.setAttribute('width', '400')
    canvasCurva.setAttribute('height', '200')
    divCurva.appendChild(canvasCurva)

    let graCurva = new Chart(canvasCurva, {
        type: 'line',
        data: {
            labels: xVolumes,
            datasets: [
                {
                    data: ypH,
                    label: 'pH da Solução',
                    borderColor: 'blue',
                    fill: false
                }
            ]
        }
    })
}

window.onload = curva
