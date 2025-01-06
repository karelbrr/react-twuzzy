import { useParams } from "react-router-dom"


export const ProfileDetails = () => {

    const {id} = useParams()
  return (
    <section>
        <h2>profile details: {id}</h2>
    </section>
  )
}
