// 1. Deposit some money
// 2. Determine number of lines to bet
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if user won
// 6. give user their winnings (or not)
// 7. play again

// Import the prompt-sync module, which returns a function.
const prompt = require('prompt-sync')() // Invoke the returned function and assign the result to the 'prompt' constant.

const ROWS = 3
const COLS = 3

//create js object to hold key-value pairs
const SYMBOLS_COUNT = {
  A: 6, //3
  B: 6, //4
  C: 3, //5
  D: 3, //6
}
// multiplier values for each symbol
const SYMBOL_VALUES = {
  A: 50,
  B: 20,
  C: 10,
  D: 5,
}

const deposit = () => {
  while (true) {
    const depositAmount = prompt('Enter a deposit amount: ')
    const numberDepositAmount = parseFloat(depositAmount)

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log('Invalid deposit amount, try again.')
    } else {
      return numberDepositAmount
    }
  }
}

const getNumberOfLines = () => {
  while (true) {
    const lines = prompt('Enter number of lines to bet on (1-3): ')
    const numberOfLines = parseFloat(lines)

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log('Invalid line amount. Lines must be between 1-3, try again.')
    } else {
      return numberOfLines
    }
  }
}

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt('Enter the bet per line: ')
    const numberBet = parseFloat(bet)

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      // bet is distributed over lines
      console.log('Invalid bet, please try again.')
    } else {
      return numberBet
    }
  }
}

const spin = () => {
  const symbols = [] // we can manipulate whats in an array still using const in js
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; ++i) {
      // adds total number of each symbol to array
      symbols.push(symbol)
    }
  }

  const reels = [] //each nested array will be a column
  for (let i = 0; i < COLS; ++i) {
    reels.push([]) // adds nested array
    const reelSymbols = [...symbols] //generate available symbols per reel by copying form symbols array
    for (let j = 0; j < ROWS; ++j) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length)
      const selectedSymbol = reelSymbols[randomIndex]
      reels[i].push(selectedSymbol)
      reelSymbols.splice(randomIndex, 1) //remove the symbol from the generated array
    }
  }
  return reels
}

//make the reels array more easier to work with by formatting array into rows
const transpose = (reels) => {
  const rows = []
  for (let i = 0; i < ROWS; ++i) {
    rows.push([])
    for (let j = 0; j < COLS; ++j) {
      rows[i].push(reels[j][i])
    }
  }
  return rows
}

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = ''
    for (const [i, symbol] of row.entries()) {
      rowString += symbol
      if (i != row.length - 1) {
        rowString += ' | '
      }
    }
    console.log(rowString)
  }
}

const getWinnings = (rows, bet, lines) => {
  let winnings = 0
  for (let row = 0; row < lines; ++row) {
    const symbols = rows[row]
    let allSame = true

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false
        break
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]]
    }
  }
  return winnings
}

const game = () => {
  let balance = deposit()
  while (true) {
    console.log('Current balance: $' + balance)
    const numberOfLines = getNumberOfLines()
    const bet = getBet(balance, numberOfLines)
    balance -= bet * numberOfLines
    const reels = spin()
    const rows = transpose(reels)
    printRows(rows)
    const winnings = getWinnings(rows, bet, numberOfLines)
    balance += winnings
    console.log('You won, $' + winnings.toString())

    if (balance <= 0) {
      console.log('You went broke!')
      break
    }

    let playAgain = prompt('Play again (y/n)? ')

    while (playAgain != 'y' && playAgain != 'n') {
      playAgain = prompt('Play again (y/n)? ')
    }

    if (playAgain == 'n') {
      console.log('You finished with $' + balance)
      break
    }
  }
}

game()
