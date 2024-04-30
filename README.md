# Backgammon Project

###### Created by Almog Hindi and Yonatan Raz

# Tech Stack
### Frontend
  __React.js__ | __TypeScript__ | __Electron__
### Backend
  __Express.js__ | __Socket.io__ | __Docker__ | __Redis__
### Containerization
  __Docker__ | __Docker-Compose__
### Database
  __MongoDB__

# Main Features
### User authentication and authorization
### User interaction 

![image2](https://github.com/almoghindi/Backgammon/assets/99009434/5a33170a-9d63-409f-b001-fac01f15ed92)

![image](https://github.com/almoghindi/Backgammon/assets/99009434/d036692f-3cd4-4778-bc0a-2bd935955d5d)

 - View other online users
 - Real time chat + notifications
 - Game invitations
 - Real time game
### Game

![image3](https://github.com/almoghindi/Backgammon/assets/99009434/be074df4-91c7-403e-a5be-b1e2c42df6b8)


  - Fully working backgammon game between online users
  - Tracking user score and rank
### Microservices Architecture
 - Microservice for each backend service
 - Containerization with Docker
 - Multi-container management with Docker Compose

## Requirements

1. you should have docker desktop installed to allow the microservices to run.
2. you should also set up your own environment variables in order for the app to function properly.

## Install instructions:

  1. clone repository
  2. set up client:

> root folder

```bash
$ cd talkbackclient
$ npm i
$ npm run dev
```
  3. set up game
  
> root folder

```bash
$ cd Game/Backgammon-React-main
$ npm i
$ npm run dev
```
  4. set up microservices
  
> root folder

```bash
$ cd talkbackserver
$ docker compose build
$ docker compose up
```
