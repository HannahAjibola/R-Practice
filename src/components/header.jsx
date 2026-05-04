import "./header.css"
const Header =()=> {
  return(
      <header>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#stack">Stack</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>
  )
}

const About =()=>{
  return(
    <section className="about">
      <h2 className="aboutTitle">About me</h2>
      <p className="aboutText">Hi i'm Hannah <br /> I'm a frontend developer Currently building web application </p>

      <h3 className="aboutContent">What i do</h3>
      <ul className="aboutList">
        <li>Frontend development with React</li>
        <li>Responsive web design</li>
        <li>UI/UX design</li>
      </ul>
    </section>
  )
}


export default About;