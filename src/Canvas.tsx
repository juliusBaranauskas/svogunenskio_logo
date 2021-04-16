import React, { useEffect, useRef, useState } from 'react';

type Props = {
    background_color: string;
}

type Position = {
    posX: number;
    posY: number;
    dir: number; // 0 - 360 degrees
}

const turtleSize: number = 50;

let paintColor = 'black';

let lineType: string = 'plain';

export const Canvas: React.FC<Props> = ({background_color}) => {
    
    const paintingCanvas = useRef(() => document.getElementById('paintingCanvas') as HTMLCanvasElement);

    const turtleCanvas = useRef(() => document.getElementById('drawingTurtleCanvas') as HTMLCanvasElement);

    const turtleCtx = useRef(() => turtleCanvas.current().getContext('2d'));
    
    const paintingCtx = useRef(() => paintingCanvas.current().getContext('2d'));

    const [pos, setPos] = useState({ posX: (paintingCanvas.current()?.width ?? 1000)/2, posY: (paintingCanvas.current()?.height ?? 500)/2, dir: 0});
    
    const [commandHistory, setCommandHistory] = useState('');

    const [onionImg, setOnionImg] = useState<HTMLImageElement | undefined>(undefined);

    useEffect(() => {
        setPos({ posX: (paintingCanvas.current()?.width)/2, posY: (paintingCanvas.current()?.height)/2, dir: 0});
    }, [paintingCanvas])


    useEffect(() => {
        var imageObj = new Image();
        imageObj.onload = () => {
            setOnionImg(imageObj);
            return imageObj;
        }
        imageObj.src = 'http://cookfiction.com/static/img/ingredients/onion.png';
    }, []);

    document.addEventListener("keyup", event => {
        event.stopImmediatePropagation();
        if (event.code === 'Enter') {
            executeCommand();
        }
    });


    useEffect(() => {
        const canvasTurtle = turtleCanvas.current();
        const ctxTurtle = turtleCtx.current();
        if (ctxTurtle) {
            ctxTurtle.clearRect(-canvasTurtle.width, -canvasTurtle.height, 2*canvasTurtle.width, 2*canvasTurtle.height);
            if (onionImg)
                ctxTurtle.drawImage(onionImg, pos.posX - turtleSize/2, pos.posY, turtleSize, turtleSize);
            console.log('repainted turtu');
        }
    }, [pos, onionImg]);

    const showInvalidCmdTip = () => {
        alert('invalid command, click HELP to see cmd list');
    }

    const executeCommand = () => {
        const cmdText = (document.getElementById('commandInput') as HTMLInputElement).value;

        if (!cmdText) {
            showInvalidCmdTip();
            return;
        }

        setCommandHistory(cmdText + '\n' + commandHistory);

        if (cmdText.startsWith('pirmyn')) {
            const steps = cmdText.substr(6);
            const stepsInt = Number.parseInt(steps);

            const ctx = paintingCtx.current();
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(pos.posX, pos.posY);
                ctx.lineTo(pos.posX, pos.posY - stepsInt);
                console.log("current color " + paintColor);
                ctx.strokeStyle = paintColor;
                ctx.stroke();
                ctx.closePath();

                console.log(pos);
                const newPos: Position = {
                    posX: pos.posX,
                    posY: pos.posY-stepsInt,
                    dir: 0
                };
                setPos(newPos);
                console.log(pos);
                console.log(stepsInt);
            }
            else {
                showInvalidCmdTip();
            }
        }
        if (cmdText.startsWith('kairėn') || cmdText.startsWith('kairen')) {
            const degrees = cmdText.substr(6);
            const degreesInt = Number.parseInt(degrees);

            const ctx = turtleCtx.current();
            if (ctx) {

                ctx.translate(pos.posX, pos.posY);
                ctx.rotate((360-degreesInt)*Math.PI/180);
                paintingCtx.current()?.translate(pos.posX, pos.posY);
                paintingCtx.current()?.rotate((360-degreesInt)*Math.PI/180);
                setPos({posX: 0, posY: 0, dir: degreesInt});
            }
            else {
                showInvalidCmdTip();
            }
        }
        if (cmdText.startsWith('dešinėn') || cmdText.startsWith('desinen')) {
            const degrees = cmdText.substr(8);
            const degreesInt = Number.parseInt(degrees);

            const ctx = turtleCtx.current();
            if (ctx) {

                ctx.translate(pos.posX, pos.posY);
                ctx.rotate(degreesInt*Math.PI/180);
                paintingCtx.current()?.translate(pos.posX, pos.posY);
                paintingCtx.current()?.rotate(degreesInt*Math.PI/180);
                setPos({posX: 0, posY: 0, dir: degreesInt});
            }
            else {
                showInvalidCmdTip();
            }
        }
        if (cmdText.startsWith('namo')) {
            // setPos({ posX: (paintingCanvas.current()?.width-turtleSize)/2, posY: (paintingCanvas.current()?.height-turtleSize)/2, dir: 0});    
        }
        if (cmdText.startsWith('spalva')) {
            paintColor = cmdText.substr(7);
        }
        if (cmdText.startsWith('storis')) {

        }
    }

    useEffect(() => {
        const canvas = paintingCanvas.current();
        const ctx = paintingCtx.current();
        if (ctx) {
            ctx.fillStyle = background_color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [background_color])

    const showHelp = () => {
        const helpTxt =
        `Commands available:

         pirmyn {step count as an integer number}
         desinen {degrees}
         kairen {degrees}
         spalva {any color keyword or hex value from https://developer.mozilla.org/en-US/docs/Web/CSS/color_value }`;
        
         alert(helpTxt);
    }

    return (
        <>
            <div className="paintArea">
                <div id='viewport'>
                    <canvas width="1000" height="500" id="paintingCanvas"/>
                    <canvas width="1000" height="500" id="drawingTurtleCanvas"/>
                </div>
            </div>
            <input type="text" id='commandInput'/>
            <input type="submit" value="HELP" onClick={showHelp}/>
            <br/>
            <input type="submit" value="Daryk" onClick={executeCommand}/>
            <p className="cmdHistory">
                {
                    commandHistory
                }
            </p>
        </>
    )
}