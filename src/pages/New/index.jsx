import { api } from '../../services/api';

import { Textarea } from '../../components/Textarea';
import { NoteItem} from '../../components/NoteItem';
import { Section } from '../../components/Section';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useNavigate } from 'react-router-dom';
import { Container, Form } from './styles';
import { Link } from 'react-router-dom';
import { useState } from 'react';


export function New() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");


  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const navigate = useNavigate();

  function handleAddLink(){
    setLinks(prevState => [...prevState, newLink]);
    setNewLink("");

  }

  function handleRemoveLink(LinkDeleted){
    setLinks(prevState => prevState.filter(link => link !== LinkDeleted));

  }

  function handleAddTag(){
    setTags(prevState => [...prevState, newTag]);
    setNewTag("");
  }

  function handleRemoveTag(deleted){
    setTags(prevState => prevState.filter(tag => tag !== deleted))
  }

  async function handleNewNote(){
    if(newTag || newLink){
      return alert('adicione o link/nota preenchido')
    }
    try{
    await api.post("/notes", {
      title,
      description,
      tags,
      links
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("@rocketnotes:token")}`
      }
  });

  alert("Nota cadastrada com sucesso!")
  navigate('/')

  }catch(error){
    if(error.response){
      alert(error.response.data.message);
    }
    else{
      alert('não foi possível cadastrar a nota.')
    }
  }
    
  }

  return (
    <Container>
      <Header />

      <main>
        <Form>
          <header>
            <h1>Criar nota</h1>
            <Link to="/">voltar</Link>
          </header>

          <Input 
          placeholder="Título"
          onChange={e => setTitle(e.target.value)}
          />
          <Textarea 
          placeholder="Observações" 
          onChange={e => setDescription(e.target.value)}
          />

          <Section title="Links úteis">
            {
              links.map((link, index) => (
                <NoteItem 
                key={String(index)}
                value={link}
                onClick={() => handleRemoveLink(link)}
            />
              ))
            }

            <NoteItem 
            isNew 
            placeholder="Novo Link"
            value={newLink}
            onChange={e => setNewLink(e.target.value)}
            onClick={handleAddLink}
            />

          </Section>

          <Section title="Marcadores">
            <div className="tags">
              {
                tags.map((tag, index) => (
                  <NoteItem 
                  key={String(index)}
                  value={tag}
                  onClick={() => {handleRemoveTag(tag)}}
                  />
                ))
              
              }
              <NoteItem isNew 
              placeholder="Nova tag"
              onChange={e => setNewTag(e.target.value)}
              onClick={handleAddTag}
              />
            </div>
          </Section>

          <Button title="Salvar"
          onClick={handleNewNote}
          /> 
        </Form>
      </main>
    </Container>
  )
}