import { Link, Outlet } from "react-router-dom";
import "./header.css";
// import "./about"
const Header =()=> {
  return(
      <div>
        <nav>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/stack">Stack</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
        <Outlet />
      </div>
  )
}



export default Header;