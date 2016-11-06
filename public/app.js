
    /* Firebase Initialization */

    var app = firebase.initializeApp({
        apiKey              : "AIzaSyCwTxqweoW_WlVhod9HNJ1S3QvWccTffJo",
        authDomain          : "storyforge-e4bd9.firebaseapp.com",
        databaseURL         : "https://storyforge-e4bd9.firebaseio.com",
        storageBucket       : "storyforge-e4bd9.appspot.com",
        messagingSenderId   : "732804594438",
    });

    /* React-Router Imports */

    var BrowserRouter   = ReactRouter.BrowserRouter,
        Link            = ReactRouter.Link,
        Match           = ReactRouter.Match,
        Miss            = ReactRouter.Miss;

    /* Layout */

    const App = () => (
        <div id="app">
            <Header />
            <Match exactly pattern="/" component={Home} />
            <Match pattern="/about"    component={About} />
            <Match pattern="/browse"   component={Browse} />
            <Footer />
        </div>
    )

    const Header = () => (
        <nav id="header">
            <ul>
                <li><Link to="/browse">Browse Stories</Link></li>
{/*
                <li><a href="username1">My Stories</a></li>
                <li><a href="new-story">New Story</a></li>
*/}
                <li><Link to="/about">About</Link></li>
            </ul>
            <h1><Link to="/">StoryForge</Link></h1>
        </nav>
    )

    const Footer = () => (
        <div id="footer" className="panel">&copy; 2016 Jon Pawelko</div>
    )

    /* Pages */

    const Home = () => (
        <div>
            <Welcome />
            <NewStories />
        </div>
    )

    const Welcome = () => (
        <div className="panel">Welcome to StoryForge! Insert explanation here...</div>
    )

    const NewStories = () => (
        <div className="panel">
            <h2>New Stories</h2>
            <ul className="reset">
                <li><StoryItem /></li>
            </ul>
        </div>
    )

    const Browse = () => ( <div><h2>Browse</h2></div> )
    const About  = () => ( <div><h2>About</h2></div> )

    /* Components */

    const StoryItem = () => (
        <div className="story-item">
            <img src="/story.png" />
            <h3><a href="#">name</a> by <a href="#">author</a></h3>
            <h4>Started on created_at &mdash; node_count nodes</h4>
            <p>description</p>
        </div>
    )

    /* Start App */

    ReactDOM.render( <BrowserRouter><App /></BrowserRouter>, document.getElementById('root') );


