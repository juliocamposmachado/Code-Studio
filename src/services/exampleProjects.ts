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
    description: 'Um exemplo fullstack simples com um frontend que chama uma API backend em Flask.',
    icon: PythonIcon,
    files: {
      'index.html': {
        language: 'html',
        content: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flask API Frontend</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Frontend para API Flask</h1>
        <p>Clique no botão para fazer uma chamada para o endpoint <code>/api/hello</code> do backend.</p>
        <button id="callApiButton">Chamar API</button>
        <h2>Resposta:</h2>
        <div id="response-container">
            <pre>Aguardando chamada da API...</pre>
        </div>
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
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #1e1e1e;
    color: #d4d4d4;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}
.container {
    text-align: center;
    background-color: #252526;
    padding: 2rem 3rem;
    border-radius: 8px;
    border: 1px solid #333;
    max-width: 600px;
}
h1 {
    color: #569cd6;
    margin-top: 0;
}
p {
    color: #9cdcfe;
}
code {
    background-color: #3a3d41;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: "Fira Code", "Courier New", monospace;
}
button {
    background-color: #0e639c;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    margin: 1.5rem 0;
    transition: background-color 0.2s ease;
}
button:hover {
    background-color: #1177bb;
}
#response-container {
    background-color: #1e1e1e;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 1rem;
    text-align: left;
    min-height: 50px;
    white-space: pre-wrap;
    word-break: break-all;
}
          `.trim(),
      },
      'script.js': {
          language: 'javascript',
          content: `
document.addEventListener('DOMContentLoaded', () => {
    const callApiButton = document.getElementById('callApiButton');
    const responseContainer = document.querySelector('#response-container pre');

    callApiButton.addEventListener('click', async () => {
        responseContainer.textContent = 'Chamando API...';

        // Em um ambiente de desenvolvimento real, o servidor Flask estaria
        // rodando em http://127.0.0.1:5000
        const apiUrl = 'http://127.0.0.1:5000/api/hello';

        try {
            // A chamada abaixo falhará no ambiente de pré-visualização por duas razões:
            // 1. O servidor Python/Flask não está realmente em execução.
            // 2. Política de mesma origem (CORS) impediria a chamada do navegador.
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
            }

            const data = await response.json();
            responseContainer.textContent = JSON.stringify(data, null, 2);

        } catch (error) {
            console.error('Erro ao chamar a API:', error);
            responseContainer.textContent = \`Erro ao chamar a API: \${error.message}\\n\\nIsso é esperado no ambiente de pré-visualização. Para funcionar, você precisaria executar o arquivo 'app.py' em seu terminal local ('python app.py') e abrir este frontend em um navegador com permissões de CORS.\`;
        }
    });
});
          `.trim(),
      },
      'app.py': {
        language: 'python',
        content: `
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Habilitar CORS para permitir que o frontend faça requisições
CORS(app)

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
# Exemplo Fullstack: Frontend + API Flask

Este é um projeto de exemplo para uma aplicação web com um frontend simples que consome uma API básica construída com Flask.

## Como usar

1.  **Backend:** No terminal, instale as dependências: \`pip install Flask Flask-Cors\`
2.  **Backend:** Execute o servidor: \`python app.py\`
3.  **Frontend:** O servidor de backend estará disponível em \`http://localhost:5000\`. Abra o \`index.html\` no seu navegador (ou use a "Live Preview") para interagir com a API.

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