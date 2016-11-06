
//    ReactDOM.render( <h1>Hello, world!</h1>, document.getElementById('root') );

    var BrowserRouter   = ReactRouter.BrowserRouter,
        Link            = ReactRouter.Link,
        Match           = ReactRouter.Match,
        Miss            = ReactRouter.Miss;

    const App = () => (
        <BrowserRouter>
            <div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>

                <Match exactly pattern="/" component={Home} />
                <Match pattern="/about" component={About} />
            </div>
        </BrowserRouter>
    )
    const Home   = () => ( <div><h2>Home</h2></div> )
    const About  = () => ( <div><h2>About</h2></div> )

    ReactDOM.render( <App />, document.getElementById('root') );

