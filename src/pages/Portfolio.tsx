import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Portfolio.css';

const Portfolio: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  return (
    <div className="portfolio-container">
      {/* Mobile nav toggle button */}
      <i className="bi bi-list mobile-nav-toggle d-xl-none"></i>

      {/* Header */}
      <header id="header">
        <div className="d-flex flex-column">
          <div className="profile">
            <img src="/assets/img/profile-img.jpg" alt="" className="img-fluid rounded-circle" />
            <h1 className="text-light"><Link to="/">Abe Pasion</Link></h1>
            <div className="social-links mt-3 text-center">
              <a href="https://github.com/Pasionfruit" className="github" target="_blank" rel="noopener noreferrer"><i className="bx bxl-github"></i></a>
              <a href="https://www.linkedin.com/in/abe-pasion/" className="linkedin" target="_blank" rel="noopener noreferrer"><i className="bx bxl-linkedin"></i></a>
            </div>
          </div>

          <nav id="navbar" className="nav-menu navbar">
            <ul>
              <li><a href="#hero" className="nav-link scrollto active"><i className="bx bx-home"></i> <span>Home</span></a></li>
              <li><a href="#about" className="nav-link scrollto"><i className="bx bx-user"></i> <span>About</span></a></li>
              <li><a href="#resume" className="nav-link scrollto"><i className="bx bx-file-blank"></i> <span>Experience</span></a></li>
              <li><a href="#portfolio" className="nav-link scrollto"><i className="bx bx-book-content"></i> <span>Projects</span></a></li>
              <li><a href="#contact" className="nav-link scrollto"><i className="bx bx-envelope"></i> <span>Contact</span></a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Recipe Book Button */}
      <div className="recipe-book-button">
        <Link to="/recipes" className="btn btn-primary">
          <i className="bx bx-book"></i> Recipe Book
        </Link>
      </div>

      {/* Hero Section */}
      <section id="hero" className="d-flex flex-column justify-content-center align-items-center">
        <div className="hero-container" data-aos="fade-in">
          <h1>Hello World!</h1>
          <h1>I'm Abe Pasion</h1>
          <p>I'm <span className="typed" data-typed-items="a Software Engineer, a Problem Solver, an Adventurer, a Cat Dad, a Seminole"></span></p>
        </div>
      </section>

      <main id="main">
        {/* About Section */}
        <section id="about" className="about">
          <div className="container">
            <div className="section-title">
              <h2>About</h2>
              <p>
                Hi, I'm Abe Pasion, a recent Florida State University graduate with a strong background in cybersecurity and a keen interest in software engineering. I am eager to gain practical experience and make meaningful contributions in software engineering roles.
                <br /><br />
                During my time at FSU, I have tutored individuals, created a multitude of projects, and honed my problem-solving and technical skills, earning the opportunity to intern in the cybersecurity field.
                <br /><br />
                Now, as I am transitioning into web development and software engineering roles, I am working on a tracking website and reviewing AI code outputs at Outlier. With these projects, I hope to make an impact by allowing people to properly utilize AI and technology.
                <br /><br />
                Thank you for visiting my profile. I look forward to connecting with like-minded professionals and exploring exciting opportunities in the tech industry.
              </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="skills section-bg">
          <div className="container">
            <div className="section-title">
              <h2>Languages, Frameworks, and Tools</h2>
            </div>

            <div className="icon-row">
              <div className="icon"><img src="/assets/img/python_icon.png" alt="Python Icon" /></div>
              <div className="icon"><img src="/assets/img/java_icon.png" alt="Java Icon" /></div>
              <div className="icon"><img src="/assets/img/C_icon.png" alt="C Icon" /></div>
              <div className="icon"><img src="/assets/img/js_icon.png" alt="JS Icon" /></div>
              <div className="icon"><img src="/assets/img/C2_icon.png" alt="CSharp Icon" /></div>
            </div>

            <div className="icon-row">
              <div className="icon"><img src="/assets/img/ts_icon.png" alt="TypeScript Icon" /></div>
              <div className="icon"><img src="/assets/img/node_icon.png" alt="Node Icon" /></div>
              <div className="icon"><img src="/assets/img/EX_icon.png" alt="Express Icon" /></div>
              <div className="icon"><img src="/assets/img/React_icon.png" alt="React Icon" /></div>
              <div className="icon"><img src="/assets/img/TWCSS_icon.png" alt="TailWind Icon" /></div>
            </div>

            <div className="icon-row">
              <div className="icon"><img src="/assets/img/Git_icon.png" alt="Git Icon" /></div>
              <div className="icon"><img src="/assets/img/Unix_icon.png" alt="Unix Icon" /></div>
              <div className="icon"><img src="/assets/img/Linux_icon.png" alt="Linux Icon" /></div>
              <div className="icon"><img src="/assets/img/Azure_icon.png" alt="Azure Icon" /></div>
              <div className="icon"><img src="/assets/img/SonarQube_icon.png" alt="SonarQube Icon" /></div>
            </div>
          </div>
        </section>

        {/* Resume Section */}
        <section id="resume" className="resume">
          <div className="container">
            <div className="section-title">
              <h2>Experience</h2>
            </div>
            <div className="row">
              <div className="col-lg-6" data-aos="fade-up" data-aos-delay="75">
                <h3 className="resume-title">Professional Experience</h3>
                <div className="resume-item">
                  <h4>LLM Quality Assurance Specialist</h4>
                  <p><em>Outlier AI</em></p>
                  <h5>June 2024 - Current</h5>
                  <ul>
                    <li>Evaluating and providing feedback on language model outputs related to Python programming, ensuring accuracy and clarity</li>
                    <li>Assisting in improving the quality of educational content by identifying and suggesting enhancements to prompt responses</li>
                  </ul>
                </div>

                <div className="resume-item">
                  <h4>Software Technology Intern (Cybersecurity focus)</h4>
                  <p><em>Florida State University, Tallahassee, FL</em></p>
                  <h5>Sept 2023 - May 2024</h5>
                  <ul>
                    <li>Developed and implemented security procedures aligned with NIST 800-53 and FedRamp guidelines</li>
                    <li>Conducted security assessments of Azure and Alert Logic environments, focusing on endpoint and MDR agent roles</li>
                    <li>Collaborated with cross-functional teams to ensure compliance and security oversight across university departments</li>
                  </ul>
                </div>

                <div className="resume-item">
                  <h4>Math Tutor</h4>
                  <p><em>Mathnasium, Tallahassee, FL</em></p>
                  <h5>Sept 2022 - Aug 2023</h5>
                  <ul>
                    <li>Improved students' math grades by one letter grade on average through tailored instruction and problem-solving strategies</li>
                    <li>Achieved an improvement of at least 20% on students' math portion for college admission standardized test scores</li>
                  </ul>
                </div>

                <div className="resume-item">
                  <h4>Technician Assistant</h4>
                  <p><em>Escambia County School District, Pensacola, FL</em></p>
                  <h5>Aug 2020 - June 2021</h5>
                  <ul>
                    <li>Provided technical support, installed, tested, and troubleshot approximately 200 various computer systems</li>
                    <li>Resolved hardware and software issues for various devices including printers, projectors, and computers, enhancing the institution's technological efficiency</li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-6" data-aos="fade-up">
                <h3 className="resume-title">Education</h3>
                <div className="resume-item">
                  <h4>Bachelor of Science in Computer Science</h4>
                  <p><em>Florida State University, Tallahassee, FL. | GPA: 3.5</em></p>
                  <h5>Aug 2021 - Dec 2024</h5>
                </div>

                <h3 className="resume-title">Certifications</h3>
                <div className="resume-item">
                  <h4>Google Cybersecurity Professional</h4>
                  <p><em>Google</em></p>
                  <h5>December 2024</h5>
                  <h4>Microsoft Specialists (Powerpoint, Word, Excel)</h4>
                  <p><em>Microsoft</em></p>
                  <h5>December 2020</h5>
                  <h4>Photoshop, Premier Pro, Dreamweaver</h4>
                  <p><em>Adobe</em></p>
                  <h5>December 2020</h5>
                </div>
              </div>
            </div>

            <div>
              <h3 className="resume-title">Downloadable Links</h3>
              <div className="resume-item pb-0">
                <h4>Download Files</h4>
                <div className="button-container">
                  <button type="button" className="download" onClick={() => window.open('/assets/img/Abe_Pasion_SWE_Resume', '_blank')}>
                    Download Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="portfolio section-bg">
          <div className="container">
            <div className="section-title">
              <h2>Projects</h2>
            </div>

            <div className="row portfolio-container" data-aos="fade-up" data-aos-delay="75">
              <div className="col-lg-4 col-md-6 portfolio-item filter-app">
                <div className="portfolio-wrap">
                  <img src="/assets/img/portfolio/CookBook_cover.png" className="img-fluid" alt="" />
                  <div className="portfolio-links">
                    <Link to="/recipes" title="More Details"><i className="bx bx-link"></i></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Portfolio; 