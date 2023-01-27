import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import Container from '../layout/Container'
import Loading from '../layout/Loading'

import LinkButton from '../layout/LinkButton'
import ProjectCard from '../Project/ProjectCard'
import Message from '../layout/Message'

import styles from './Projects.module.css'

function Projects() {
  const [projects, setProjects] = useState([])
  const [removeLoading, setRemoveLoading] = useState(false)
  const [projectMessage, setProjectMessage] = useState('')

  const location = useLocation()
  let message = ''
  if (location.state) {
    message = location.state.message
  }

  useEffect(() => {
    // Para ver o loading
    setTimeout(
      () =>
        fetch('http://localhost:5000/Projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((resp) => resp.json())
          .then((data) => {
            setProjects(data)
            setRemoveLoading(true)
          }),
      100,
    )
  }, [])

  function removeProject(id) {
    fetch(`http://localhost:5000/Projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProjects(Projects.filter((Project) => Project.id !== id))
        setProjectMessage('Projeto removido com sucesso!')
      })
  }

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/NewProject" text="Criar projeto" />
      </div>
      {message && <Message type="success" msg={message} />}
      {projectMessage && <Message type="success" msg={projectMessage} />}
      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((Project) => (
            <ProjectCard
              id={Project.id}
              name={Project.name}
              budget={Project.budget}
              category={Project.category.name}
              key={Project.id}
              handleRemove={removeProject}
            />
          ))}
        {!removeLoading && <Loading />}
        {removeLoading && Projects.length === 0 && (
          <p>Não há projetos cadastrados!</p>
        )}
      </Container>
    </div>
  )
}

export default Projects