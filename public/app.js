
    /* Firebase Initialization */

    let APP = firebase.initializeApp({
        apiKey              : "AIzaSyCwTxqweoW_WlVhod9HNJ1S3QvWccTffJo",
        authDomain          : "storyforge-e4bd9.firebaseapp.com",
        databaseURL         : "https://storyforge-e4bd9.firebaseio.com",
        storageBucket       : "storyforge-e4bd9.appspot.com",
        messagingSenderId   : "732804594438",
    });
    let AUTH = firebase.auth(APP);
    let DB   = firebase.database(APP);

    let PROFILES = {};
    DB.ref('users').on( 'value', function( snapshot ) {
        PROFILES = snapshot.val()
    });


    /* React-Router Imports */

    let BrowserRouter   = ReactRouter.BrowserRouter,
        Link            = ReactRouter.Link,
        Match           = ReactRouter.Match,
        Miss            = ReactRouter.Miss;

    /* Utility Functions */

    function bindToAuth (that) {
        that.unbindAuth = AUTH.onAuthStateChanged( function (user) {
            if (user) {
console.log( 'onAuthStateChanged -> signed in' );
                that.setState({ user: user });
            } else {
console.log( 'onAuthStateChanged -> NOT signed in' );
                that.setState({ user: null });
            }
        });
    }

    function displayName (uid) {
        return PROFILES[uid] ? PROFILES[uid].displayName : '';
    }

    function valWithID (snapshot) {
        let val = snapshot.val();
        val._id = snapshot.key;
        return val;
    }

    /* Utility Components */

    class LoaderPanel extends React.Component {
        render () { return (
            <div className="panel">Loading ...</div>
        )}
    }

    /* Layout */

    class App extends React.Component {
        render () { return (
            <div id="app">
                <Header />
                <Match pattern="/"                component={ HomePage          } exactly />
                <Match pattern="/about"           component={ AboutPage         } />
                <Match pattern="/browse"          component={ BrowseStoriesPage } />
                <Match pattern="/login"           component={ LoginPage         } />
                <Match pattern="/new"             component={ NewStoryPage      } />
                <Match pattern="/signup"          component={ SignUpPage        } />
                <Match pattern="/authors/:author" component={ AuthorPage        } />
                <Match pattern="/stories/:slug"   component={ StoryPage         } />
                <Footer />
            </div>
        )}
    }

    class Header extends React.Component {
        constructor (props) {
            super(props);
            this.state = {};

            bindToAuth(this);

            this.handleLogoutClick = this.handleLogoutClick.bind(this)
        }

        handleLogoutClick (event) {
            console.log( 'Header.handleLogoutClick' );
            event.preventDefault();
            AUTH.signOut();
        }

        render () { return (
            <nav id="header">
                <ul>
                    <li><Link to="/browse">Browse Stories</Link></li>
                    { this.state.user && <li><Link to={ `/authors/${this.state.user.uid}` }>My Stories</Link></li> }
                    { this.state.user && <li><Link to="/new">New Story</Link></li> }
                    <li><Link to="/about">About</Link></li>
                    <li>{ this.state.user ?
                        <a href="#" onClick={ this.handleLogoutClick }>Logout</a>
                    :
                        <Link to="/login">Login</Link>
                    }</li>
                </ul>
                <h1><Link to="/">StoryForge</Link></h1>
            </nav>
        )}
    }

    class Footer extends React.Component {
        render () { return (
            <div id="footer" className="panel">&copy; 2016 Jon Pawelko</div>
        )}
    }

    /* Page -- Login */

    class LoginPage extends React.Component {
        constructor (props) {
            super(props);
            this.state = {};

            bindToAuth(this);

            this.handleSubmit = this.handleSubmit.bind(this);
        }

        componentWillUnmount () {
            this.unbindAuth();
        }

        handleSubmit (event) {
            console.log( 'LoginPage.handleSubmit' );
            event.preventDefault();
            let email    = event.target.email.value;
            let password = event.target.password.value;
            AUTH.signInWithEmailAndPassword( email, password ).catch( function (error) {
                console.log( '*** error: ', error );
            });
        }

        render () { return (
            <div className="panel">
                <h2>Login</h2>
            { this.state.user ?
                <p>You are logged in.</p>
            :
                <form onSubmit={ this.handleSubmit }>
                    <label>Email</label> <input type="email" name="email" required />
                    <label>Password</label> <input type="password" name="password" required />
                    <button type="submit">Submit</button>
                    <p><Link to="/signup">Sign up for a new account.</Link></p>
                </form>
            }
            </div>
        )}
    }

    /* Page -- Sign Up */

    class SignUpPage extends React.Component {
        constructor (props) {
            super(props);
            this.state = {};

            bindToAuth(this);

            this.handleSubmit = this.handleSubmit.bind(this);
        }

        componentWillUnmount () {
            this.unbindAuth();
        }

        handleSubmit (event) {
            console.log( 'SignUpPage.handleSubmit' );
            event.preventDefault();

            let displayName = event.target.displayName.value;
            let email       = event.target.email.value;
            let password    = event.target.password.value;

            AUTH.createUserWithEmailAndPassword( email, password ).then( function (user) {
                DB.ref(`/users/${user.uid}`).set({ displayName: displayName });
            }, function (error) {
                console.log( '*** error: ', error );
            });
        }

        render () { return (
            <div className="panel">
                <h2>Sign Up</h2>
            { this.state.user ?
                <p>You are logged in.</p>
            :
                <form onSubmit={ this.handleSubmit }>
                    <label>Name</label> <input type="text" name="displayName" required />
                    <label>Email</label> <input type="email" name="email" required />
                    <label>Password</label> <input type="password" name="password" required />
                    <button type="submit">Submit</button>
                </form>
            }
            </div>
        )}
    }

    /* Page -- Home */

    class HomePage extends React.Component {
        render () { return (
            <div>
                <WelcomePanel />
                <NewStoriesPanel />
            </div>
        )}
    }

    class WelcomePanel extends React.Component {
        render () { return (
            <div className="panel">Welcome to StoryForge! Insert explanation here...</div>
        )}
    }

    class NewStoriesPanel extends React.Component {
        render () { return (
            <div className="panel">
                <h2>New Stories</h2>
                <StoryList recent={3} />
            </div>
        )}
    }

    /* Page -- BrowseStories */

    class BrowseStoriesPage extends React.Component {
        render () { return (
            <div className="panel">
                <h2>Browse Stories</h2>
                <StoryList />
            </div>
        )}
    }

    /* Page -- About */

    class AboutPage extends React.Component {
        render () { return (
            <div className="panel">
                <h2>About</h2>
                <p>This is a demo app.</p>
            </div>
        )}
    }

    /* Page -- Author */

    class AuthorPage extends React.Component {
        render () { return (
            <div>
                <AuthorProfilePanel author={ this.props.params.author } />
                <AuthorStoriesPanel author={ this.props.params.author } />
            </div>
        )}
    }

    class AuthorProfilePanel extends React.Component {
        render () { return (
            <div className="panel">
                <h2>Profile for { displayName(this.props.author) }</h2>
            </div>
        )}
    }

    class AuthorStoriesPanel extends React.Component {
        render () { return (
            <div className="panel">
                <h2>Stories</h2>
                <StoryList author={ this.props.author } />
            </div>
        )}
    }

    /* Page -- Story */

    class StoryPage extends React.Component {
        constructor (props) {
            super(props);
            this.state = { loaded: false };

            // load story
            this.query = DB.ref('stories').orderByChild('slug').equalTo(this.props.params.slug);
            this.query.on( 'value', function( snapshot ) {
                this.setState( Object.values(snapshot.val())[0] );
                this.setState({ loaded: true });
            }.bind(this));
        }

        componentWillUnmount () {
            this.query.off();
        }

        render () { if (!this.state.loaded) return <LoaderPanel />; console.log( `StoryPage.render` ); return (
            <div>
                <StoryHeaderPanel {...this.state} />
                <StoryNodePanel params={{ id: this.state.first_node_id }} pathname={ this.props.pathname } />
            </div>
        )}
    }

    class StoryHeaderPanel extends React.Component {
        render () { return (
            <div className="panel story-page clearfix">
                <img src="/story.png" />
                <h2>{ this.props.title }</h2>
                <h3>
                    by <Link to={ `/authors/${this.props.author}` }>{ displayName(this.props.author) }</Link>,
                    started on { this.props.created_at } ({ this.props.node_count } nodes)
                </h3>
                <p>{ this.props.description }</p>
            </div>
        )}
    }

    class StoryNodePanel extends React.Component {
        constructor (props) {
            super(props);
            console.log( `StoryNodePanel(${this.props.params.id})` );
            this.state = {
                content: 'loading ...',
                options: {}
            };

            this.loadStoryNode(this.props.params.id);
        }

        componentWillReceiveProps (nextProps) {
            console.log( `StoryNodePanel(${this.props.params.id}).componentWillReceiveProps: `, nextProps );
            if (nextProps.params.id != this.props.params.id) this.loadStoryNode(nextProps.params.id);
        }

        loadStoryNode (id) {
            if (this.query) this.query.off();  // first cancel previous subscription

            this.query = DB.ref( `story_nodes/${id}` );
            this.query.on( 'value', function( snapshot ) {
                console.log( `StoryNodePanel(${id}) -> data received: `, snapshot.val() );
                let newState = snapshot.val();
                if (!newState.options) newState.options = {};
                this.setState( newState );
            }.bind(this));
        }

        componentWillUnmount () {
            this.query.off();
        }

        render () { console.log( `StoryNodePanel(${this.props.params.id}).render` ); return (
            <div>
                <div className="panel">
                    <div className="node-content">{ this.state.content }</div>
                    <ul>
                    { Object.entries(this.state.options).map( (entry) =>
                        <li key={ entry[0] }><Link to={ `${this.props.pathname}/${entry[0]}` }>{ entry[1] }</Link></li>
                    )}
                    </ul>
                </div>
                <Match pattern={`${this.props.pathname}/:id`} component={StoryNodePanel} />
            </div>
        )}
    }

    /* Page -- New Story */

    class NewStoryPage extends React.Component {
        constructor (props) {
            super(props);
            this.state = {};

            this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleSubmit (event) {
            console.log( 'NewStoryPage.handleSubmit' );
            event.preventDefault();

//            let displayName = event.target.displayName.value;
        }

        render () { return (
            <div className="panel new-story">
                <h2>New Story</h2>
                <form onSubmit={ this.handleSubmit }>
                    <label>Title</label> <input type="text" name="title" required />
                    <button type="submit">Submit</button>
                </form>
            </div>
        )}
    }

    /* Components */

    class StoryList extends React.Component {
        constructor (props) {
            super(props);
            this.state = { stories: [] };
        }

        componentWillMount () {
            this.query = DB.ref('stories');
            if (this.props.author) {
                this.query = this.query.orderByChild('author').equalTo(this.props.author);
            } else if (this.props.recent) {
                this.query = this.query.orderByChild('created_at').limitToLast(this.props.recent);
            }

            this.query.on( 'child_added', function( snapshot ) {
                this.setState( (prevState) => ({
                    stories: prevState.stories.concat([ valWithID(snapshot) ])
                }) );
            }.bind(this));
        }

        componentWillUnmount () {
            this.query.off();
        }

        render () { return (
            <ul className="reset">
            { this.state.stories.slice().sort( (a,b) => a.created_at < b.created_at ).map( (story) =>
                <li key={ story._id }><StoryItem { ...story } /></li>
            )}
            </ul>
        )}
    }

    class StoryItem extends React.Component {
        render () { return (
            <div className="story-item">
                <img src="/story.png" />
                <h3>
                    <Link to={ `/stories/${this.props.slug}` }>{ this.props.title }</Link>
                    &nbsp;by <Link to={ `/authors/${this.props.author}` }>{ displayName(this.props.author) }</Link>
                </h3>
                <h4>Started on { this.props.created_at } &mdash; { this.props.node_count } nodes</h4>
                <p>{ this.props.description }</p>
            </div>
        )}
    }

    /* Start App */

    ReactDOM.render( <BrowserRouter><App /></BrowserRouter>, document.getElementById('root') );

