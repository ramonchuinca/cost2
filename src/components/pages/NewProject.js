import { useHistory } from 'react-router-dom'

import ProjectForm from '../Project/ProjectForm'

import styles from './NewProject.module.css'

function NewProject() {
  const history = useHistory()

  function createPost(Project) {
    // initialize cost and services
    Project.cost = 0
    Project.services = []

    fetch('http://localhost:5000/Projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        history.push('/Projects', { message: 'Projeto criado com sucesso!' })
      })
  }

  return (
    <div className={styles.Newproject_Container}>
      <h1>Criar Projeto</h1>
      <p>Crie seu projeto para depois adicionar os serviços</p>
      <ProjectForm handleSubmit={createPost} btnText="Criar Projeto" />
    </div>
  )
}

export default NewProject