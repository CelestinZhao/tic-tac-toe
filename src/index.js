import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function chargeWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i=0; i<lines.length; i++) {
        let [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner: squares[a], line: lines[i]};
        }
    }
    return null;
}

function Square(props) {
    let {value, onClick, style} = props;

    return (
        <button className="square" onClick={onClick} style={style}>
            {value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        const {squares, onClick, line} = this.props
        return (
            <Square
                value={squares[i]}
                onClick={() => onClick(i)}
                style={(line || []).includes(i) ? {backgroundColor: 'aquamarine'} : null}
            />
        );
    }

    createSquare(row, col) {
        const squares = [];
        let index = 0;
        for (let i=0; i<row; i++) {
            const rowSquares = [];
            for (let j=0; j<col; j++) {
                const square = this.renderSquare(index);
                rowSquares.push(square);
                index += 1;
            }
            squares.push(
                <div className="board-row">
                    {rowSquares}
                </div>
            )
        }
        return squares;
    }

    render() {
        return (
            <div>
                {this.createSquare(3,3)}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [Array(9).fill(null)],
            isNext: true,
            step: 0,
            position: [],
        }
    }

    jumpTo(i, winner) {
        const {history} = this.state;
        if ((winner || history.length === 10) && i === 0) {
            this.setState({
                history: history.slice(0,i+1)
            })
        }
        this.setState({
            step: i,
            isNext: (i % 2) === 0,
        });
    }

    handleClick(i) {
        let {history, isNext, step, position} = this.state;
        let currentPosition;
        if (step < position.length) {
            position[step] = [i%3+1,Math.floor(i/3)+1];
            currentPosition = position;
        } else {
            currentPosition = position.concat([[i%3+1,Math.floor(i/3)+1]]);
        }
        let newHistory = history.slice(0, step+1)
        let current = newHistory[newHistory.length - 1];
        let squares = current.slice();
        if (chargeWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = isNext ? 'X' : 'O';
        this.setState({
            history: newHistory.concat([squares]),
            isNext: !isNext,
            step: newHistory.length,
            position: currentPosition
        });
    }

    render() {
        const {history, isNext, step, position} = this.state;
        const current = history[step];
        const {winner, line} = chargeWinner(current) || {};
        const moves = history.map((i, index) => {
            let desc;
            if (index === 0) {
                if (history.length === 10 || winner) {
                    desc = "重新开始";
                } else {
                    desc = "开始游戏";
                }
            } else {
                desc = `移动到步骤（${index}）`;
            }
            return (
                <li key={index}>
                    {
                        parseInt(index) === step ?
                            <div style={{fontSize: '20px'}}>
                                <button onClick={() => this.jumpTo(index, winner)}><b>{desc}</b></button>
                                {index ? <span>{`  当前坐标为：(${position[index-1][0]},${position[index-1][1]})`}</span> : null}
                            </div>:
                            <div style={{fontSize: '20px'}}>
                                <button onClick={() => this.jumpTo(index, winner)}>{desc}</button>
                                {index ? <span>{`  当前坐标为：(${position[index-1][0]},${position[index-1][1]})`}</span> : null}
                            </div>
                    }
                </li>
            );
        });

        let status;
        if (winner) {
            status = `获胜者是${winner}！`;
        } else if (history.length === 10) {
            status = '平局！';
        } else {
            status = `下一步是${isNext ? 'X' : 'O'}`;
        }
        return (
            <div>
                <div className="game-board">
                    <Board
                        squares={current}
                        line={line}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div style={{fontSize: '20px'}}>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
