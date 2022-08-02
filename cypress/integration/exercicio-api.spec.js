/// <reference types="cypress" />
import usuariosSchema from '../contracts/usuarios.contract';
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('tam@qa.com.br', 'teste').then(tkn => { token = tkn })
     });

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "Edileuza",
                    "email": "edi_testeqa@teste.com",
                    "password": "teste",
                    "administrador": "true"
               },
               headers: { authorization: token }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it.only('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[0]._id

               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
                    body:
                    {
                         "nome": 'Edson',
                         "email":'pedro@teste.com',
                         "password": 'teste',
                         "administrador": "true"
                    }
               }).then(response => {
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[0]._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
                    headers: { authorization: token }
               }).then(response => {
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
               })
          })
     })
})
