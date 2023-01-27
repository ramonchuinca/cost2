import {  v4 as uuidv4 } from 'uuid'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import styles from './Project.module.css'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../Project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../Service/ServiceForm'
import ServiceCard from '../Service/ServiceCard'

function Project() {
  let { id } = useParams()
  const [Project, setProject] = useState([])
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [services, setServices] = useState([])
  const [message, setMessage] = useState('')
  const [type, setType] = useState('success')

  useEffect(() => {
    // Para ver o loading
    setTimeout(
      () =>
        fetch(`http://localhost:5000/Projects/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((resp) => resp.json())
          .then((data) => {
            setProject(data)
            setServices(data.Services)
          }),
      0,
    )
  }, [id])

  function editPost(Project) {
    // budget validation
    if (Project.budget < Project.cost) {
      setMessage('O Orçamento não pode ser menor que o custo do projeto!')
      setType('error')
      return false
    }

    fetch(`http://localhost:5000/projects/${Project.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data)
        setShowProjectForm(!showProjectForm)
        setMessage('Projeto atualizado!')
        setType('success')
      })
  }

  function createService(Project) {
    // last service
    const lastService = Project.services[Project.services.length - 1]

    lastService.id = uuidv4()

    const lastServiceCost = lastService.cost

    const newCost = parseFloat(Project.cost) + parseFloat(lastServiceCost)

    // maximum value validation
    if (newCost > parseFloat(Project.budget)) {
      setMessage('Orçamento ultrapassado, verifique o valor do serviço!')
      setType('error')
      Project.services.pop()
      return false
    }

    // add service cost to project cost total
    Project.cost = newCost

    fetch(`http://localhost:5000/Projects/${Project.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setServices(data.services)
        setShowServiceForm(!showServiceForm)
        setMessage('Serviço adicionado!')
        setType('success')
      })
  }

  function removeService(id, cost) {
    const servicesUpdated = Project.services.filter(
      (service) => service.id !== id,
    )

    const ProjectUpdated = Project

    ProjectUpdated.services = servicesUpdated
    ProjectUpdated.cost = parseFloat(ProjectUpdated.cost) - parseFloat(cost)

    fetch(`http://localhost:5000/projects/${ProjectUpdated.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ProjectUpdated),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(ProjectUpdated)
        setServices(servicesUpdated)
        setMessage('Serviço removido com sucesso!')
      })
  }

  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm)
  }

  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm)
  }

  return (
    <>
      {Project.name ? (
        <div className={styles.Project_details}>
          <Container customClass="column">
            {message && <Message type={type} msg={message} />}
            <div className={styles.details_container}>
              <h1>Projeto: {Project.name}</h1>
              <button className={styles.btn} onClick={toggleProjectForm}>
                {!showProjectForm ? 'Editar projeto' : 'Fechar'}
              </button>
              {!showProjectForm ? (
                <div className={styles.form}>
                  <p>
                    <span>Categoria:</span> {Project.category.name}
                  </p>
                  <p>
                    <span>Total do orçamento:</span> R${Project.budget}
                  </p>
                  <p>
                    <span>Total utilizado:</span> R${Project.cost}
                  </p>
                </div>
              ) : (
                <div className={styles.form}>
                  <ProjectForm
                    handleSubmit={editPost}
                    btnText="Concluir Edição"
                    ProjectData={Project}
                  />
                </div>
              )}
            </div>
            <div className={styles.service_form_container}>
              <h2>Adicione um serviço:</h2>
              <button className={styles.btn} onClick={toggleServiceForm}>
                {!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}
              </button>
              <div className={styles.form}>
                {showServiceForm && (
                  <ServiceForm
                    handleSubmit={createService}
                    btnText="Adicionar Serviço"
                    ProjectData={Project}
                  />
                )}
              </div>
            </div>
            <h2>Serviços:</h2>
            <Container customClass="start">
              {services.length > 0 &&
                services.map((service) => (
                  <ServiceCard
                    id={service.id}
                    name={service.name}
                    cost={service.cost}
                    description={service.description}
                    key={service.id}
                    handleRemove={removeService}
                  />
                ))}
              {services.length === 0 && <p>Não há serviços cadastrados.</p>}
            </Container>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default Project
