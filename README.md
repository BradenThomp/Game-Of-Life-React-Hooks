## About
The Game Of Life is a zero player, cellular automaton created by mathemetician John Conway.  

### Rules
1) Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2) Any live cell with two or three live neighbours lives on to the next generation.
3) Any live cell with more than three live neighbours dies, as if by overpopulation.
4) Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

### Purpose
The purpose of this project was to learn functional React and Hooks.  React was probably not the best tool to implement The Game Of Life, but this was intentional.  By using tools like React for unintended purposes, I believe one gains a greater understanding of the limits of the tool including what does and does not work well.  If one is strictly trying to implement the Game Of Life without imposing restrictions on themselves (such as using hooks as a requirement), a simple game loop would be a much better solution.

## Demo
[![Conway's Game Of Life With React Hooks](http://img.youtube.com/vi/hGrzTAmNfoc/0.jpg)](http://www.youtube.com/watch?v=hGrzTAmNfoc "Conway's Game Of Life With React Hooks")

## Installation
Clone the repo:
```bash
git clone https://github.com/BradenThomp/Game-Of-Life-React-Hooks.git
```

## Usage
1. Run with: ```bash npm start```
2. In your browser of choice, navigate to http://localhost:3000/.
