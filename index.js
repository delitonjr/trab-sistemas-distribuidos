const readline = require('readline');
const fs = require('fs');

const scanner = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var betsArray = [];
var receiptArray = [];
var correctBetsCount = 0;

const readNumberFromProcess = (prompt = 'Aposta numero 1: ') => {
    scanner.question(prompt, (answer) => {
        if (answer < 1 || answer > 60) {
            console.log("Valor invalido. Por favor insira valores de 1 a 60")
            readNumberFromProcess(`Aposta numero ${betsArray.length+1}:`);
        } else {
            betsArray.push(answer);
            if (betsArray.length > 5) {
                scanner.close();
                processResults();
            } else {
                readNumberFromProcess(`Aposta numero ${betsArray.length+1}:`);
            }
        }
    });
}

const processResults = () => {
    fs.readFile('games-list.txt', 'utf-8', (err, bets) => {
        if (err) {
            console.log('Arquivo de apostas nao encontrado!');
        } else {
            receiptArray.push('Numeros sorteados: ' + betsArray)
            receiptArray.push('Apostas:');
            let lines = bets.split(/\r?\n/);
            lines.forEach((line) => {
                let dozens = line.split(',');
                let count = 0;

                for (let i=0;i<dozens.length;i++) {
                    if (dozens[i] === betsArray[i]) count++;
                };
                if (count === 6) correctBetsCount++;

                receiptArray.push(dozens + ' Acertos: ' + count);
            });
            if (correctBetsCount > 0) {
                receiptArray.push('Resultado: Ganhador')
            }
            else {
                receiptArray.push('Resultado: Não foi dessa vez')
            }

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
    let hours = checkMinHour(currentDate.getHours());
    let minutes = checkMinHour(currentDate.getMinutes());
    
    currentDate = year + month + day + hours + minutes;

    return currentDate + '.txt';
}

const checkMinHour = (value) => {
    if ((value + '').length === 1) {
        value = '0' + value;
    }
    return value;
}

console.log('Informe 6 numeros entre 1 e 60:');
readNumberFromProcess();