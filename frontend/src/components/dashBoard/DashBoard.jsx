import React,{useEffect , useState} from 'react'
import "./dashBoard.css"
import NavBar from '../navBar';
export default function DashBoard() {

  const [repositories ,setRepositories] = useState([]);
  const [searchQuery , setSearchQuery] = useState('')
  const [suggestedRepositories , setSuggestedRepositories] =useState([])
  const [searchResult , setSearchResult] = useState([]);

  useEffect(()=>{
    const userId = localStorage.getItem("userId");

    const fatchReopsitories = async() =>{
      try {
      const responce = await fetch(`http://localhost:8080/repo/user/${userId}`)

      const data = await responce.json();
      console.log(data);
      
      //  
       setRepositories(data.repository);
       
     } catch (err) {
        console.error("Error while fatching repositories",err.message)
      }
     }
    const fatchSuggestedReopsitories = async() =>{
      try {
      const responce = await fetch(`http://localhost:8080/repo/all`)

      const data = await responce.json();
      
       setSuggestedRepositories(data);
       console.log(suggestedRepositories)
        console.log(data);
     } catch (err) {
        console.error("Error while fatching repositories",err.message)
      }
     }
    fatchReopsitories();
    fatchSuggestedReopsitories()
   
  },[]);

  useEffect(()=>{
    if(searchQuery == ''){
      setSearchResult(repositories)
    }else{
      const filterRepo = repositories.filter((repo)=>{
      return repo.userName.toLowerCase().includes(searchQuery.toLowerCase())
      })
      setSearchResult(filterRepo)
    }
  },[searchQuery , repositories]);
 

return (
  <>
  <NavBar />
  <section id="dashboard">

    <aside className="dashboard-sidebar">
      <h2>Suggested Repositories</h2>

      {suggestedRepositories.map((repo) => (
        <div className="repo-card" key={repo._id}>
          <h4>{repo.userName}</h4>
          <p>{repo.description}</p>
        </div>
      ))}
    </aside>

    <main className="dashboard-main">

      <div className="main-header">
        <h2>Your Repositories</h2>
        <span>{searchResult.length} Repositories</span>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="repo-list">
        {searchResult.map((repo) => (
          <div className="repo-card" key={repo._id}>
            <h3>{repo.userName}</h3>
            <p>{repo.description}</p>
          </div>
        ))}
      </div>

    </main>

    <aside className="dashboard-sidebar events">
      <h2>Upcoming Events</h2>

      <ul>
        <li>
          <span className="event-date">15 DEC</span>
          <p>Tech Conference</p>
        </li>
        <li>
          <span className="event-date">20 DEC</span>
          <p>Developer Meetup</p>
        </li>
        <li>
          <span className="event-date">30 DEC</span>
          <p>React Hackathon</p>
        </li>
      </ul>
    </aside>

  </section>
  </>
);

}