
import {MoveLeft} from "lucide-react"
import {Link} from "react-router-dom"

function TopBar({path}) {
  return (
    <div
    className="w-full p-2.5 border-2 border-transparent border-b-primary/30"
    ><Link className="flex gap-2.5" to={path}><MoveLeft /> <h3>{path}</h3>
    </Link></div>
    )
}


export default TopBar