import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase'
import { Button, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Input } from '@material-ui/core';
import SignIn from './SignIn';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {

    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }

}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing[2, 3, 4]
  }
}))

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('')
  const [password, setPasssword] = useState('');
  const [user, setUser] = useState(null)
  const [openSignIn, setOpenSignIn] = useState(false)

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser)
        setUser(authUser)

      } else {
        setUser(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // everytime a new post gets added this code fires
      setPosts(snapshot.docs.map((doc) => (
        {
          id: doc.id,
          post: doc.data()
        }
      )))
    })
  }, [])

  const signup = (e) => {
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
    setOpen(false)
  }

  const signin = (event) => {
    event.preventDefault()
    auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message))
    setOpenSignIn(false)
  }

  return (
    <div className="App">
      <div className="app__right">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" >

            <center>
              <img className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png"
                alt="" />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              />
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPasssword(e.target.value)}
              
            />
            <Button type="submit" onClick={signup}>Sign Up</Button>
          </form>

        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" >

            <center>
              <img className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png"
                alt="" />
            </center>
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPasssword(e.target.value)}
              
            />
            <Button type="submit" onClick={signin}>Sign In</Button>
          </form>

        </div>
      </Modal>
      <div className="app__header">

        <img className="app__headerImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png" alt="" />


        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
            <div className="app__loginContainer">
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          </div>
        )}
      </div>


      <div className="app__posts">

        {
          posts.map(({ post, id }) => (
            <Post user={user} key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
      </div>

      <InstagramEmbed
  url='https://instagr.am/p/Zw9o4/'
  clientAccessToken='123|456'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
        ) :
        (<h3>You have to login to upload a photo</h3>)
      }

      </div>
      <div className="app_left">
        
      </div>
    </div>
  );
}


export default App;
