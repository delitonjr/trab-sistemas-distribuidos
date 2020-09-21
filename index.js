const readline = require('readline');
const fs = require('fs');

const scanner = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var betsArray = [];
var receiptArray = [];
var correctBetsCount = 0;

const logo = `
███    ██  ██████  ██████  ███████      ██ ███████          
████   ██ ██    ██ ██   ██ ██           ██ ██               
██ ██  ██ ██    ██ ██   ██ █████        ██ ███████          
██  ██ ██ ██    ██ ██   ██ ██      ██   ██      ██          
██   ████  ██████  ██████  ███████  █████  ███████          
                                                            
                                                            
██       ██████  ████████ ████████ ███████ ██████  ██    ██ 
██      ██    ██    ██       ██    ██      ██   ██  ██  ██  
██      ██    ██    ██       ██    █████   ██████    ████   
██      ██    ██    ██       ██    ██      ██   ██    ██    
███████  ██████     ██       ██    ███████ ██   ██    ██  
`

const separator = `██████████████████████████████████████████████████████████████████████████████████████████\n `

const readNumberFromProcess = (prompt = 'Aposta numero 1: ') => {
    scanner.question(prompt, (answer) => {
        if (answer < 1 || answer > 60 || haveDuplicates(formatOneDigitNumber(answer)) ) {
            console.log("Número repetido ou invalido")
            readNumberFromProcess(`Aposta numero ${betsArray.length+1}:`);
        } else {
            let formattedAnswer = formatOneDigitNumber(answer)
            betsArray.push(formattedAnswer);
            if (betsArray.length > 5) {
                scanner.close();
                processResults();
            } else {
                readNumberFromProcess(`Aposta numero ${betsArray.length+1}:`);
            }
        }
    });
}

function haveDuplicates(entry){
    const duplicates = betsArray.filter(val => betsArray.includes(entry))
    if (duplicates.length > 0) {
        return true
    }
    else {
        return false
    }
}

const processResults =() => {
    fs.readFile('games-list.txt', 'utf-8', (err, bets) => {
        if (err) {
            console.log('Arquivo nao encontrado');
        } else {
            receiptArray.push(separator)
            receiptArray.push(logo)
            receiptArray.push(separator)
            receiptArray.push("Lottery Ticket Results")
            receiptArray.push('Números sorteados: ' + betsArray.sort())
            receiptArray.push(separator)
            receiptArray.push('Apostas:');
            let lines = bets.split(/\r?\n/);
            lines.forEach((line) => {
                if (line !== "") {
                    let fileNumbers = line.split(',');
                    var correctBet = []

                    correctBet = fileNumbers.filter(val => betsArray.includes(val))
                    if (correctBet.length === 6) correctBetsCount++;

                    receiptArray.push(fileNumbers + ' Acertos: ' + correctBet.length);
                }
            });
            receiptArray.push(separator)
            if (correctBetsCount > 0) {
                receiptArray.push('Resultado: GANHADOR')
            }
            else {
                receiptArray.push("Resultado: Não foi dessa vez")
            }
            receiptArray.push(separator)
            saveResults();
        }
    })
}

const saveResults = () => {
    let fileName = generateDateFileName();
    let finalReceipt = '';
    receiptArray.forEach((receiptLine) => {
        finalReceipt += receiptLine + '\n';
    });

    fs.open(fileName, 'w', (err) => {
        if (err) {
            console.log('Erro ao criar o arquivo');
        } else {
            fs.writeFile(fileName, finalReceipt, (err) => {
                if (err) {
                    console.log('Erro ao salvar a jogada');
                }

                process.exit();
            })
        }
    })
    
}

const generateDateFileName = () => {
    let currentDate = new Date();
    let day = ("0" + currentDate.getDate()).slice(-2);
    let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    let year = currentDate.getFullYear();
    let hours = formatOneDigitNumber(currentDate.getHours());
    let minutes = formatOneDigitNumber(currentDate.getMinutes());
    
    currentDate = year + month + day + hours + minutes;

    return currentDate + '.txt';
}

const formatOneDigitNumber = (value) => {
    if ((value + '').length === 1) {
        value = '0' + value;
    }
    return value;
}

console.log('Informe 6 numeros entre 1 e 60:');
readNumberFromProcess();