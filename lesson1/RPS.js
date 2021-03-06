const readline = require("readline-sync");

const WINNING_COMBOS = {
    r: ["s", "l"],
    p: ["r", "k"],
    s: ["p", "l"],
    l: ["p", "k"],
    k: ["r", "s"],
};

const ROUNDS_TO_WIN = 5;

const RPSGame = {
    human: createHuman(),
    computer: createComputer(),
    roundsHistory: [],
    game: {
        match: 0,
        round: 0,
        totalRoundsPlayed: 0,
    },
    winsHistory: {
        human: 0,
        computer: 0,
    },

    updatedComputerChoices : {
        choices: ["r", "p", "s", "l", "k"]
    },

    displayWelcomeMessage() {
        console.log(`Welcome to Rock, Paper, Scissors, Lizard, Spock!\nFirst player who gets ${ROUNDS_TO_WIN} points wins.\n`);
    },

    displayGoodbyeMessage() {
        console.log("\nThanks for playing Rock, Paper, Scissors. Goodbye!");
    },

    addDivideLine(text) {
        let divideLine = `${"_".repeat(text.length)}`;
        console.log(divideLine);
    },

    printHistoryInBox(humanMoveText, computerMoveText, roundResult) {
        console.log(roundResult);
        const DASH = "-";
        const SPACE = " ";
        const LONGEST_STR_LENGTH = " COMPUTER - scissors  ".length;

        let humanMoveStr = ` HUMAN - ${humanMoveText} `;
        let computerMoveStr = ` COMPUTER - ${computerMoveText} `;

        let dashes = DASH.repeat(LONGEST_STR_LENGTH);

        let line = ["+", dashes, "+", dashes, "+", dashes, "+", dashes, "+"].join("");
        let midLine = ["|", `Round: ${this.game.round}`.padEnd(LONGEST_STR_LENGTH, SPACE), "|",
            humanMoveStr.padEnd(LONGEST_STR_LENGTH, SPACE), "|",
            computerMoveStr.padEnd(LONGEST_STR_LENGTH, SPACE), "|",
            roundResult.padEnd(LONGEST_STR_LENGTH, SPACE), "|"
        ].join("");

        this.roundsHistory.push(midLine);
        this.roundsHistory.push(line);

        console.clear();
        console.log(line);
        this.roundsHistory.forEach(round => console.log(round));
    },

    isWinner(winningMove, losingMove) {
        return WINNING_COMBOS[winningMove].includes(losingMove);
    },


    isRoundWinner() {
        let humanMove = this.human.move;
        let computerMove = this.computer.move;
        let roundResult;

        if (this.isWinner(humanMove, computerMove)) {
            roundResult = " You win!";
        } else if (this.isWinner(computerMove, humanMove)) {
            roundResult = " Computer wins!";
        } else {
            roundResult = " It's a tie.";
        }
        return roundResult;
    },

    updateScore() {
        let humanMove = this.human.move;
        let computerMove = this.computer.move;

        if (this.isWinner(humanMove, computerMove)) {
            this.human.score += 1;
        } else if (this.isWinner(computerMove, humanMove)) {
            this.computer.score += 1;
        }     
    },
    
    displayHistory() {
        let humanMoveText = this.human.toWordChoice(this.human.move);
        let computerMoveText = this.computer.toWordChoice(this.computer.move);

        this.printHistoryInBox(humanMoveText, computerMoveText, this.isRoundWinner());
    },

    playAgain() {
        this.roundsHistory = [];

        console.log("Press 'enter' to play again / 'Q' + 'enter' to quit.");
        let answer;

        while (answer !== "" || /[^Qq]/.test(answer)) {
            answer = readline.question();
            if (answer === "") return true;
            if (/[Qq]/.test(answer)) return false;
        }
    },

    continueToNextRound() {
        console.log("Tap 'enter' to continue to next round.");
        readline.question();
        console.clear();
    },

    movesAnalysis(arr, rounds) {
        let resultObj = {};
        arr.forEach(element => {
            resultObj[element] = resultObj[element] + 1 || 1;
        });

        return Object.entries(resultObj)
            .sort((moveVal1, moveVal2) => {
                if (moveVal1[0] < moveVal2[0]) return -1;
                if (moveVal1[0] > moveVal2[0]) return 1;
                else {
                    return 0;
                }
            })
            .map(moveVal => {
                let [move, val] = moveVal;
                let percent = (val / rounds * 100).toFixed(2);
                return `\n${move} - ${percent}%`;
            })
            .join(", ");
    },

    resetScores() {
        this.human.score = 0;
        this.computer.score = 0;
    },

    increaseMatchNum() {
        this.game.match += 1;
    },

    printMatchNum() {
        let matchNumStr = `\nMATCH ${this.game.match}`;
        console.log(matchNumStr);
    },

    increaseRoundNum() {
        this.game.round += 1;
        this.game.totalRoundsPlayed += 1;
    },

    printScore() {
        let scoreText = `Round ${this.game.round}: 🧑‍ - ${this.human.score}, 💻 - ${this.computer.score}`;
        console.log(scoreText);
    },

    printGameWinner() {
        let resultText = `\nTotal rounds: ${this.game.round}.\nScore: 🧑‍ - ${this.human.score}, 💻 - ${this.computer.score}`;
        let winnerText = `${this.human.score > this.computer.score ? "HUMAN" : "COMPUTER"} wins!`;
        this.addDivideLine(resultText);

        console.log(`Game #${this.game.match} results`);
        console.log(resultText);
        console.log(winnerText);

        this.addDivideLine(resultText);
    },

    updateWins() {
        if (this.human.score > this.computer.score) {
            this.winsHistory.human += 1;
        } else {
            this.winsHistory.computer += 1;
        }
    },

    resetGame() {
        this.game.match = 0;
        this.game.totalRoundsPlayed = 0;
    },

    resetRound() {
        this.game.round = 0;
    },

    maxScore(num = ROUNDS_TO_WIN) {
        return this.human.score < num && this.computer.score < num;
    },

    displayGameStats() {
        console.clear();
        let humanMoves = this.human.movesArr
            .map(letter => this.human.toWordChoice(letter));

        let computerMoves = this.computer.movesArr
            .map(letter => this.computer.toWordChoice(letter));

        console.log("GAME STATS");
        console.log(`Total matches: ${this.game.match}. \n>>> 🧑‍ ${this.winsHistory.human} : ${this.winsHistory.computer} 💻 <<<`);
        console.log(`\nHUMAN moves history: ${this.movesAnalysis(humanMoves, this.game.totalRoundsPlayed)}`);

        console.log(`\nCOMPUTER moves history: ${this.movesAnalysis(computerMoves, this.game.totalRoundsPlayed)}`);
    },

    getWinningChoice(){
        WINNING_COMBOS;
    },

    updateComputerLogic() {
        let newLogic = () => {
            let newChoices = this.updatedComputerChoices.choices;

            let humanMoves = this.human.movesArr
                .map(letter => this.human.toWordChoice(letter));
            let repeatingHumanChoices = this.movesAnalysis(humanMoves, this.game.totalRoundsPlayed)
                .match(/\w+ - \d\d\.\d\d/gi)
                .map(match => match.split(" - "))
                .filter(subArr => {
                    let percent = Number(subArr[1]);
                    if (percent > 20.00) return subArr;
                })
                .map(subArr => subArr[0][0]);
            
            let winningChoices = repeatingHumanChoices.map(choice => {
                let potentialChoices = Object.entries(WINNING_COMBOS);
                potentialChoices = potentialChoices.filter(variant => variant[0] !== choice);
                let random = Math.floor(Math.random() * potentialChoices.length);
                
                return (potentialChoices[random][0]);
            });

            newChoices = newChoices.concat(winningChoices);
            console.log(newChoices);

            let randomIndex = Math.floor(Math.random() * newChoices.length);
            let choice = newChoices[randomIndex];

            this.computer.move = choice;
            this.computer.movesArr.push(choice);
        };

        this.computer.choose = newLogic; 
    },

    play() {
        console.clear();
        this.resetGame();
        this.displayWelcomeMessage();
        do {
            this.increaseMatchNum();
            this.resetScores();
            this.resetRound();
            while (this.maxScore()) {
                this.increaseRoundNum();
                this.printMatchNum();
                this.printScore();
                this.human.choose();
                this.computer.choose();
                this.isRoundWinner();
                this.updateScore();
                this.displayHistory();
                this.continueToNextRound();
            }
            this.printGameWinner();
            this.updateWins();
            this.updateComputerLogic();

        } while (this.playAgain());

        this.displayGameStats();
        this.displayGoodbyeMessage();
    },
};

RPSGame.play();

function createPlayer() {
    return {
        move: null,
        choices: {
            r: "rock",
            p: "paper",
            s: "scissors",
            k: "spock",
            l: "lizard"
        },
        toWordChoice(key) {
            return this.choices[key];
        },
        movesArr: [],
    };
}

function createHuman() {
    let playerObject = createPlayer();

    let humanObject = {

        choose() {
            let choice;

            while (!Object.values(playerObject.choices).includes(choice)) {
                console.log("Please type:");
                Object.entries(playerObject.choices)
                    .forEach(choiceValue => {
                        let [choice, value] = choiceValue;
                        console.log(`- "${choice}" for "${value}"`);
                    });
                choice = readline.question().toLowerCase();

                if (Object.values(playerObject.choices)
                  .includes(choice)) {
                      Object.entries(playerObject.choices)
                      .forEach(keyVal => {
                          let [key, val] = keyVal;
                          if(val === choice) {
                              choice = key;
                          }
                      })
                  };

                if (Object.keys(playerObject.choices)
                    .includes(choice)) break;
                console.log("Sorry, invalid choice.");
            }

            this.move = choice;
            this.movesArr.push(choice);
        },
    };

    return Object.assign(playerObject, humanObject);
}

function createComputer() {
    let playerObject = createPlayer();

    let computerObject = {
        choose() {
            let randomIndex = Math.floor(Math.random() * Object.keys(playerObject.choices).length);
            let choice = Object.keys(playerObject.choices)[randomIndex];

            this.move = choice;
            this.movesArr.push(choice);
        },
    };

    return Object.assign(playerObject, computerObject);
}