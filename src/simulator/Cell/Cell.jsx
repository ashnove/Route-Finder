import React, {Component} from 'react';
import './Cell.css';

export default class Cell extends Component {
    render() {
        const {col, row, isEnd, isStart, isWall, onMouseDown, onMouseEnter, onMouseUp} = this.props;
        let extraClassName = '';
        if(isEnd) extraClassName = 'end-cell';
        if(isStart) extraClassName = 'start-cell';
        if(isWall) extraClassName = 'wall-cell';

        return (
            <div
                id={`cell-${row}-${col}`}
                className={`cell ${extraClassName}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}>
            </div>
        );
    }
}
