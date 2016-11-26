
    /* Firebase Initialization */

    let app = firebase.initializeApp({
        apiKey              : "AIzaSyCwTxqweoW_WlVhod9HNJ1S3QvWccTffJo",
        authDomain          : "storyforge-e4bd9.firebaseapp.com",
        databaseURL         : "https://storyforge-e4bd9.firebaseio.com",
        storageBucket       : "storyforge-e4bd9.appspot.com",
        messagingSenderId   : "732804594438",
    });
    let db = firebase.database(app)

    /* React-Router Imports */

    let BrowserRouter   = ReactRouter.BrowserRouter,
        Link            = ReactRouter.Link,
        Match           = ReactRouter.Match,
        Miss            = ReactRouter.Miss;

    /* Utility Functions */

    function valWithID (snapshot) {
        let val = snapshot.val();
        val._id = snapshot.key;
        return val;
    }

    /* Layout */

    class App extends React.Component {
        render () { return (
            <div id="app">
                <Header />
                <Match pattern="/"                component={ HomePage          } exactly />
                <Match pattern="/about"           component={ AboutPage         } />
                <Match pattern="/browse"          component={ BrowseStoriesPage } />
                <Match pattern="/authors/:author" component={ AuthorPage        } />
                <Match pattern="/stories/:slug"   component={ StoryPage         } />
                <Footer />
            </div>
        )}
    }

    class Header extends React.Component {
        render () { return (
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
        )}
    }

    class Footer extends React.Component {
        render () { return (
            <div id="footer" className="panel">&copy; 2016 Jon Pawelko</div>
        )}
    }

    /* Utility */

    class LoaderPanel extends React.Component {
        render () { return (
            <div className="panel">Loading ...</div>
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
                <StoryList recent="3" />
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
                <h2>Profile for { this.props.author }</h2>
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
            this.query = db.ref('stories').orderByChild('slug').equalTo(this.props.params.slug);
            this.query.on( 'value', function( snapshot ) {
                this.setState( Object.values(snapshot.val())[0] );
                this.setState({ loaded: true });
            }.bind(this));
        }

        componentWillUnmount () {
            this.query.off();
        }

        render () { if (!this.state.loaded) return <LoaderPanel />; console.log(`StoryPage.render`); return (
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
                <h3>by <Link to={ `/authors/${this.props.author}` }>{ this.props.author }</Link>, started on { this.props.created_at } ({ this.props.node_count } nodes)</h3>
                <p>{ this.props.description }</p>
            </div>
        )}
    }

    class StoryNodePanel extends React.Component {
        constructor (props) {
            super(props);
            console.log(`StoryNodePanel(${this.props.params.id})`);
            this.state = {
                content: 'loading ...',
                options: {}
            };

            this.loadStoryNode(this.props.params.id);
        }

        componentWillReceiveProps (nextProps) {
            console.log(`StoryNodePanel(${this.props.params.id}).componentWillReceiveProps: `, nextProps);
            if (nextProps.params.id != this.props.params.id) this.loadStoryNode(nextProps.params.id);
        }

        loadStoryNode (id) {
            if (this.query) this.query.off();  // first cancel previous subscription

            this.query = db.ref( `story_nodes/${id}` );
            this.query.on( 'value', function( snapshot ) {
                console.log(`StoryNodePanel(${id}) -> data received: `, snapshot.val());
                let newState = snapshot.val();
                if (!newState.options) newState.options = {};
                this.setState( newState );
            }.bind(this));
        }

        componentWillUnmount () {
            this.query.off();
        }

        render () { console.log(`StoryNodePanel(${this.props.params.id}).render`); return (
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

    /* Components */

    class StoryList extends React.Component {
        constructor (props) {
            super(props);
            this.state = { stories: [] };
        }

        componentWillMount () {
            this.query = db.ref('stories');
            if (this.props.author) {
                this.query = this.query.orderByChild('author').equalTo(this.props.author);
            } else if (this.props.recent) {
                this.query = this.query.orderByChild('created_at').limitToLast(3);
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
                    &nbsp;by <Link to={ `/authors/${this.props.author}` }>{ this.props.author }</Link>
                </h3>
                <h4>Started on { this.props.created_at } &mdash; { this.props.node_count } nodes</h4>
                <p>{ this.props.description }</p>
            </div>
        )}
    }

    /* Start App */

    ReactDOM.render( <BrowserRouter><App /></BrowserRouter>, document.getElementById('root') );

