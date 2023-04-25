const express = require ('express');
const bodyParser = require ('body-parser')
const connection = require ('./database/database')
const Pergunta = require ('./database/Pergunta')
const Resposta = require('./database/Resposta')
const app = express();

//database
connection
    .authenticate()
    .then(() => {
        console.log("Connection success!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

app.set("view engine", "ejs")//diz para o express usar o ejs para criar o html
app.use(express.static('public'));//adiciona arquivos estáticos a aplicação 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (request, response) =>{
  Pergunta.findAll({ raw: true, order: [
    ['id', 'DESC']
  ] }).then(perguntas => {
    response.render("index", {
      perguntas: perguntas
    });
  });
});

app.get("/perguntar", (request, response) => {
  response.render("perguntar")
})

app.post("/salvarPergunta", (request, response) => {
  var titulo = request.body.titulo;
  var descricao = request.body.descricao;

  Pergunta.create({
      titulo: titulo,
      descricao: descricao
  }).then(() => {
      response.redirect("/");
  });
})

app.get("/pergunta/:id",(req ,res) => {
  var id = req.params.id;
  Pergunta.findOne({
      where: {id: id}
  }).then(pergunta => {
      if(pergunta != undefined){ // Pergunta encontrada

          Resposta.findAll({
              where: {perguntaId: pergunta.id},
              order:[ 
                  ['id','DESC'] 
              ]
          }).then(respostas => {
              res.render("pergunta",{
                  pergunta: pergunta,
                  respostas: respostas
              });
          });

      }else{ // Não encontrada
          res.redirect("/");
      }
  });
})

app.post("/responder", (request, response) => {
  var corpo = request.body.corpo;
  var perguntaId = request.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    response.redirect("/pergunta/"+perguntaId);
  });
});

app.listen(3333, () => {
  console.log("server is running")
});