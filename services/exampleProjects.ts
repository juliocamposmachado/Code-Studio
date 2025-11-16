import React from 'react';
import { CodeIcon, PythonIcon, CSharpIcon, TypeScriptIcon } from '../components/icons';
import { Files } from '../types';

export interface ExampleProject {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  files: Files;
}

export const exampleProjects: ExampleProject[] = [
  {
    id: 'js-pong',
    name: 'JavaScript Pong',
    description: 'O clássico jogo Pong construído com HTML, CSS e JavaScript puro.',
    icon: CodeIcon,
    files: {
        'index.html': {
            language: 'html',
            content: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Classic Pong</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="start-screen">
      <h1>Classic Pong</h1>
      <input type="text" id="playerNameInput" placeholder="Enter your name" maxlength="12">
      <button id="startButton">Start Game</button>
    </div>
    
    <div class="game-container" style="display: none;">
        <div class="scoreboard">
            <h2 id="playerNameDisplay">Player</h2>
            <h2>Julio</h2>
        </div>
        <canvas id="pongCanvas" width="800" height="400"></canvas>
        <p class="controls">Move your paddle with the mouse.</p>
    </div>

    <script src="script.js"></script>
</body>
</html>
          `.trim(),
          },
          'style.css': {
            language: 'css',
            content: `
      body {
        font-family: 'Courier New', Courier, monospace;
        background-color: #1a1a1a;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        text-align: center;
      }
      #start-screen {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
      }
      h1 {
        font-size: 3rem;
        text-transform: uppercase;
        letter-spacing: 5px;
        margin-bottom: 1rem;
      }
      #playerNameInput {
        background-color: #333;
        border: 2px solid #fff;
        color: #fff;
        padding: 10px 15px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1.2rem;
        text-align: center;
        width: 250px;
        outline: none;
      }
      #playerNameInput::placeholder {
        color: #888;
      }
      #startButton {
        background-color: transparent;
        border: 2px solid #fff;
        color: #fff;
        padding: 10px 20px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1.2rem;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      #startButton:hover {
        background-color: #fff;
        color: #000;
      }
      .game-container {
          display: flex;
          flex-direction: column;
          align-items: center;
      }
      .scoreboard {
        display: flex;
        justify-content: space-between;
        width: 100%;
        max-width: 800px; /* Match canvas width */
        padding: 0 20px;
        box-sizing: border-box;
        margin-bottom: 1rem;
      }
      .scoreboard h2 {
        font-size: 1.5rem;
        text-transform: uppercase;
        width: 45%;
        text-align: center;
      }
      canvas {
        background-color: #000;
        border: 2px solid #fff;
        cursor: none; /* Hide cursor over canvas */
      }
      .controls {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #aaa;
      }
          `.trim(),
          },
          'script.js': {
            language: 'javascript',
            content: `
      const canvas = document.getElementById('pongCanvas');
      const ctx = canvas.getContext('2d');
      
      // UI Elements
      const startScreen = document.getElementById('start-screen');
      const playerNameInput = document.getElementById('playerNameInput');
      const startButton = document.getElementById('startButton');
      const gameContainer = document.querySelector('.game-container');
      const playerNameDisplay = document.getElementById('playerNameDisplay');
      
      let playerName = "Player";
      
      // Game constants
      const PADDLE_WIDTH = 10;
      const PADDLE_HEIGHT = 100;
      const BALL_RADIUS = 10;
      const WINNING_SCORE = 5;
      
      // Player paddle
      const player = {
        x: 0,
        y: canvas.height / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        score: 0,
      };
      
      // Computer paddle
      const computer = {
        x: canvas.width - PADDLE_WIDTH,
        y: canvas.height / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        score: 0,
        name: "Julio"
      };
      
      // Ball
      const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: BALL_RADIUS,
        speed: 5,
        velocityX: 5,
        velocityY: 5,
      };
      
      // --- Drawing functions ---
      function drawRect(x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
      }
      
      function drawCircle(x, y, r, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
      }
      
      function drawText(text, x, y, color) {
        ctx.fillStyle = color;
        ctx.font = '45px "Courier New"';
        ctx.fillText(text, x, y);
      }
      
      function drawNet() {
        for (let i = 0; i < canvas.height; i += 15) {
          drawRect(canvas.width / 2 - 1, i, 2, 10, "white");
        }
      }
      
      // --- Game Logic ---
      canvas.addEventListener('mousemove', movePaddle);
      
      function movePaddle(evt) {
        let rect = canvas.getBoundingClientRect();
        player.y = evt.clientY - rect.top - player.height / 2;
      
        if (player.y < 0) player.y = 0;
        if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
      }
      
      function collision(b, p) {
        b.top = b.y - b.radius;
        b.bottom = b.y + b.radius;
        b.left = b.x - b.radius;
        b.right = b.x + b.radius;
      
        p.top = p.y;
        p.bottom = p.y + p.height;
        p.left = p.x;
        p.right = p.x + p.width;
      
        return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
      }
      
      function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speed = 5;
        ball.velocityX = -ball.velocityX;
      }
      
      function update() {
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
      
        computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.1;
      
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
          ball.velocityY = -ball.velocityY;
        }
      
        let activePaddle = (ball.x < canvas.width / 2) ? player : computer;
        if (collision(ball, activePaddle)) {
          let collidePoint = (ball.y - (activePaddle.y + activePaddle.height / 2)) / (activePaddle.height / 2);
          let angleRad = (Math.PI / 4) * collidePoint;
          let direction = (ball.x < canvas.width / 2) ? 1 : -1;
          ball.velocityX = direction * ball.speed * Math.cos(angleRad);
          ball.velocityY = ball.speed * Math.sin(angleRad);
          ball.speed += 0.5;
        }
      
        if (ball.x - ball.radius < 0) {
          computer.score++;
          resetBall();
        } else if (ball.x + ball.radius > canvas.width) {
          player.score++;
          resetBall();
        }
      }
      
      function render() {
        drawRect(0, 0, canvas.width, canvas.height, 'black');
        drawNet();
        drawText(player.score, canvas.width / 4, canvas.height / 5, 'white');
        drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5, 'white');
        drawRect(player.x, player.y, player.width, player.height, 'white');
        drawRect(computer.x, computer.y, computer.width, computer.height, 'white');
        drawCircle(ball.x, ball.y, ball.radius, 'white');
      }
      
      function gameLoop() {
        if (player.score < WINNING_SCORE && computer.score < WINNING_SCORE) {
          update();
          render();
          requestAnimationFrame(gameLoop);
        } else {
          drawRect(0, 0, canvas.width, canvas.height, 'black');
          let winner = player.score > computer.score ? playerName + ' Wins!' : computer.name + ' Wins!';
          ctx.fillStyle = "white";
          ctx.font = "50px 'Courier New'";
          ctx.textAlign = "center";
          ctx.fillText(winner, canvas.width / 2, canvas.height / 2);
        }
      }
      
      // --- Start Game ---
      function startGame() {
          playerName = playerNameInput.value.trim() || "Player";
          playerNameDisplay.textContent = playerName;
          
          startScreen.style.display = 'none';
          gameContainer.style.display = 'flex';
          
          requestAnimationFrame(gameLoop);
      }
      
      startButton.addEventListener('click', startGame);
      playerNameInput.addEventListener('keypress', function(event) {
          if (event.key === 'Enter') {
              event.preventDefault(); // prevent form submission if it's in a form
              startGame();
          }
      });
          `.trim(),
          },
    },
  },
  {
    id: 'python-flask',
    name: 'Python Flask API',
    description: 'Um servidor de API RESTful simples usando Flask que responde com uma mensagem JSON.',
    icon: PythonIcon,
    files: {
      'app.py': {
        language: 'python',
        content: `
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Servidor Flask está rodando! Acesse /api/hello para ver o JSON."

@app.route('/api/hello')
def hello_api():
    return jsonify(message="Olá do servidor Flask!", author="Julio")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
        `.trim(),
      },
      'README.md': {
        language: 'markdown',
        content: `
# Servidor de API Flask Simples

Este é um projeto de exemplo para um servidor de API básico construído com Flask.

## Como usar

1.  Use o terminal para instalar as dependências: \`pip install Flask\`
2.  Execute o servidor: \`python app.py\`
3.  O servidor estará disponível em \`http://localhost:5000\`.

## Endpoints

-   \`/api/hello\`: Retorna uma mensagem JSON de boas-vindas.
        `.trim(),
      },
    },
  },
  {
    id: 'csharp-console',
    name: 'C# Console App',
    description: 'Uma aplicação de console .NET que imprime uma mensagem e realiza um cálculo simples.',
    icon: CSharpIcon,
    files: {
      'Program.cs': {
        language: 'csharp',
        content: `
using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Olá do C# Console App!");

            int a = 5;
            int b = 10;
            int sum = Add(a, b);

            Console.WriteLine($"A soma de {a} e {b} é {sum}.");
        }

        public static int Add(int num1, int num2)
        {
            return num1 + num2;
        }
    }
}
        `.trim(),
      },
      'HelloWorld.csproj': {
        language: 'xml',
        content: `
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

</Project>
        `.trim(),
      },
    },
  },
   {
    id: 'ts-sorter',
    name: 'TypeScript Sorter',
    description: 'Um script TypeScript que define uma interface e ordena um array de objetos.',
    icon: TypeScriptIcon,
    files: {
      'index.ts': {
        language: 'typescript',
        content: `
interface User {
  id: number;
  name: string;
  age: number;
}

const users: User[] = [
  { id: 3, name: "Alice", age: 30 },
  { id: 1, name: "Bob", age: 25 },
  { id: 2, name: "Charlie", age: 35 },
];

function sortUsersById(userList: User[]): User[] {
  return [...userList].sort((a, b) => a.id - b.id);
}

const sortedUsers = sortUsersById(users);

console.log("Usuários Originais:", users);
console.log("Usuários Ordenados por ID:", sortedUsers);
        `.trim(),
      },
      'tsconfig.json': {
        language: 'json',
        content: `
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
        `.trim(),
      },
    },
  },
];