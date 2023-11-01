import { PersonalData } from "../client_data"
import { useState } from "react"
import { isValidClient } from "../../utils"

function submitClient() {

}

export function CreateClient() {

  const [client, setClient] = useState()
  const [errs, setErrs] = useState()

  return (
    <div>
      <h1 className="text-3xl text-white text-center">Complete la información requerida para crear un cliente y su codigo para caragr imagenes</h1>
      <form onSubmit={submitClient}>
        <PersonalData setClient={setClient}/>
      </form>
    </div>
  )
}