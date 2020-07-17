# Trabalho 1 - Inteligência Artificial - Mestrado Profissional

## Tecnologias

  - Node.js (12+)
  - D3.js
  - Charts.js
  - Docker e docker-compose

## Relatório

Para consultar o último relatório gerado pelo autor masta acessar este [link](https://rzorzal.github.io/mestrado_ia_trabalho1/).

Se quiser gerar um novo relatório, siga as instruções de execução via Docker ou siga os passos nas sesões de execução.

Observe que todos os problemas são para encontrar mínimos, então cada algoritmo verifica o resultado da função objetivo sempre buscando o menor valor.

## Docker

Você pode executar este programa somente usando o comando

```terminal
$ docker-compose up
```

Com este comando ele irá gerar uma nova solução para cada problema usando todos os algoritmos. Ao final ele vai disponibilizar um link http://localhost:8080

## Instalação

```terminal
$ npm install
```

## Execução

Existem formas diferentes de executar, cada uma irá te gerar um output diferente. Escolha dependendo da sua necessidade!

### Gerar Relatório

Irá gerar um relatório e servi-lo pelo link http://localhost:8080

```terminal
$ npm run look-report
```

### Compilar Relatório

Irá compilar os arquivos de relatório gerados das soluções, que estão dentro da pasta output (gerada após executar os problemas)

```terminal
$ node report.mjs
```

### Executar todos os problemas

Vai executar todos os problemas para todos os algoritmos.

```terminal
$ npm run all
```

### Executar um problema

Irá gerar soluções para todos os algoritmos e exportá para a pasta output

```terminal
$ npm run [problema1 | problema2 | problema3]
```

### Executar um problema para um algoritmo

Irá gerar soluções um algoritmo para um problema e exportá para a pasta output

#### Básico
```terminal
$ npm start [ag | simulatedAnnealing | hillClimbing | hillClimbingRestart] [problema1 | problema2 | problema3]
```

#### Com número de execuções
```terminal
$ npm start [ag | simulatedAnnealing | hillClimbing | hillClimbingRestart] [problema1 | problema2 | problema3] [número execuções]
```


#### Com arquivos de input
```terminal
$ npm start [ag | simulatedAnnealing | hillClimbing | hillClimbingRestart] [problema1 | problema2 | problema3] [arquivo de input]
```

#### Com número de execuções e arquivos de input
```terminal
$ npm start [ag | simulatedAnnealing | hillClimbing | hillClimbingRestart] [problema1 | problema2 | problema3] [número execuções] [arquivo de input]
```


### Valores Default

Ao executar com Docker ou usando scripts sem parâmetros os valores padrões serão aplicados

|  Parâmetro | Input |
| ------------- | ------------- |
| problema1  | ./input/problema1.txt  |
| problema2  | ./input/problema2.txt  |
| problema3  | ./input/38cities.txt  |
| número execuções  | 10 |


## Arquitetura de pastas

|  Pasta | Descrição |
| ----- | ---------------- |
| docs  | Armazena o relatório gerado  |
| funcoesObjetivo  | Armazena as funções objetivos (Problemas), e funções específicas que os algoritmos precisam para executar, relativa a cada problema.  |
| helpers  | Funções de ajuda no desenvolvimento  |
| heuristicas  | Algoritmos utilizados |
| input  | Arquivos de entrada de dados padrões |
| output  | Saída dos algoritmos. Soluções e gráficos gerados pelo Node.js |
| plot  | Fuções de plot de gráficos para o Node.js |
| views  | Arquivos de geração do relatório |
